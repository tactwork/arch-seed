(function (angular) {
  'use strict';

  // Declare app level module which depends on filters, and services
  angular.module('tactwork', [
    'tactwork.config',
    'tactwork.security',
    'tactwork.home',
    'tactwork.chat',
    'tactwork.account',
    'tactwork.login'
  ])


  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/home'
    });
  }])

  .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $mdBottomSheet, $log) {
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen(false);
    };
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }
  })

  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };
  })
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  })
  .directive('backImg', function(){
    return function(scope, element, attrs){
      var url = attrs.backImg;
      element.css({
          'background-image': 'url(' + url +')',
          'background-size' : 'cover',
          'background-repeat': 'no-repeat',
          'background-position': 'center center'
      });
    };
  })

  .run(['$rootScope', 'Auth', function($rootScope, Auth) {
    // track status of authentication
    Auth.$onAuth(function(user) {
      $rootScope.loggedIn = !!user;
    });
  }]);



})(angular);

(function (angular) {
  'use strict';

  angular.module('tactwork.config', [ 'ngMaterial' ])
    .config(['$mdIconProvider', function ($mdIconProvider) {
      // Configure URLs for icons specified by [set:]id.
      $mdIconProvider
        .defaultIconSet("./images/svg/avatars.svg", 128)
        .icon('logo', './images/PRODUCTION.svg', 500)
        .iconSet("navigation" , "./images/icons/svg-sprite-navigation.svg", 24)
        .iconSet('action',  './images/icons/svg-sprite-action.svg',24)
        .iconSet('av',  './images/icons/svg-sprite-av.svg',24)
        .iconSet('content', './images/icons/svg-sprite-content.svg',24)
        .iconSet('file',  './images/icons/svg-sprite-file.svg',24)
        .iconSet('device',  './images/icons/svg-sprite-device.svg',24)
        .iconSet('social',  './images/icons/svg-sprite-social.svg',24)
        .iconSet('editor',  './images/icons/svg-sprite-editor.svg',24)
        .iconSet('image', './images/icons/svg-sprite-image.svg',24)
    }])


    .config(['$mdThemingProvider', function ($mdThemingProvider) {
      $mdThemingProvider
        .definePalette('tactwork', {
            '50': '#f9f9f9',
            '100': '#f5f5f5',
            '200': '#e0e0e0',
            '300': '#EDE7F6',
            '400': '#212121',
            '500': '#3f51b5', //teal 500
            '600': '#AB1852', //darker shade of deep-purple 500 & md-hue-2
            '700': '#2A184B',
            '800': '#1C1032',
            '900': '#AB1852',
            'A100': '#E0E0E0', //background color theme.
            'A200': '#24ECC1', //5E35B0
            'A400': '#AB1852',
            'A700': '#FCE04F',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
             '200', '400', 'A100', 'A700'],
            'contrastLightColors': 'dark'    // cou ld also specify this if default was 'dark'
          });


        $mdThemingProvider.theme('default').primaryPalette('tactwork');
    }])
    // where to redirect users if they need to authenticate (see security.js)
    .constant('loginRedirectPath', '/login')

    // your Firebase data URL goes here, no trailing slash
    .constant('FBURL', 'https://tacts.firebaseio.com')

    .run(function($http, $templateCache){
      // Pre-fetch icons sources by URL and cache in the $templateCache...
      // subsequent $http calls will look there first.
      var urls = [ 'images/icons/svg-sprite-navigation.svg', './images/PRODUCTION.svg', 'images/icons/svg-sprite-action.svg', 'images/icons/svg-sprite-action.svg', 'images/icons/svg-sprite-av.svg', 'images/icons/svg-sprite-content.svg', 'images/icons/svg-sprite-file.svg', 'images/icons/svg-sprite-device.svg', 'images/icons/svg-sprite-social.svg', 'images/icons/svg-sprite-editor.svg', 'images/icons/svg-sprite-image.svg', 'images/svg/avatars.svg'];
      angular.forEach(urls, function(url) {
        $http.get(url, {cache: $templateCache});
      });
    })

})(angular);