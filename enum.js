

module.exports = {
	MAX_ROUND_SECS : 99999999,
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
		SYSTEM_INIT : "SYSTEM_INIT",
		
		NEED_CREATE_CREEP : "NEED_CREATE_CREEP", //body, type, priority,
		CREEP_CREATED : "CREEP_CREATED",  //creepName
		CREEP_LOADED : "CREEP_LOADED", 		//creepName, type, roomName
		CREEP_ROUND_END : "CREEP_ROUND_END", //creepName, roundSecs
		
		CHECK_NEED_CREAT_CREEP : "CHECK_NEED_CREAT_CREEP", //roomName, types
		
		ENERGY_ADD : "ENERGY_ADD",      //添加energy:  type , count
		ENERGY_SUB : "ENERGY_SUB",      //使用energy:  type , count
		ENERGY_FULL : "ENERGY_FULL",     //roomName 
		ENERGY_OVER_FULL : "ENERGY_OVER_FULL", //roomName
		
		MINE_LINE_FULL : "MINE_LINE_STAT", //roomName, seq,isFull
		//CONTROLLER_LINE_FULL : 'CONTROLLER_LINE_FULL', //roomName , isFull
		
		ENERGY_WAITFOR_ADD : "ENERGY_WAITFOR_ADD", //roomName
		ENERGY_WAITFOR_SUB : "ENERGY_WAITFOR_SUB", //roomName
		
		BroadcastEvents : function() { 
			return [this.CREEP_CREATED, 
					this.ENERGY_ADD,
					this.ENERGY_SUB,
					this.ENERGY_WAITFOR_ADD, 
					this.ENERGY_WAITFOR_SUB, 
					this.CREEP_ROUND_END,
					this.SYSTEM_INIT, 
					this.MINE_LINE_FULL, 
					this.CONTROLLER_LINE_FULL];
		},
	},
	
	ENERGY_ADD_FOR : {
	    MINE : "MINE",                      //挖矿
	    RECYCLE_CREEP : "RECYCLE_CREEP",    //回收creep
	},
	
	ENERGY_SUB_FOR : {
	    CREATE_CREEP : "CREATE_CREEP",      //造creep
	    CONTROLLER : "CONTROLLER",          //填充controllor
	}
}