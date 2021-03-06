angular.module('starter.services', [])
/**
*公共变量 
* add by genglan
* 2015-1-24
*/ 
.factory("Variables",function (){
    return {
        appId: '10005',//当前应用ID
        recommendAppId:'10003',//建议书id
        customerAppId:'10002',//建议书id
        dataBaseName: "insurance_online.sqlite",//当前应用数据库
        codeBaseName:"t_code.sqlite",//码表对应数据库
        bankBaseName:"t_bank.sqlite",//银行信息对应数据库
        recommendBaseName:"promodel/10003/www/db/esales.sqlite",//建议书数据库
        currentCode: '',//当前登录人ID
        alertPopup :null,//提示框
        serverUrl :"http://10.0.22.112:7003/app/apply",//服务器url
        //serverUrl :"http://10.0.17.122:8080/esales_center/app/apply",//王思维的url
        codeJson:null,//代码集合
        productJson:null,//险种集合
        bankJson :null//银行信息集合
    }
})
/**
*变量赋值 
* add by genglan
* 2015-1-24
*/ 
.factory('setVariables',function (Variables,CommonFn) {
    var setVariablesDataFn = function(){
        Variables.dataBaseName = "promodel/"+Variables.appId+"/www/db/insurance_online.sqlite";
        Variables.codeBaseName = "promodel/"+Variables.appId+"/www/db/t_code.sqlite";
        Variables.bankBaseName = "promodel/"+Variables.appId+"/www/db/t_bank.sqlite";
        Variables.currentCode = CommonFn.getQueryStringByName("agentCode"); 
    }
    return {
        setVariablesData: function () {
            setVariablesDataFn();
        }
    }
})
/**
*初始化数据用 
* add by genglan
* 2015-1-24
*/
.factory('initData',function (Variables,CommonFn){
    //根据类型查询有所代码
    var loadAllCode = function (){
        var sql = "select * from T_CODE ";
        var json = {
            "databaseName":Variables.codeBaseName,
            "sql": sql
        }; 
        queryTableDataUseSql(json,function(data){
            Variables.codeJson = data;
        },function (){
            console.log('查询code出错！');
        });
    }
    //初始化产品集合
    var loadProductJson = function (){
        var array = [];
        CommonFn.analysisXml({
            xmlString:'xml/product.xml',
            callBackFun:function (dom){
                var elements = dom.getElementsByTagName("insur");
                for (var i = 0; i < elements.length; i++) {
                    var json = {};
                    if(elements[i].attributes.length>1){
                      json["id"] = elements[i].getAttribute("id");
                      json["name"] = elements[i].getAttribute("name");
                      json["kind"] = elements[i].getAttribute("kind");
                      json["hasProductSpec"] = elements[i].getAttribute("hasProductSpec");
                      json["beginDate"] = elements[i].getAttribute("beginDate");
                      array.push(json)
                    }
                }
                Variables.productJson = array; 
            }
        });
    }
    //查询银行信息
    var loadBanks = function (){
        var sql = "select * from T_BANK ";
        var json = {
            "databaseName":Variables.bankBaseName,
            "sql": sql
        }; 
        queryTableDataUseSql(json,function(data){
            Variables.bankJson = data;
        },function (){
            console.log('查询code出错！');
        });
    }
    return {
        loadAllCode:loadAllCode,
        loadProductJson:loadProductJson,
        loadBanks:loadBanks
    }  
})
/**
*公共方法 
* add by genglan
* 2015-1-24
*/
.factory("CommonFn",function (Variables){
    //根据QueryString参数名称获取值
    var getQueryStringByName = function(name){
        var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
        if(result == null || result.length < 1){
            return "";
        }
        return result[1];
    }
    //提示框
    var alertPopupFun = function ($ionicPopup,icon,word,time){
        if(null != Variables.alertPopup){
            Variables.alertPopup.close(); 
        }
        Variables.alertPopup = $ionicPopup.alert({
            template: '<div class="pop_up_box"><span class="'+icon+'"></span>'+word+'</div>'
        });
        if(0 != time){ //time == 0 标识的是正在加载中......  加载完毕后会自动关闭
            setTimeout(function (){
                if(null != Variables.alertPopup){
                    Variables.alertPopup.close(); 
                } 
            },time);
        }   
    }  
    //根据路径解析xml
    var analysisXml = function(opts){ 
        var xmlDoc; 
        if (window.ActiveXObject) {
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');//IE浏览器
            xmlDoc.async = false;
            xmlDoc.load(opts.xmlString);
        }
        else if (isFirefox=navigator.userAgent.indexOf("Firefox")>0) { //火狐浏览器 
            xmlDoc = document.implementation.createDocument('', '', null);
            xmlDoc.load(opts.xmlString);
        }else{ //谷歌浏览器
            var xmlhttp = new window.XMLHttpRequest();  
            xmlhttp.open("GET",opts.xmlString,false);  
            xmlhttp.send(null);  
            xmlDoc = xmlhttp.responseXML;  
        } 
        opts.callBackFun && opts.callBackFun(xmlDoc);  
    }
    //根据代码取name
    var loadCodeNameByCode = function (data,type,code){
        for(var i=0 ;i<data.length;i++){
            if(data[i].CODE_TYPE == type && data[i].CODE == code){
                return data[i].CODE_NAME;
            }
        }
        return '';
    }
    //根据险种ID获取险种name
    var loadProductNameByCode = function (data,code){
        for (var i = 0; i < data.length; i++) {
            if(data[i].id == code){
                return data[i].name;
            }   
        }
        return '';
    }
    //删除数组某一元素
    var deleteArray = function(opts){
        for(var i=0 ;i<opts.array.length ;i++){
            if(opts.deleteID == opts.array[i].ID){
               opts.array.splice(i, 1);
               opts.callBackFun && opts.callBackFun(opts.array);  
            }
        }
    }
    //根据银行编码找银行名称
    var loadBankNameByCode = function (data,code){
        for (var i = 0; i < data.length; i++) {
            if(data[i].BANK_CODE == code){
                return data[i].BANK_NAME;
            }   
        }
        return '';  
    }
    return {
        getQueryStringByName: getQueryStringByName,//获取参数
        alertPopupFun: alertPopupFun,//alert提示框
        loadCodeNameByCode:loadCodeNameByCode,//根据code查name
        loadProductNameByCode:loadProductNameByCode,//根据产品ID查产品name
        loadBankNameByCode:loadBankNameByCode,
        analysisXml:function(opts){
            return analysisXml(opts);
        },
        deleteArray:function (opts){
            return deleteArray(opts);
        }
    }    
})
/**
*未提交保单相关 
* add by genglan
* 2015-1-24
*/
.factory("unFinshedInsurance",function (Variables,CommonFn){
    //未提交列表
    var loadUnFinshedInsurance = function (opts){
        var sql = "select ID,PRINT_NO,APPLICANT_NAME,INSURANT_NAME,SUM_AMOUNT,PROPOSAL_ID,APPLICANT_ID,INSURANT_ID from T_APPLY WHERE SUBMIT_TIME IS NULL ";
        if('' != opts.searchVal){
            sql += " and (PRINT_NO like '%"+opts.searchVal+"%' or APPLICANT_NAME like '%"+opts.searchVal+"%' or INSURANT_NAME like '%"+opts.searchVal+"%' )";
        }
        var json = {
            "databaseName":Variables.dataBaseName,
            "sql": sql +"ORDER BY UPDATE_TIME DESC"
        }; 
        queryTableDataUseSql(json,function(data){
            opts.callBackFun && opts.callBackFun(data);
        },function (){
            console.log('查询出错！');
        });
    }
    //根据保单ID查询投保人、被保人、收益人等信息
    var loadCustomer = function (opts){
        var sql = "select * from T_CUSTOMER WHERE  APPLY_ID = '"+opts.applyID+"'";
        if("" != opts.applicantID && !!opts.applicantID){//查询的是投保人
            sql += " and CUSTOMER_ID = '"+opts.applicantID+"'";
        }else if ("" != opts.recognizeeID && !!opts.recognizeeID){//查询的是被保人
            sql += " and CUSTOMER_ID = '"+opts.recognizeeID+"'";
        }else{//当投保人和被保人传值未空得时候 ，查询的是受益人
            sql += " and IS_BENEFIT = 1";
        }
        var json = {
            "databaseName":Variables.dataBaseName,
            "sql": sql +"ORDER BY UPDATE_TIME DESC"
        }; 
        queryTableDataUseSql(json,function(data){
            opts.callBackFun && opts.callBackFun(data);
        },function (){
            console.log('查询出错！');
        });
    }
    //根据保单ID查询险种设计信息
    var loadProductByID = function (opts){
        var sql = "select * from T_PROPOSAL_PRODUCT WHERE  PROPOSAL_ID = '"+opts.proposalID+"'";;
        var json = {
            "databaseName":Variables.dataBaseName,
            "sql": sql +"ORDER BY UPDATE_TIME DESC"
        }; 
        queryTableDataUseSql(json,function(data){
            opts.callBackFun && opts.callBackFun(data);
        },function (){
            console.log('查询出错！');
        });
    }
    //删除
    var iterIndex = 0;
    var deleteData = function (array,opts){
        deleteTableData(array[iterIndex],function(arr){
            iterIndex ++;
            if(iterIndex > array.length - 1){
                opts.callBackFun && opts.callBackFun(arr[0]);    
            }else{
                deleteData(array,opts);
            }
            
        },function(){
            console.log('删除出错！');
        });
    }
    //根据保单ID删除当前保单相关信息
    var  deleteInsurance = function(opts){
        if(opts.jsonDataArr.length >0){
            deleteData(opts.jsonDataArr,opts)
        }
    }
    return {
        loadUnFinshedInsurance: function (opts) {//根据保单ID查询投保人信息
            return loadUnFinshedInsurance(opts);
        },
        loadCustomer: function (opts) {//根据保单ID查询投保人、被保人、收益人等信息
            return loadCustomer(opts);
        },
        loadProductByID: function (opts) {//根据保单ID查询险种设计信息
            return loadProductByID(opts);
        },
        deleteInsurance: function (opts) {//根据保单ID删除当前保单相关信息
            return deleteInsurance(opts);
        }

    }
})
/**
*已提交保单 
* add by genglan
* 2015-1-24
*/
.factory("submitInsurance",function (Variables){
    //查询已经提交的保单列表
    var loadFinishedInsurance = function (opts){
        var json = {
            "url": Variables.serverUrl + "/queryApplyList", 
            "parameters": {"printNo": opts.searchVal,"state":opts.state}
        };
        httpRequestByGet(json,
            function (obj){
                var returnJson=eval("("+obj+")");
                if('0' == returnJson.status.code){
                    var mydata = returnJson.jsonMap.list;
                    opts.callBackFun && opts.callBackFun(mydata);  
                }else{
                    CommonFn.alertPopupFun($ionicPopup,'loser',returnJson.status.msg,3000);
                }  
            },function (){
                CommonFn.alertPopupFun($ionicPopup,'loser','查询出错！',3000);
            }
        );
    }
    //查询单个保单
    var loadInsuranceByID = function (opts){
        var json = {
            "url": Variables.serverUrl + "/queryApplyDetail/"+opts.printNo
        };
        httpRequestByGet(json,
            function (obj){
                var returnJson=eval("("+obj+")");
                if(0 == returnJson.status.code){
                    var mydata = returnJson.jsonMap.detail;
                    opts.callBackFun && opts.callBackFun(mydata);  
                }else{
                   CommonFn.alertPopupFun($ionicPopup,'loser',returnJson.status.msg,3000);
                }  
            },function (){
                CommonFn.alertPopupFun($ionicPopup,'loser','查询出错！',3000);
            }
        );
    }
    //查询保单状态
    var loadInsuranceState = function (opts){
        var json = {
            "url": Variables.serverUrl + "/getApplyState", 
            "parameters": {"printNo": opts.printNo}
        };
        httpRequestByGet(json,
            function (obj){
                var returnJson=eval("("+obj+")");
                if(0 == returnJson.status.code){
                    var mydata = returnJson.jsonMap;
                    opts.callBackFun && opts.callBackFun(mydata);  
                }else{
                    CommonFn.alertPopupFun($ionicPopup,'loser',returnJson.status.msg,3000);
                }  
            },function (){
                CommonFn.alertPopupFun($ionicPopup,'loser','查询出错！',3000);
            }
        );  
    }
    //保存其他收费方式
    var saveOtherChargeWay = function (opts){
        var json = {
            "url": Variables.serverUrl + "/updateBankInfo", 
            "parameters": {'printNo': opts.printNo,"bankCode":opts.bankCode,'bankAccNo':opts.bankAccNo}
        };
        httpRequestByPost(json,
            function (obj){
                var returnJson=eval("("+obj+")");
                opts.callBackFun && opts.callBackFun(returnJson.status);  
            },function (){
                CommonFn.alertPopupFun($ionicPopup,'loser','其他收费方式保存出错！',3000);
            }
        );  
    }
    //收费
    var chargeFun = function(opts){
        var json = {
            "url": Variables.serverUrl + "/payMent", 
            "parameters": {'printNo': opts.printNo,"bankCode":opts.bankCode,'bankAccNo':opts.bankAccNo}
        };
        httpRequestByPost(json,
            function (obj){
                var returnJson=eval("("+obj+")");
                opts.callBackFun && opts.callBackFun(returnJson.status);  
            },function (){
                CommonFn.alertPopupFun($ionicPopup,'loser','收费出错！',3000);
            }
        );
    }
    //修改建议书状态
    var updateRecommendState = function (opts){
        var updateJson ={
            "databaseName":databaseName,
            "tableName": "T_PROPOSAL",
            "conditions": [{"ID": opts.recommendID}],
            "data": [{'ISCOMPLETE':'Y'}]
        };  
        updateTableData (updateJson,function(str){ 
            opts.callBackFun && opts.callBackFun(str);    
        },function (){
           console.log("修改建议书状态出错！");
        });
    }
    return {
        loadFinishedInsurance: function (opts) {//根据保单ID查询投保人信息
            return loadFinishedInsurance(opts);
        },
        loadInsuranceByID:function (opts){//根据保单ID查找保单详细信息
            return loadInsuranceByID(opts);
        },
        saveOtherChargeWay:function (opts){//其他收费方式
            return saveOtherChargeWay(opts);
        },
        chargeFun:function (opts){//保单收费
            return chargeFun(opts);
        },
        loadInsuranceState:function (opts){//查询保单状态
            return loadInsuranceState(opts);
        },
        updateRecommendState:function (opts){//修改建议书状态
            return updateRecommendState(opts);
        }
    }
});