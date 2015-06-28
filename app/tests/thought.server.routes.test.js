'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Thought = mongoose.model('Thought'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, thought;

/**
 * Thought routes tests
 */
describe('Thought CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Thought
		user.save(function() {
			thought = {
				name: 'Thought Name'
			};

			done();
		});
	});

	it('should be able to save Thought instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Thought
				agent.post('/thoughts')
					.send(thought)
					.expect(200)
					.end(function(thoughtSaveErr, thoughtSaveRes) {
						// Handle Thought save error
						if (thoughtSaveErr) done(thoughtSaveErr);

						// Get a list of Thoughts
						agent.get('/thoughts')
							.end(function(thoughtsGetErr, thoughtsGetRes) {
								// Handle Thought save error
								if (thoughtsGetErr) done(thoughtsGetErr);

								// Get Thoughts list
								var thoughts = thoughtsGetRes.body;

								// Set assertions
								(thoughts[0].user._id).should.equal(userId);
								(thoughts[0].name).should.match('Thought Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Thought instance if not logged in', function(done) {
		agent.post('/thoughts')
			.send(thought)
			.expect(401)
			.end(function(thoughtSaveErr, thoughtSaveRes) {
				// Call the assertion callback
				done(thoughtSaveErr);
			});
	});

	it('should not be able to save Thought instance if no name is provided', function(done) {
		// Invalidate name field
		thought.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Thought
				agent.post('/thoughts')
					.send(thought)
					.expect(400)
					.end(function(thoughtSaveErr, thoughtSaveRes) {
						// Set message assertion
						(thoughtSaveRes.body.message).should.match('Please fill Thought name');
						
						// Handle Thought save error
						done(thoughtSaveErr);
					});
			});
	});

	it('should be able to update Thought instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Thought
				agent.post('/thoughts')
					.send(thought)
					.expect(200)
					.end(function(thoughtSaveErr, thoughtSaveRes) {
						// Handle Thought save error
						if (thoughtSaveErr) done(thoughtSaveErr);

						// Update Thought name
						thought.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Thought
						agent.put('/thoughts/' + thoughtSaveRes.body._id)
							.send(thought)
							.expect(200)
							.end(function(thoughtUpdateErr, thoughtUpdateRes) {
								// Handle Thought update error
								if (thoughtUpdateErr) done(thoughtUpdateErr);

								// Set assertions
								(thoughtUpdateRes.body._id).should.equal(thoughtSaveRes.body._id);
								(thoughtUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Thoughts if not signed in', function(done) {
		// Create new Thought model instance
		var thoughtObj = new Thought(thought);

		// Save the Thought
		thoughtObj.save(function() {
			// Request Thoughts
			request(app).get('/thoughts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Thought if not signed in', function(done) {
		// Create new Thought model instance
		var thoughtObj = new Thought(thought);

		// Save the Thought
		thoughtObj.save(function() {
			request(app).get('/thoughts/' + thoughtObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', thought.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Thought instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Thought
				agent.post('/thoughts')
					.send(thought)
					.expect(200)
					.end(function(thoughtSaveErr, thoughtSaveRes) {
						// Handle Thought save error
						if (thoughtSaveErr) done(thoughtSaveErr);

						// Delete existing Thought
						agent.delete('/thoughts/' + thoughtSaveRes.body._id)
							.send(thought)
							.expect(200)
							.end(function(thoughtDeleteErr, thoughtDeleteRes) {
								// Handle Thought error error
								if (thoughtDeleteErr) done(thoughtDeleteErr);

								// Set assertions
								(thoughtDeleteRes.body._id).should.equal(thoughtSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Thought instance if not signed in', function(done) {
		// Set Thought user 
		thought.user = user;

		// Create new Thought model instance
		var thoughtObj = new Thought(thought);

		// Save the Thought
		thoughtObj.save(function() {
			// Try deleting Thought
			request(app).delete('/thoughts/' + thoughtObj._id)
			.expect(401)
			.end(function(thoughtDeleteErr, thoughtDeleteRes) {
				// Set message assertion
				(thoughtDeleteRes.body.message).should.match('User is not logged in');

				// Handle Thought error error
				done(thoughtDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Thought.remove().exec();
		done();
	});
});