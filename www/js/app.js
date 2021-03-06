// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.services','starter.filters'])
.run(function($ionicPlatform,setVariables,initData) {
  $ionicPlatform.ready(function() {
    //setVariables.setVariablesData();//给变量赋值 add by genglan
    //initData.loadAllCode();//初始化代码 add by genglan
    //initData.loadProductJson();//解析product add by genglan
    //initData.loadBanks();//初始化银行 add by genglan
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
    /************未提交保单  pad版 add by genglan ******/
    if(ionic.Platform.isIPad()){
        $stateProvider
        .state('menu.list', {//未提交保单 add by genglan
        url: "/list",
        views: {
          'menuContent' :{
            templateUrl: "templates/menu_list.html",
            controller:'MenuCtrl'
          },
          'dataContent@menu.list' :{
            templateUrl: "templates/none.html",
          }
        }
      }) 
      .state('menu.list.data_view', {//未提交保单详情 add by genglan
        url: "/data_view/:insuranceID/:proposalID/:applicantID/:recognizeeID",//保单ID 建议书ID 投保人ID 、被保人ID
        views: {
          'dataContent@menu.list' :{
            templateUrl: "templates/data_view.html",
            controller:'DataCtrl'
          }
        }
      })
      .state('insure_needknow',{//跳转去在线投保须知
        url: "/insure_needknow/:insuranceID",
        templateUrl: "templates/insure_needknow.html",
        controller:'NeedKnowCtrl'
      })
      /************已提交保单  pad版 ******/
      .state('menu.submit', {//已提交保单列表 add by genglan
        url: "/submit_list",
        views: {
          'menuContent' :{
            templateUrl: "templates/submit_list.html",
            controller:'InsuranceCtrl'
          },
          'submitContent@menu.submit' :{
            templateUrl: "templates/none.html",
          }
        }
      })
      .state('menu.submit.insurance_view', {//已提交保单详情 add by genglan
        url: "/insurance_view/:indexNo",
        views: {
          'submitContent@menu.submit' :{
            templateUrl: "templates/insurance_view.html",
            controller:'InsuranceDataCtrl'
          }
        }
      })
    }else{
      /************未提交保单  手机版 add by genglan ******/
      $stateProvider
      .state('menu.list', {//未提交保单列表 add by genglan
        url: "/list",
        views: {
          'menuContent' :{
            templateUrl: "templates/menu_list.html",
            controller:'MenuCtrl'
          }
        }
      }) 
      .state('data_view', {//未提交保单详情 add by genglan
        url: "/data_view/:insuranceID/:proposalID/:applicantID/:recognizeeID",
        templateUrl: "templates/data_view.html",
        controller:'DataCtrl'
      }) 
      .state('insure_needknow',{//跳转去在线投保须知
        url: "/insure_needknow/:insuranceID",
        templateUrl: "templates/insure_needknow.html",
        controller:'NeedKnowCtrl'
      })
      //已提交保单
      .state('menu.submit', {//已提交保单列表 add by genglan
        url: "/submit_list",
        views: {
          'menuContent' :{
            templateUrl: "templates/submit_list.html",
            controller:'InsuranceCtrl'
          }
        }
      }) 
      .state('insurance_view', {//已提交保单详情 add by genglan
        url: "/insurance_view/:indexNo",
        templateUrl: "templates/insurance_view.html",
        controller:'InsuranceDataCtrl'
      })
    }
    $urlRouterProvider.otherwise('/menu/list');//默认走的是已提交保单列表
});

