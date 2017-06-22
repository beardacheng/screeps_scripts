var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager').ins();
var WorldInfo = require('info.world').ins();
var Tool = require('tool');

var CtrlCreateCreep = {
	createNew : function(roomName) {
		var ins = _.assign(Listener.createNew(), { 
			_roomName : roomName,
			_loadedCreeps : false,
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
			if (OK != spawn.canCreateCreep(event.body)) return; 
			
			var name = spawn.createCreep(event.body); 
			if (typeof(name) == 'string') { 
				console.log("creep created, name is " + name + ", type is " + event.type);
				
				var creep = Game.creeps[name];
				creep.memory.type = event.type; 
				EventManager.dispatch({name: ENUM.EVNET_NAME.CREEP_CREATED, type: event.type, creepName:name});
			}
		}
		
		ins.tick = function() {
		    if (!ins._loadedCreeps) {
				//初始化creep
				_.forEach(Game.creeps, function(v) { 
					EventManager.dispatch({name: ENUM.EVNET_NAME.CREEP_LOADED, roomName: v.room.name, creepName:v.name, type: v.memory.type});
				})
				
				ins._loadedCreeps = true;
		    }
		}
		
		return ins;
	}
}

module.exports = CtrlCreateCreep;