'use strict';

(function() {
	// Thoughts Controller Spec
	describe('Thoughts Controller Tests', function() {
		// Initialize global variables
		var ThoughtsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Thoughts controller.
			ThoughtsController = $controller('ThoughtsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Thought object fetched from XHR', inject(function(Thoughts) {
			// Create sample Thought using the Thoughts service
			var sampleThought = new Thoughts({
				name: 'New Thought'
			});

			// Create a sample Thoughts array that includes the new Thought
			var sampleThoughts = [sampleThought];

			// Set GET response
			$httpBackend.expectGET('thoughts').respond(sampleThoughts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.thoughts).toEqualData(sampleThoughts);
		}));

		it('$scope.findOne() should create an array with one Thought object fetched from XHR using a thoughtId URL parameter', inject(function(Thoughts) {
			// Define a sample Thought object
			var sampleThought = new Thoughts({
				name: 'New Thought'
			});

			// Set the URL parameter
			$stateParams.thoughtId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/thoughts\/([0-9a-fA-F]{24})$/).respond(sampleThought);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.thought).toEqualData(sampleThought);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Thoughts) {
			// Create a sample Thought object
			var sampleThoughtPostData = new Thoughts({
				name: 'New Thought'
			});

			// Create a sample Thought response
			var sampleThoughtResponse = new Thoughts({
				_id: '525cf20451979dea2c000001',
				name: 'New Thought'
			});

			// Fixture mock form input values
			scope.name = 'New Thought';

			// Set POST response
			$httpBackend.expectPOST('thoughts', sampleThoughtPostData).respond(sampleThoughtResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Thought was created
			expect($location.path()).toBe('/thoughts/' + sampleThoughtResponse._id);
		}));

		it('$scope.update() should update a valid Thought', inject(function(Thoughts) {
			// Define a sample Thought put data
			var sampleThoughtPutData = new Thoughts({
				_id: '525cf20451979dea2c000001',
				name: 'New Thought'
			});

			// Mock Thought in scope
			scope.thought = sampleThoughtPutData;

			// Set PUT response
			$httpBackend.expectPUT(/thoughts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/thoughts/' + sampleThoughtPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid thoughtId and remove the Thought from the scope', inject(function(Thoughts) {
			// Create new Thought object
			var sampleThought = new Thoughts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Thoughts array and include the Thought
			scope.thoughts = [sampleThought];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/thoughts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleThought);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.thoughts.length).toBe(0);
		}));
	});
}());