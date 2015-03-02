angular.module('starter.filters', [])
/**
*代码格式化
* add by genglan
* 2015-1-24
*/ 
.filter('codeFormat', function(Variables,CommonFn){
	var codeFormatFun = function(code,arg){
		return CommonFn.loadCodeNameByCode(Variables.codeJson,arg,code)
	}
	return codeFormatFun;
})
/**
*获取险种名称
* add by genglan
* 2015-1-24
*/ 
.filter('productCodeToName',function (Variables,CommonFn){
	var productFormatFun = function (code){
        return CommonFn.loadProductNameByCode(Variables.productJson,code);	
	}
   	return productFormatFun ;
})
/**
*获取险种名称
* add by genglan
* 2015-2-4
*/ 
.filter('bankCodeToName',function (Variables,CommonFn){
	var bankFun = function (code){
        return CommonFn.loadBankNameByCode(Variables.bankJson,code);	
	}
   	return bankFun ;
})
/**
*添加单位
* add by genglan
* 2015-1-24
*/
.filter('appendDescri',function (){
	var append = function(data,arg){
        return data? data+ arg :'';
	}
	return append;
})
/**
*保单状态
* add by genglan 
* 2015-2-2
*/
.filter('insuranceState',function (){
	var stateFun = function(data){
		var returnStr = '';
		switch(data) {
			case '-2':
				returnStr = '处理异常';
				break;
			case '-4':
				returnStr = '客户合并中';
				break;
			case '-1':
				returnStr = '未提交';
				break;
			case '0':
				returnStr = '待交费';
				break;
			case '1':
				returnStr = '待核报审核';
				break;
			case '2':
				returnStr = '已交费';
				break;
			case '3':
				returnStr = '承保前撤单';
				break;
			case '4':
				returnStr = '保单承保';
				break;
			case '5':
				returnStr = '保单已打印';
				break;
			case '6':
				returnStr = '已签章';
				break;
			case '7':
				returnStr = '退保';
				break;
			case '8':
				returnStr = '退保回退';
				break;
			case '9':
				returnStr = '超额转线下';
				break;
			case '-3':
				returnStr = '未知状态';
				break;
			case '-5':
				returnStr = '超过未成年人风险保额';
				break;
			case '11':
				returnStr = '已签单';
				break;
			case '12':
				returnStr = '撤单';
				break;
			case '13':
				returnStr = '拒保';
				break;
			case '14':
				returnStr = '延期';
				break;
			case '-6':
				returnStr = '支付失败';
				break;
			default :
				returnStr = '其他';
		}
		return returnStr;
	}
	return stateFun;
})