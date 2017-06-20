var CREEP_TYPE = {
	CONTROLLER : 'CONTROLLER',
}

module.exports = {
	CREEP_TYPE : {
		CONTROLLER : 'CONTROLLER',
	},
	
	PRIORITY : {
		LV_1 	: 	1,		//最高： 创建CREEP:当没有creep在为controller工作时
		LV_10	:  	10,
		LV_100 	: 	100,
	},
	
	EVNET_NAME : {
		NEED_CREATE_CREEP : "NEED_CREATE_CREEP", //body, type, priority,
	} ,
}