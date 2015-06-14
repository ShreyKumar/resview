'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var residences = require('../../app/controllers/residences.server.controller');

	// Residences Routes
	app.route('/residences')
		.get(residences.list)
		.post(users.requiresLogin, residences.create);

	app.route('/residences/:residenceId')
		.get(residences.read)
		.put(users.requiresLogin, residences.hasAuthorization, residences.update)
		.delete(users.requiresLogin, residences.hasAuthorization, residences.delete);

	// Finish by binding the Residence middleware
	app.param('residenceId', residences.residenceByID);
};
