// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('citizen-engagement', ['ionic', 'angular-storage','geolocation','leaflet-directive'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

angular.module('citizen-engagement').config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
      url: '/login',
      controller: 'LoginCtrl',
      controllerAs: 'loginCtrl',
      templateUrl: 'templates/login.html'
    })

    .state('issueDetails', {
      url: '/issueDetails/:issueId',
      controller: 'IssueDetailsCtrl',
      controllerAs: 'issueDetailsCtrl',
      templateUrl: 'templates/issueDetails.html'
    })

    .state('register', {
      url: '/register',
      controller: 'RegisterCtrl',
      controllerAs: 'registerCtrl',
      templateUrl: 'templates/register.html'
    })

    .state('createIssue', {
      // The URL (here "/newIssue") is used only internally with Ionic; you never see it displayed anywhere.
      // In an Angular website, it would be the URL you need to go to with your browser to enter this state.
      url: '/createIssue',
      controller: 'CreateIssueCtrl',
      controllerAs: 'createIssueCtrl',
      templateUrl: 'templates/createIssue.html'
    })

    .state('profil', {
      // The URL (here "/newIssue") is used only internally with Ionic; you never see it displayed anywhere.
      // In an Angular website, it would be the URL you need to go to with your browser to enter this state.
      url: '/profil',
      controller: 'profilCtrl',
      controllerAs: 'profilCtrl',
      templateUrl: 'templates/profil.html'
    })

    // This is the abstract state for the tabs directive.
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    // The three next states are for each of the three tabs.
    // The state names start with "tab.", indicating that they are children of the "tab" state.
    .state('tab.issueMap', {
      url: '/issueMap',
      views: {
        'tab-issueMap': {
          controller: 'MapCtrl',
          controllerAs : 'mapCtrl',
          templateUrl: 'templates/issueMap.html'
        }
      }
    })

    .state('tab.issueList', {
      url: '/issueList',
      views: {
        'tab-issueList': {
          controller: "IssueListCtrl",
          controllerAs: "issueListCtrl",
          templateUrl: 'templates/issueList.html'
        }
      }
    })

    // This is the issue details state.
    /*.state('tab.issueDetails', {
      // We use a parameterized route for this state.
      // That way we'll know which issue to display the details of.
      url: '/issueDetails/:issueId',
      views: {
        // Here we use the same "tab-issueList" view as the previous state.
        // This means that the issue details template will be displayed in the same tab as the issue list.
        'tab-issueList': {
          templateUrl: 'templates/issueDetails.html'
        }
      }
    })
  ;*/

  // Define the default state (i.e. the first screen displayed when the app opens).
  $urlRouterProvider.otherwise(function($injector) {
    $injector.get('$state').go('login'); // Go to the new issue tab by default.
  });
});

angular.module('citizen-engagement').run(function(AuthService, $rootScope, $state) {

  // Listen for the $stateChangeStart event of AngularUI Router.
  // This event indicates that we are transitioning to a new state.
  // We have the possibility to cancel the transition in the callback function.
  $rootScope.$on('$stateChangeStart', function(event, toState) {

    // If the user is not logged in and is trying to access another state than "login"...
    if (!AuthService.authToken && toState.name != 'login') {

      // ... then cancel the transition and go to the "login" state instead.
      event.preventDefault();
      $state.go('login');
    }
  });
});