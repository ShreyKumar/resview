'use strict';

// Thoughts controller
angular.module('thoughts').controller('ThoughtsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Thoughts',
	function($scope, $stateParams, $location, Authentication, Thoughts) {
		$scope.authentication = Authentication;

		// Create new Thought
		$scope.create = function() {
			// Create new Thought object
			var thought = new Thoughts ({
				name: this.name
			});

			// Redirect after save
			thought.$save(function(response) {
				$location.path('thoughts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Thought
		$scope.remove = function(thought) {
			if ( thought ) { 
				thought.$remove();

				for (var i in $scope.thoughts) {
					if ($scope.thoughts [i] === thought) {
						$scope.thoughts.splice(i, 1);
					}
				}
			} else {
				$scope.thought.$remove(function() {
					$location.path('thoughts');
				});
			}
		};

		// Update existing Thought
		$scope.update = function() {
			var thought = $scope.thought;

			thought.$update(function() {
				$location.path('thoughts/' + thought._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Thoughts
		$scope.find = function() {
			$scope.thoughts = Thoughts.query();
		};

		// Find existing Thought
		$scope.findOne = function() {
			$scope.thought = Thoughts.get({ 
				thoughtId: $stateParams.thoughtId
			});
		};
	}
]);