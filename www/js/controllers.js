
angular.module('starter.controllers', [])
/**
*主页面
* add by genglan
* 2015-1-24
*/ 
.controller('MainCtrl', function($scope,$state,$rootScope) {
    $scope.isSubmit  = false; // 默认未提交
    //菜单切换
    $scope.clickMenu = function (checked){
        if(checked){
            $scope.isSubmit  = true;
            $state.go('menu.submit'); 
        }else{
            $scope.isSubmit  = false;
            $state.go('menu.list'); 
        }
    }
    //退出应用
    $scope.gohomeFun = function (){
        closeWebView("",function (){
            console.log('应用退出成功！');
        },function (){
            console.log('应用退出失败！');
        });
    }
})
/******************************************未提交保单  add by genglan 2015-1-24*********************************************/
.controller('MenuCtrl', function($scope,$rootScope,$state,$ionicPopup,unFinshedInsurance,CommonFn,Variables) {
    CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
    //查询未提交保单列表
    $scope.loadunFinshedList = function (searchVal){
        unFinshedInsurance.loadUnFinshedInsurance({
            searchVal:searchVal,
            callBackFun :function (data){
                $scope.$apply(function (){
                    if(null != Variables.alertPopup){
                        Variables.alertPopup.close();
                    }
                    $scope.unFinshedList = data;
                })
            }
        });  
    }
    document.addEventListener('deviceready', function(){
        $scope.loadunFinshedList(''); 
    }, false);
    $rootScope.selectedRow = '-1';
    //点击列表
    $scope.clickMenu = function (item){
        $rootScope.selectedRow = item.ID;
    	if(ionic.Platform.isIPad()){
			$state.go('menu.list.data_view',{'insuranceID':item.ID,'proposalID':item.PROPOSAL_ID,'applicantID':item.APPLICANT_ID,'recognizeeID':item.INSURANT_ID});
    	}else{
			$state.go('data_view',{'insuranceID':item.ID,'proposalID':item.PROPOSAL_ID,'applicantID':item.APPLICANT_ID,'recognizeeID':item.INSURANT_ID});
    	}	
    } 
    //未提交保单搜索
    $scope.autocompleteFn = function (){
        var autocompleteValue = document.getElementById("autocomplete").value;
        $scope.loadunFinshedList(autocompleteValue); 
    } 
    //添加保单 先跳转到建议书，选择建议书，选择完后跳转到 制作建议书的第一步
    $scope.addInsurance = function (){
        var url = "promodel/"+Variables.recommendAppId+"/www/index.html#/menu/list/Y?agentCode="+Variables.currentCode;
        var jsonKey ={
            "serviceType":"LOCAL",
            "URL": url
        };
        pushToViewController(jsonKey, function (){
            console.log("选择建议书！");
        },function (){
            console.log("选择建议书")
        }); 
    } 
})
/**
*数据展示
* add by genglan
* 2015-1-24
*/
.controller('DataCtrl', function($scope,$state,$stateParams,$rootScope,$ionicActionSheet,$ionicPopup,$ionicModal,unFinshedInsurance,Variables,CommonFn) {
    var insuranceID = $stateParams.insuranceID //选择的保单ID
    var proposalID = $stateParams.proposalID //建议书ID
    var applicantID = $stateParams.applicantID //投保人
    var recognizeeID = $stateParams.recognizeeID //建议书ID
    //点击关闭按钮
    $scope.closeData = function (){
        $rootScope.selectedRow = '-1';
        $state.go('menu.list');
    }
    //查询投保人信息
    unFinshedInsurance.loadCustomer({
        applyID:insuranceID,
        applicantID:applicantID,
        callBackFun:function (data){
            $scope.applicant = data[0];
        }
    });
    //查询被保人信息
    unFinshedInsurance.loadCustomer({
        applyID:insuranceID,
        recognizeeID:recognizeeID,
        callBackFun:function (data){
            $scope.recognizee = data[0];
        }
    });
    //查询当前保单险种信息
    unFinshedInsurance.loadProductByID({
        proposalID:proposalID,
        callBackFun:function (data){
            $scope.productList = data;   
        }
    });   
    //删除未提交的保单
	$scope.deleteData = function (){
        var jsonDataArr = [
            {
                "databaseName": Variables.dataBaseName,
                "tableName": "T_PROPOSAL_PRODUCT",
                "conditions": [{
                    "PROPOSAL_ID": proposalID
                }]
            },
            {
                "databaseName": Variables.dataBaseName,
                "tableName": "T_PROPOSAL",
                "conditions": [{
                    "ID": proposalID
                }]
            },
            {
                "databaseName": Variables.dataBaseName,
                "tableName": "T_CUSTOMER",
                "conditions": [{
                    "APPLY_ID": insuranceID
                }]
            },
            {
                "databaseName": Variables.dataBaseName,
                "tableName": "T_APPLY",
                "conditions": [{
                    "ID": insuranceID
                }]
            }
        ]
        var hideSheet = $ionicActionSheet.show({
            titleText:'是否删除保单',
            destructiveText: '确定',
            cancelText: '取消',
            cancel: function() {},
            destructiveButtonClicked: function(){
               hideSheet();
               unFinshedInsurance.deleteInsurance({
                    jsonDataArr:jsonDataArr,
                    callBackFun:function (data){
                        if(1 == data){
                            CommonFn.deleteArray({
                                array:$scope.unFinshedList,
                                deleteID:insuranceID,
                                callBackFun:function (data){
                                    CommonFn.alertPopupFun($ionicPopup,'charging','删除成功！...',3000);
                                    $state.go('menu.list');   
                                }
                            }) 
                        }else{
                           CommonFn.alertPopupFun($ionicPopup,'loser','删除失败！...',3000); 
                        }
                    }
               })
            }
        });
    } 
    $ionicModal.fromTemplateUrl('templates/insurance_type_info.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    //查看险种详细信息
    $scope.showInsuranceInfo = function (i){
        $scope.productInfo = $scope.productList[i];
        $scope.modal.show(); 
    }
    $scope.closeModal = function (){
        $scope.modal.hide();
    }
    //编辑未提交的保单、提交保单
    $scope.editData = function (){
        $state.go('insure_needknow',{'insuranceID':insuranceID});
    } 
})
/******************************************已提交保单 add by genglan 2015-1-24*********************************************/
.controller('InsuranceCtrl', function($scope,$rootScope,$state,$stateParams,$ionicPopup,Variables,CommonFn,submitInsurance) {
    //CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
    $scope.tabs = brows().iphone ? 64:44;
    $scope.currentTab = 'templates/insurance_list.html';
    $scope.isAlready = false;
    //查询保单列表
    $scope.loadInsuranceList = function (state,searchVal){
        submitInsurance.loadFinishedInsurance({
            state:state,
            searchVal:searchVal,
            callBackFun:function (data){ 
                $scope.$apply(function (){
                    if(null != Variables.alertPopup){
                        Variables.alertPopup.close();
                    }
                   $scope.insuranceList = data;
                })
            }
        });
    }
    $scope.loadInsuranceList(0,'');//查询列表 默认查询未承保的
    //tab切换
    $scope.onClickTab = function (state){
        document.getElementById('autocomplete').value = '';
        $rootScope.selectedRow = '-1';
        $scope.isAlready = state == '1'?true:false ;
    }
    //搜索
    $scope.autocompleteFn = function (){
        var autocompleteValue = document.getElementById("autocomplete").value;
        $scope.loadInsuranceList($scope.isAlready,autocompleteValue);
    }
    $rootScope.selectedRow = '-1';
    $scope.clickInsurance = function (index){
        $rootScope.selectedRow = index;
        if(ionic.Platform.isIPad()){
            $state.go('menu.submit.insurance_view',{'indexNo':index});
        }else{//手机版的此后页面全部横屏
            setScreenLandscape('',function (){
                console.log("横屏成功！");
            },function (){
                console.log("横屏失败！")
            })
            $state.go('insurance_view',{'indexNo':index});
        } 
    }
})
/**
*已提交保单数据展示
* add by genglan
* 2015-1-24
*/
.controller('InsuranceDataCtrl', function($scope,$rootScope,$state,$stateParams,$ionicModal,$ionicPopup,Variables,CommonFn,submitInsurance) {
    CommonFn.alertPopupFun($ionicPopup,'loading','加载中！...',0);
    var indexNo = $stateParams.indexNo;
    $scope.baseInfo = $scope.insuranceList[indexNo];//保单基本信息
    var printNo = $scope.baseInfo.printNo; 
    submitInsurance.loadInsuranceByID({
        printNo:printNo,
        callBackFun:function (data){
            $scope.$apply(function (){
                $scope.applicant = data.applicant;//投保人
                $scope.insurant = data.insuredList[0].insurant;//被保人
                $scope.beneficiaryList = data.insuredList[0].beneficiaryList;//受益人
                $scope.insuranceList = data.insuredList[0].insuranceList//投保事项
                if(null != Variables.alertPopup){
                    Variables.alertPopup.close();
                }
            });
        }
    });
    //点击关闭按钮
    $scope.closeData = function (){
        $rootScope.selectedRow = '-1';
        if(!ionic.Platform.isIPad()){//手机版关闭后恢复竖屏
            setScreenPortrait('',function (){
                console.log("竖屏成功！");
            },function (){
                console.log("竖屏失败！")
            })
        }
        $state.go('menu.submit');
    } 
    //收费
    $ionicModal.fromTemplateUrl('templates/charge_modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.chargeModal = modal;
    });
    //关闭收费
    $scope.closeChargeModal = function (){
        $scope.chargeModal.hide();
    }
    //收费
    $scope.chargeFun = function (item){
        submitInsurance.chargeFun({
            printNo:item.printNo,
            bankCode:item.bankCode,
            bankAccNo:item.bankAccNo,
            callBackFun:function (data){
                if(0 == data.code){
                    CommonFn.alertPopupFun($ionicPopup,'charging','收费成功！',3000); 
                }else{
                    CommonFn.alertPopupFun($ionicPopup,'loser',data.msg,3000);  
                }
            }
        });         
    }
})