

module.exports = {
	CREEP_TYPE : {
		CONTROLLER : 'CONTROLLER',
		MINER : 'MINER',
	},
	
	PRIORITY : {
		LV_1 	: 	1,		//最高： 创建CREEP:当没有creep在为controller工作时
		LV_10	:  	10,
		LV_100 	: 	100,
	},
	
	EVENT_NAME : {
		NEED_CREATE_CREEP : "NEED_CREATE_CREEP", //body, type, priority,
		CREEP_CREATED : "CREEP_CREATED",  //creepName
		CREEP_LOADED : "CREEP_LOADED", 		//creepName, type, roomName
		
		ENERGY_ADD : "ENERGY_ADD",      //添加energy:  type , count
		ENERGY_SUB : "ENERGY_SUB",      //使用energy:  type , count
		ENERGY_FULL : "ENERGY_FULL",     //
		
		ENERGY_WAITFOR_ADD : "ENERGY_WAITFOR_ADD", //roomName
		ENERGY_WAITFOR_SUB : "ENERGY_WAITFOR_SUB", //roomName
	} ,
	
	ENERGY_ADD_FOR : {
	    MINE : "MINE",                      //挖矿
	    RECYCLE_CREEP : "RECYCLE_CREEP",    //回收creep
	},
	
	ENERGY_SUB_FOR : {
	    CREATE_CREEP : "CREATE_CREEP",      //造creep
	    CONTROLLER : "CONTROLLER",          //填充controllor
	}
}