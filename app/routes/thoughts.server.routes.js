'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var thoughts = require('../../app/controllers/thoughts.server.controller');

	// Thoughts Routes
	app.route('/thoughts')
		.get(thoughts.list)
		.post(users.requiresLogin, thoughts.create);

	app.route('/thoughts/:thoughtId')
		.get(thoughts.read)
		.put(users.requiresLogin, thoughts.hasAuthorization, thoughts.update)
		.delete(users.requiresLogin, thoughts.hasAuthorization, thoughts.delete);

	// Finish by binding the Thought middleware
	app.param('thoughtId', thoughts.thoughtByID);
};
