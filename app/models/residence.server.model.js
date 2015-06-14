'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Residence Schema
 */
var ResidenceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Residence name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Residence', ResidenceSchema);