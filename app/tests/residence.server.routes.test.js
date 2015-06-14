'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Residence = mongoose.model('Residence'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, residence;

/**
 * Residence routes tests
 */
describe('Residence CRUD tests', function() {
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

		// Save a user to the test db and create new Residence
		user.save(function() {
			residence = {
				name: 'Residence Name'
			};

			done();
		});
	});

	it('should be able to save Residence instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Residence
				agent.post('/residences')
					.send(residence)
					.expect(200)
					.end(function(residenceSaveErr, residenceSaveRes) {
						// Handle Residence save error
						if (residenceSaveErr) done(residenceSaveErr);

						// Get a list of Residences
						agent.get('/residences')
							.end(function(residencesGetErr, residencesGetRes) {
								// Handle Residence save error
								if (residencesGetErr) done(residencesGetErr);

								// Get Residences list
								var residences = residencesGetRes.body;

								// Set assertions
								(residences[0].user._id).should.equal(userId);
								(residences[0].name).should.match('Residence Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Residence instance if not logged in', function(done) {
		agent.post('/residences')
			.send(residence)
			.expect(401)
			.end(function(residenceSaveErr, residenceSaveRes) {
				// Call the assertion callback
				done(residenceSaveErr);
			});
	});

	it('should not be able to save Residence instance if no name is provided', function(done) {
		// Invalidate name field
		residence.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Residence
				agent.post('/residences')
					.send(residence)
					.expect(400)
					.end(function(residenceSaveErr, residenceSaveRes) {
						// Set message assertion
						(residenceSaveRes.body.message).should.match('Please fill Residence name');
						
						// Handle Residence save error
						done(residenceSaveErr);
					});
			});
	});

	it('should be able to update Residence instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Residence
				agent.post('/residences')
					.send(residence)
					.expect(200)
					.end(function(residenceSaveErr, residenceSaveRes) {
						// Handle Residence save error
						if (residenceSaveErr) done(residenceSaveErr);

						// Update Residence name
						residence.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Residence
						agent.put('/residences/' + residenceSaveRes.body._id)
							.send(residence)
							.expect(200)
							.end(function(residenceUpdateErr, residenceUpdateRes) {
								// Handle Residence update error
								if (residenceUpdateErr) done(residenceUpdateErr);

								// Set assertions
								(residenceUpdateRes.body._id).should.equal(residenceSaveRes.body._id);
								(residenceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Residences if not signed in', function(done) {
		// Create new Residence model instance
		var residenceObj = new Residence(residence);

		// Save the Residence
		residenceObj.save(function() {
			// Request Residences
			request(app).get('/residences')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Residence if not signed in', function(done) {
		// Create new Residence model instance
		var residenceObj = new Residence(residence);

		// Save the Residence
		residenceObj.save(function() {
			request(app).get('/residences/' + residenceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', residence.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Residence instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Residence
				agent.post('/residences')
					.send(residence)
					.expect(200)
					.end(function(residenceSaveErr, residenceSaveRes) {
						// Handle Residence save error
						if (residenceSaveErr) done(residenceSaveErr);

						// Delete existing Residence
						agent.delete('/residences/' + residenceSaveRes.body._id)
							.send(residence)
							.expect(200)
							.end(function(residenceDeleteErr, residenceDeleteRes) {
								// Handle Residence error error
								if (residenceDeleteErr) done(residenceDeleteErr);

								// Set assertions
								(residenceDeleteRes.body._id).should.equal(residenceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Residence instance if not signed in', function(done) {
		// Set Residence user 
		residence.user = user;

		// Create new Residence model instance
		var residenceObj = new Residence(residence);

		// Save the Residence
		residenceObj.save(function() {
			// Try deleting Residence
			request(app).delete('/residences/' + residenceObj._id)
			.expect(401)
			.end(function(residenceDeleteErr, residenceDeleteRes) {
				// Set message assertion
				(residenceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Residence error error
				done(residenceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Residence.remove().exec();
		done();
	});
});