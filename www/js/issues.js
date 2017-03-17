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


angular.module('citizen-engagement').controller('NewIssueCtrl', function(geolocation, $log) {
  var NewIssueCtrl = this;
  geolocation.getLocation().then(function(data){
    NewIssueCtrl.latitude = data.coords.latitude;
    NewIssueCtrl.longitude = data.coords.longitude;
  }).catch(function(err) {
    $log.error('Could not get location because: ' + err.message);
  });
});

angular.module('citizen-engagement').controller('MapCtrl', function(mapboxSecret, $scope, $http) {
  var mapCtrl = this; 
  var mapboxMapId = 'mapbox.satellite';  // Use your favorite tileset here mapbox://styles/xavijunior/civccxu4c00aq2jpyjjgqoeyp
  // Build the tile layer URL
  var mapboxTileLayerUrl = 'http://api.tiles.mapbox.com/v4/' + mapboxMapId;
  mapboxTileLayerUrl = mapboxTileLayerUrl + '/{z}/{x}/{y}.png';
  mapboxTileLayerUrl = mapboxTileLayerUrl + '?access_token=' + mapboxSecret;
  mapCtrl.defaults = {
    tileLayer: mapboxTileLayerUrl
  };
  mapCtrl.markers = [];
  mapCtrl.center = {
    lat: 46.781498,
    lng: 6.647568,
    zoom: 33
  };

  var record = {
    title: 'cool',
    description: 'raul'
  };

var msg = '<p>Hello mon gars</p>';
msg += '<p>{{ record.title }} <b> {{ record.description }} </b></p>';

  mapCtrl.markers.push({
    lat: 46.78149,
    lng: 6.647568,
    message: msg,
      getMessageScope: function() {
        var scope = $scope.$new();
        scope.record = record;
        return scope;
      }
  });



    $http({
      method: 'GET',
      url: '/api-proxy/issues',
    }).then(function(res) {
        for(var i=0;i<res.data.length;i++){
          var issue = res.data[i];
           mapCtrl.markers.push({
              lat: issue.location.coordinates[1],
              lng: issue.location.coordinates[0],
              message: issue.description
            });
        }
    }).catch(function() {
      issueDetailsCtrl.error = 'Could not found issue';
    });

});


//controller pour créer un issue
angular.module('citizen-engagement').controller('CreatIssueCtrl', function(AuthService, $http, $ionicHistory, $ionicLoading, $scope, $state) {
    
    creatIssueCtrl.save = function(){
        $http({
          method: 'POST',
          url: '/api-proxy/issues',
          data: creatIssueCtrl.issue
        }).then(function(res) {
          $state.go('/issueList');
        }).catch(function() {
          registerCtrl.error = 'Could not create an issue.';
        });
    }
    
});


//controller pour getter  la listes des types
angular.module('citizen-engagement').controller('GetIssueTypesCtrl', function(AuthService, $http, $ionicHistory, $ionicLoading, $scope, $state) {
    $http({
      method: 'GET',
      url: '/api-proxy/issueTypes',
    }).then(function(res) {
         getIssueTypesCtrl.types = res.data;
    }).catch(function() {
            registerCtrl.error = 'Could not found type of issue.';
    });
});