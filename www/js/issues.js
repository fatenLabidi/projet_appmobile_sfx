//controller pour get la liste des issues entière ou perso
angular.module('citizen-engagement').controller('IssueListCtrl', function(AuthService, $http, $ionicHistory, $ionicLoading, $scope, $state) {
  var issueListCtrl = this;
  
  // function qui give l'entier de la liste
  issueListCtrl.showAll = function (){
    $http({
      method: 'GET',
      url: '/api-proxy/issues?include=creator',
    }).then(function(res) {
        issueListCtrl.issues = res.data;
    }).catch(function() {
      issueListCtrl.error = 'Could not found issue';
    })
  };

  // function qui give la liste perso
  issueListCtrl.showMine = function (){
    $http({
      method: 'GET',
      url: '/api-proxy/me/issues?include=creator',
    }).then(function(res) {
        issueListCtrl.issues = res.data;
    }).catch(function() {
      issueListCtrl.error = 'Could not found issue';
    });
  };


  issueListCtrl.showAll ();

});

//controller pour get une seul issue

angular.module('citizen-engagement').controller('IssueDetailsCtrl', function(AuthService, $http, $ionicHistory, $ionicLoading, $scope, $state) {
  var issueDetailsCtrl = this;
    $http({
      method: 'GET',
      url: '/api-proxy/issues/{id}',
    }).then(function(res) {
        issueDetailsCtrl.issues = res.data;
    }).catch(function() {
      issueDetailsCtrl.error = 'Could not found issue';
    });
});