// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.services'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller:'MainCtrl'
    })
    
    if('pad' == platform){
      $stateProvider
      .state('menu.list', {
        url: "/list",
        views: {
          'menuContent' :{
            templateUrl: "templates/menu_list.html",
            controller:'MenuCtrl'
          },
          'dataContent@menu.list':{
            templateUrl: "templates/none.html",
          }
        }
      })
      .state('menu.list.data_view', {
        url: "/data_view/:id",
        views: {
          'dataContent@menu.list' :{
            templateUrl: "templates/data_view.html",
            controller:'DataCtrl'
          }
        }
      })
    }else{
      $stateProvider
      .state('menu.list', {
        url: "/list",
        views: {
          'menuContent' :{
            templateUrl: "templates/menu_list.html",
            controller:'MenuCtrl'
          }
        }
      }) 
      .state('data_view', {
        url: "/data_view/:id",
        templateUrl: "templates/data_view.html",
        controller:'DataCtrl'
      })
    }
    $urlRouterProvider.otherwise('/menu/list');
});

