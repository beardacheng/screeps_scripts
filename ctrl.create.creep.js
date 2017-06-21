var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager').ins();
var WorldInfo = require('info.world').ins();
var Tool = require('tool');

var CtrlCreateCreep = {
	createNew : function(roomName) {
		var ins = _.assign(Listener.createNew(), { 
			_roomName : roomName,
		});
		
		var spawn = Game.spawns[WorldInfo.roomInfo(ins._roomName).spawnName()]; 
		
		ins.init = function() {
			ins.initEvent();
			
			return true;
		}
		
		ins.initEvent = function(){
			ins.AddListener(ENUM.EVNET_NAME.NEED_CREATE_CREEP, ins.handleEventCreateCreep); 
		}
		
		ins.handleEventCreateCreep = function(event) {
			//console.log("recv event " + ENUM.EVNET_NAME.NEED_CREATE_CREEP + " type = " + event.type);
			switch(event.type) {
			case ENUM.CREEP_TYPE.MINER:
				var name = spawn.createCreep(event.body);
				if (typeof(name) == 'string') {
					var creep = Game.creeps[name];
					creep.memory.type = event.type;
					EventManager.dispatch({name: ENUM.EVNET_NAME.CREEP_CREATED, creepName:name});
				}
				break;
			}
		}
		
		ins.tick = function() {
		    
		}
		
		return ins;
	}
}

module.exports = CtrlCreateCreep;