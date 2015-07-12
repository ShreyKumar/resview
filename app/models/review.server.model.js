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
	headline: {
		type: String,
		default: '',
		trim: true
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    agrees: {
        type: Array,
        default: [],
        trim: true
    },
    disagrees: {
        type: Array,
        default: [],
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
    don: {
        type: String,
        default: '0',
        trim: true
    },
    overallexp: {
        type: String,
        default: '',
        trim: true,
        required: 'Please rate your overall experience'
    },
    building: {
        type: String,
        default: 'Please Select:',
        trim: true, 
        required: 'Please enter a valid building'
    },
	created: {
		type: Date,
		default: Date.now
	},
    thoughts: {
        type: Schema.ObjectId,
        ref: 'Thoughts'
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Review', ReviewSchema);