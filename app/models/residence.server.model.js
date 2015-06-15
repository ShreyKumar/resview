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
    foodquality: {
        type: String,
        default: '0',
        trim: true
    },
    convinience: {
        type: String,
        default: '0',
        trim: true
    },
    overallexp: {
        type: String,
        default: '0',
        trim: true
    },
    reviews: {
        type: Array,
        default: [],
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