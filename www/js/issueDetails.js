angular.module('citizen-engagement').controller('IssueListCtrl', function(AuthService, $http, $ionicHistory, $ionicLoading, $scope, $state) {
  var issueListCtrl = this;
    $http({
      method: 'GET',
      url: '/api-proxy/issues?include=creator',
    }).then(function(res) {
        issueListCtrl.issues = res.data;
    }).catch(function() {
      issueListCtrl.error = 'Could not found issue';
    });

});