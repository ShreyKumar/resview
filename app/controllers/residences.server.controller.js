'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Residence = mongoose.model('Residence'),
	_ = require('lodash');

/**
 * Create a Residence
 */
exports.create = function(req, res) {
	var residence = new Residence(req.body);
	residence.user = req.user;

	residence.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(residence);
		}
	});
};

/**
 * Show the current Residence
 */
exports.read = function(req, res) {
	res.jsonp(req.residence);
};

/**
 * Update a Residence
 */
exports.update = function(req, res) {
	var residence = req.residence ;

	residence = _.extend(residence , req.body);

	residence.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(residence);
		}
	});
};

/**
 * Delete an Residence
 */
exports.delete = function(req, res) {
	var residence = req.residence ;

	residence.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(residence);
		}
	});
};

/**
 * List of Residences
 */
exports.list = function(req, res) { 
	Residence.find().sort('-created').populate('user', 'displayName').exec(function(err, residences) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(residences);
		}
	});
};

/**
 * Residence middleware
 */
exports.residenceByID = function(req, res, next, id) { 
	Residence.findById(id).populate('user', 'displayName').exec(function(err, residence) {
		if (err) return next(err);
		if (! residence) return next(new Error('Failed to load Residence ' + id));
		req.residence = residence ;
		next();
	});
};

/**
 * Residence authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.residence.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
