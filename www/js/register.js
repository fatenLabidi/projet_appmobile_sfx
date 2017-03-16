angular.module('citizen-engagement').controller('RegisterCtrl', function(AuthService, $http, $ionicHistory, $ionicLoading, $scope, $state) {
  var registerCtrl = this;

  // The $ionicView.beforeEnter event happens every time the screen is displayed.
  $scope.$on('$ionicView.beforeEnter', function() {
    // Re-initialize the user object every time the screen is displayed.
    // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.
    registerCtrl.user = {};
  });

  // Add the register function to the scope.
  registerCtrl.register = function() {

    // Forget the previous error (if any).
    delete registerCtrl.error;

    // Show a loading message if the request takes too long.
    $ionicLoading.show({
      template: 'Register ...',
      delay: 750
    });

    // Make the request to retrieve or create the user.
    $http({
      method: 'POST',
      url: '/api-proxy/auth',
      data: registerCtrl.user
    }).then(function(res) {

      // If successful, give the token to the authentication service.
      AuthService.setAuthToken(res.data.token);

      // Hide the loading message.
      $ionicLoading.hide();

      // Set the next view as the root of the history.
      // Otherwise, the next screen will have a "back" arrow pointing back to the login screen.
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });

      // Go to the issue creation tab.
      $state.go('tab.newIssue');

    }).catch(function() {

      // If an error occurs, hide the loading message and show an error message.
      $ionicLoading.hide();
      loginCtrl.error = 'Could not log in.';
    });
  };
});