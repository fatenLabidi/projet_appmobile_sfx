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


/*/angular.module('citizen-engagement').controller('IssueMyListCtrl', function(AuthService, $http, $ionicHistory, $ionicLoading, $scope, $state) {
  var issueMyListCtrl = this;
    $http({
      method: 'GET',
      url: '/api-proxy/issues',
    }).then(function(res) {
        issueMyListCtrl.issues = res.data;
          $http({
            method:'GET',
            url: '/api-proxy/me'
          }).then(function(response){
            If(issueMyListCtrl.name == response.data.name){
              return issueMyListCtrl
            }
          });
    }).catch(function() {
      issueMyListCtrl.error = 'Could not found issue';
    });

});/*/