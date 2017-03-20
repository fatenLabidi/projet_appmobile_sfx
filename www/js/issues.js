//controller pour get la liste des issues entière ou perso
angular.module('citizen-engagement').controller('IssueListCtrl', function(AuthService, apiUrl, $http, $ionicHistory, $ionicLoading, $scope, $state) {
  var issueListCtrl = this;
  
  // function qui give l'entier de la liste
  issueListCtrl.showAll = function (){
    $http({
      method: 'GET',
      url: apiUrl+'/issues?include=creator',
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
      url: apiUrl+'/me/issues?include=creator',
    }).then(function(res) {
        issueListCtrl.issues = res.data;
    }).catch(function() {
      issueListCtrl.error = 'Could not found issue';
    });
  };


  issueListCtrl.showAll ();

});

//controller pour get une seul issue

angular.module('citizen-engagement').controller('IssueDetailsCtrl', function(AuthService, apiUrl, $http, $ionicHistory, $ionicLoading, $scope, $state, $stateParams) {
  var issueDetailsCtrl = this;
    $http({
      method: 'GET',
      url: apiUrl+'/issues/'+ $stateParams.issueId +"?include=creator",
    }).then(function(res) {
        issueDetailsCtrl.issue = res.data;
        console.log($stateParams.issueId);
    }).catch(function() {
      issueDetailsCtrl.error = 'Could not found issue';
    });

    $http({
      method: 'GET',
      url: apiUrl+'/issues/'+ $stateParams.issueId +'/comments',
      params: {pageSize: 2, include:'author'}
    }).then(function(res) {
      issueDetailsCtrl.comments = res.data;
    }).catch(function() {
      issueDetailsCtrl.error = 'Could not found issue';
    });
  
    issueDetailsCtrl.comment = {
    };
    issueDetailsCtrl.addComments = function(){
      console.log("ello")

      $http({
        method: 'POST',
        url: apiUrl+'/issues/'+ $stateParams.issueId +'/comments',
        data: issueDetailsCtrl.comment
      }).then(function(res) {  
         $state.go('issueDetails');
      }).catch(function() {
        issueDetailsCtrl.error = 'Could not add an comment.';
      });
    };

});


angular.module('citizen-engagement').controller('GelocCtrl', function(geolocation, $log) {
  var gelocCtrl = this;
  geolocation.getLocation().then(function(data){
    gelocCtrl.latitude = data.coords.latitude;
    console.log(gelocCtrl.latitude);
    gelocCtrl.longitude = data.coords.longitude;
  }).catch(function(err) {
    $log.error('Could not get location because: ' + err.message);
  });
});

angular.module('citizen-engagement').controller('MapCtrl', function(mapboxSecret, apiUrl, $scope, $http) {
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

    $http({
      method: 'GET',
      url: apiUrl+'/issues',
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

angular.module('citizen-engagement').controller('CreateIssueCtrl', function(AuthService, apiUrl, $http, $ionicHistory, $ionicLoading, $scope, $state, geolocation, CameraService, $ionicPopup, $log, $q, qimgSecret, qimgUrl) {
      var createIssueCtrl = this;

      createIssueCtrl.issue = {};

      $http({
      method: 'GET',
      url: apiUrl+'/issueTypes',

        }).then(function(res) {
            createIssueCtrl.types = res.data;
        }).catch(function() {
            createIssueCtrl.error = 'Could not found type of issue.';
        });
    
    createIssueCtrl.getLocation = function(){
      $log.debug('Getting location...');

      geolocation.getLocation().then(function(data){
        createIssueCtrl.issue.location = {
          "coordinates": [
            data.coords.latitude,
            data.coords.longitude
          ],
          "type": "Point"
        };
      }).catch(function(err) {
        $log.error('Could not get location because: ' + err.message);
      });
    }
/*
    createIssueCtrl.takePicture = function() {
      if (!CameraService.isSupported()) {
      return $ionicPopup.alert({
        title: 'Not supported',
        template: 'You cannot use the camera on this platform'
      });
    }
      CameraService.getPicture().then(function(result) {
        $log.debug('Picture taken!');
        createIssueCtrl.pictureData = result;
      }).catch(function(err) {
        $log.error('Could not get picture because: ' + err.message);
      });
    };*/

    createIssueCtrl.takePicture = function() {
        if (!CameraService.isSupported()) {
      return $ionicPopup.alert({
        title: 'Not supported',
        template: 'You cannot use the camera on this platform'
      });
    }
    CameraService.getPicture({ quality: 50 }).then(function(result) {
      $log.debug('Picture taken!');
      createIssueCtrl.pictureData = result;
    }).catch(function(err) {
      $log.error('Could not get picture because: ' + err.message);
    });
  };

    createIssueCtrl.createIssue = function() {
      return $q.when().then(postImage).then(createIssueCtrl.save);
    };

    function postImage() {
      if (!createIssueCtrl.pictureData) {
        // If no image was taken, return a promise resolved with "null"
        return $q.when(null);
      }

      // Upload the image to the qimg API
      return $http({
        method: 'POST',
        url: qimgUrl + '/images',
        headers: {
          Authorization: 'Bearer ' + qimgSecret
        },
        data: {
          data: createIssueCtrl.pictureData
        }
      });
    }
    createIssueCtrl.save = function(imageRes){
      // Use the image URL from the qimg API response (if any)
      if (imageRes) {
        createIssueCtrl.issue.imageUrl = imageRes.data.url;
      }

      $http({
        method: 'POST',
        url: apiUrl+'/issues',
        data: createIssueCtrl.issue
      }).then(function(res) {
        $state.go('tab.issueList');
      }).catch(function(err) {
        createIssueCtrl.error = "Could not create issue";
      });
    }
});



// ctrl pour les comments get les comment et create un comment
angular.module('citizen-engagement').controller('CommentCtrl', function(AuthService, apiUrl, $http, $ionicHistory, $ionicLoading, $scope, $state, $stateParams) {
  var commentCtrl = this;
    $http({
      method: 'GET',
      url: apiUrl+'/issues/'+ $stateParams.issueId +'/comments',
      params: {include:'author'}
    }).then(function(res) {
      commentCtrl.comments = res.data;
    }).catch(function() {
      commentCtrl.error = 'Could not found issue';
    });

    commentCtrl.comment = {
    };

    commentCtrl.addComments = function(){
      $http({
        method: 'POST',
        url: apiUrl+'/issues/'+ $stateParams.issueId +'/comments',
        data: commentCtrl.comment
      }).then(function(res) {
         $state.go('comments');
      }).catch(function() {
        commentCtrl.error = 'Could not add an comment.';
      });
    };

});


