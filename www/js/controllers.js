angular.module('starter.controllers', [])
//首页面
.controller('MainCtrl', function($scope,$state) {
	//点击左边的边栏
	$scope.clickMain = function (url){
		$state.go('menu.list');
	}
})
//菜单
.controller('MenuCtrl', function($scope,$state,Items) {
    $scope.items = Items ; 
    //点击菜单
    $scope.clickMenu = function (item){

		if('pad' == platform){
			$state.go('menu.list.data_view',{'id':item.id});
		}else{
			$state.go('data_view',{'id':item.id});
		}	
    }
    //关闭
    $scope.closePage = function (){
    	if('pad' == platform){
    		$state.go('menu.list');
    	}
	
    }
})
//数据展示
.controller('DataCtrl', function($scope,$stateParams) {
	$scope.title =  $stateParams.id
})