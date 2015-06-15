'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Review Schema
 */
var ReviewSchema = new Schema({
	name: {
		type: String,
		default: 'Anonymous',
		trim: true
	},
    comments: {
        type: String,
        default: '',
        trim: true
    },
    foodquality: {
        type: String,
        default: '0',
        required: 'Please rate the overall food quality',
        trim: true
    },
    convinience: {
        type: String,
        default: '0',
        required: 'Please rate the convinience',
        trim: true
    },
    overallexp: {
        type: String,
        default: '0',
        required: 'Please rate your overall experience',
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

mongoose.model('Review', ReviewSchema);