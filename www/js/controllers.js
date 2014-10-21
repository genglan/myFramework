angular.module('starter.controllers', [])
//首页面
.controller('MainCtrl', function($scope,$state) {
	//点击左边的边栏
	$scope.clickMain = function (url){
		$state.go('menu.list.data_view',{'id':''});
	}
})
//菜单
.controller('MenuCtrl', function($scope,$state,Items) {
    $scope.items = Items ; 
    if('pad' == platform){
    	$state.go('menu.list.data_view',{'id':''});
    }
    //点击菜单
    $scope.clickMenu = function (item){

    	if('pad' == platform){
    		$scope.cancle_but = false;
			$state.go('menu.list.data_view',{'id':item.id});
    	}else{
    		$scope.cancle_but = false;
			$state.go('data_view',{'id':item.id});
    	}	
    }
})
//数据展示
.controller('DataCtrl', function($scope,$state,$stateParams) {

	if($stateParams.id){
		$scope.title = $stateParams.id;
		$scope.cancle_but = true;
	}else{
	  	$scope.cancle_but = false;
	} 
})