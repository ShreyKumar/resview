'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Thought = mongoose.model('Thought'),
	_ = require('lodash');

/**
 * Create a Thought
 */
exports.create = function(req, res) {
	var thought = new Thought(req.body);
	thought.user = req.user;

	thought.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(thought);
		}
	});
};

/**
 * Show the current Thought
 */
exports.read = function(req, res) {
	res.jsonp(req.thought);
};

/**
 * Update a Thought
 */
exports.update = function(req, res) {
	var thought = req.thought ;

	thought = _.extend(thought , req.body);

	thought.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(thought);
		}
	});
};

/**
 * Delete an Thought
 */
exports.delete = function(req, res) {
	var thought = req.thought ;

	thought.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(thought);
		}
	});
};

/**
 * List of Thoughts
 */
exports.list = function(req, res) { 
	Thought.find().sort('-created').populate('user', 'displayName').exec(function(err, thoughts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(thoughts);
		}
	});
};

/**
 * Thought middleware
 */
exports.thoughtByID = function(req, res, next, id) { 
	Thought.findById(id).populate('user', 'displayName').exec(function(err, thought) {
		if (err) return next(err);
		if (! thought) return next(new Error('Failed to load Thought ' + id));
		req.thought = thought ;
		next();
	});
};

/**
 * Thought authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.thought.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
