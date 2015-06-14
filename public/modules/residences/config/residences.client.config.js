'use strict';

// Configuring the Articles module
angular.module('residences').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Residences', 'residences', 'dropdown', '/residences(/create)?');
		Menus.addSubMenuItem('topbar', 'residences', 'List Residences', 'residences');
		Menus.addSubMenuItem('topbar', 'residences', 'New Residence', 'residences/create');
	}
]);