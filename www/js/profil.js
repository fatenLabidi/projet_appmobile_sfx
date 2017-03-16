angular.module('citizen-engagement').controller('profilCtrl', function(AuthService, $http, $ionicHistory, $ionicLoading, $scope, $state) {
  var profilCtrl = this;
  profilCtrl.edit = false;

    $http({
      method: 'GET',
      url: '/api-proxy/me',
    }).then(function(res) {
        profilCtrl.user = res.data;
    }).catch(function() {
      profilCtrl.error = 'Could not found profil';
    });

    profilCtrl.modify = function() {
    	profilCtrl.edit = true;
	}

	profilCtrl.save = function() {
	    $http({
	      method: 'PATCH',
	      url: '/api-proxy/users/'+ profilCtrl.user.id,
	      data: profilCtrl.user,
	    }).then(function(res) {
	    	profilCtrl.edit = false;
	    	$state.go('profil');
	        profilCtrl.user = res.data;
	    }).catch(function() {
	      profilCtrl.error = 'Could not edit profil';
	    });
	}
});
