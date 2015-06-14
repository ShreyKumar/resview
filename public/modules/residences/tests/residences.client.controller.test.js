'use strict';

(function() {
	// Residences Controller Spec
	describe('Residences Controller Tests', function() {
		// Initialize global variables
		var ResidencesController,
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

			// Initialize the Residences controller.
			ResidencesController = $controller('ResidencesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Residence object fetched from XHR', inject(function(Residences) {
			// Create sample Residence using the Residences service
			var sampleResidence = new Residences({
				name: 'New Residence'
			});

			// Create a sample Residences array that includes the new Residence
			var sampleResidences = [sampleResidence];

			// Set GET response
			$httpBackend.expectGET('residences').respond(sampleResidences);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.residences).toEqualData(sampleResidences);
		}));

		it('$scope.findOne() should create an array with one Residence object fetched from XHR using a residenceId URL parameter', inject(function(Residences) {
			// Define a sample Residence object
			var sampleResidence = new Residences({
				name: 'New Residence'
			});

			// Set the URL parameter
			$stateParams.residenceId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/residences\/([0-9a-fA-F]{24})$/).respond(sampleResidence);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.residence).toEqualData(sampleResidence);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Residences) {
			// Create a sample Residence object
			var sampleResidencePostData = new Residences({
				name: 'New Residence'
			});

			// Create a sample Residence response
			var sampleResidenceResponse = new Residences({
				_id: '525cf20451979dea2c000001',
				name: 'New Residence'
			});

			// Fixture mock form input values
			scope.name = 'New Residence';

			// Set POST response
			$httpBackend.expectPOST('residences', sampleResidencePostData).respond(sampleResidenceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Residence was created
			expect($location.path()).toBe('/residences/' + sampleResidenceResponse._id);
		}));

		it('$scope.update() should update a valid Residence', inject(function(Residences) {
			// Define a sample Residence put data
			var sampleResidencePutData = new Residences({
				_id: '525cf20451979dea2c000001',
				name: 'New Residence'
			});

			// Mock Residence in scope
			scope.residence = sampleResidencePutData;

			// Set PUT response
			$httpBackend.expectPUT(/residences\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/residences/' + sampleResidencePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid residenceId and remove the Residence from the scope', inject(function(Residences) {
			// Create new Residence object
			var sampleResidence = new Residences({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Residences array and include the Residence
			scope.residences = [sampleResidence];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/residences\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleResidence);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.residences.length).toBe(0);
		}));
	});
}());