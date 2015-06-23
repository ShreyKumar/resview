'use strict';

module.exports = {
	app: {
		title: 'ResView',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/css/font-awesome.min.css',
                'http://shreykumar.com/css/stylish-portfolio.css',
                'public/lib/css/custom.css',
                'public/lib/css/form.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'http://code.jquery.com/jquery-2.1.4.min.js',
                'public/lib/js/form.js',
                
                //google maps
                'https://maps.googleapis.com/maps/api/js?key=AIzaSyCJYOIlObkjUFT4-oGT33mQTjEoJIiTvdE',
                'public/modules/core/js/map.js'
                /*
                'public/lib/js/backstretch.min.js',
                'public/lib/js/counter.js',
                'public/lib/js/jquery.waypoints.min.js',
                'public/lib/js/inview.min.js',
                'public/lib/js/scrolltopcontrol.js',
                'public/lib/js/wow.min.js',
                'public/lib/js/contact.js',
                'public/lib/js/custom.js',
                'public/lib/js/custom_hero.js',
                'public/lib/js/custom_skills.js',
                'public/lib/js/custom_countto.js',
                'public/lib/js/custom_google-map.js'
                */
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};