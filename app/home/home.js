(function (angular) {
  "use strict";

  var app = angular.module('tactwork.home', ['firebase.auth', 'firebase', 'firebase.utils', 'ngRoute']);

  app.controller('HomeCtrl', ['$scope', 'fbutil', 'user', '$firebaseObject', 'FBURL', function ($scope, fbutil, user, $firebaseObject, FBURL) {
    $scope.syncedValue = $firebaseObject(fbutil.ref('syncedValue'));
    $scope.user = user;
    $scope.FBURL = FBURL;
  }]);
  app.controller('TimerCtrl', ['$scope', '$interval', function($scope, $interval) {
    var self = this, j= 0, counter = 0;
    self.mode = 'query';
    self.activated = true;
    self.determinateValue = 30;
    self.determinateValue2 = 30;
    self.modes = [ ];
    /**
     * Turn off or on the 5 themed loaders
     */
    self.toggleActivation = function() {
        if ( !self.activated ) self.modes = [ ];
        if (  self.activated ) {
          j = counter = 0;
          self.determinateValue = 30;
          self.determinateValue2 = 30;
        }
    };
    $interval(function() {
      self.determinateValue += 1;
      self.determinateValue2 += 1.5;
      if (self.determinateValue > 100) self.determinateValue = 30;
      if (self.determinateValue2 > 100) self.determinateValue2 = 30;
        // Incrementally start animation the five (5) Indeterminate,
        // themed progress circular bars
        if ( (j < 2) && !self.modes[j] && self.activated ) {
          self.modes[j] = (j==0) ? 'buffer' : 'query';
        }
        if ( counter++ % 4 == 0 ) j++;
        // Show the indicator in the "Used within Containers" after 200ms delay
        if ( j == 2 ) self.contained = "indeterminate";
    }, 100, 0, true);
    $interval(function() {
      self.mode = (self.mode == 'query' ? 'determinate' : 'query');
    }, 7200, 0, true);
  }]);
  app.controller('BottomCtrl', ['$scope', '$timeout', '$mdBottomSheet', '$mdToast', function($scope, $timeout, $mdBottomSheet, $mdToast) {
    $scope.alert = '';
    $scope.showListBottomSheet = function($event) {
      $scope.alert = '';
      $mdBottomSheet.show({
        templateUrl: '../src/view/contactSheet.html',
        controller: 'ListBottomSheetCtrl',
        targetEvent: $event
      }).then(function(clickedItem) {
        $scope.alert = clickedItem['name'] + ' clicked!';
      });
    };
  }]);
  app.controller('ListBottomSheetCtrl', ['$scope', '$mdBottomSheet', function($scope, $mdBottomSheet) {
    $scope.items = [
      { name: 'Share', icon: 'ic_share_arrow_24px' },
      { name: 'Upload', icon: 'upload' },
      { name: 'Copy', icon: 'copy' },
      { name: 'Print this page', icon: 'print' },
    ];
    $scope.listItemClick = function($index) {
      var clickedItem = $scope.items[$index];
      $mdBottomSheet.hide(clickedItem);
    };
  }]);
  //START MD SCROLLSHRINK DEMO S

  app.controller('TitleController', function($scope) {
    $scope.title = 'Welcome to tactwork';

  });


  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
      templateUrl: 'home/home.html',
      controller: 'HomeCtrl',
      resolve: {
        // forces the page to wait for this promise to resolve before controller is loaded
        // the controller can then inject `user` as a dependency. This could also be done
        // in the controller, but this makes things cleaner (controller doesn't need to worry
        // about auth status or timing of accessing data or displaying elements)


        user: ['Auth', function (Auth) {
          return Auth.$waitForAuth();
        }]
      }
    });
  }]);

})(angular);

