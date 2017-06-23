var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager');
var Tool = require('tool');
var Base = require('base');

var CtrlCreateCreep = {
	createNew : function(roomName) {
		var ins = _.assign(Listener.createNew(), Base, { 
			_roomName : roomName,
			_loadedCreeps : false,
		});
		
		var spawn = ins.getSpawn();
		
		ins.init = function() {
			ins.initEvent();
			
			return true;
		}
		
		ins.initEvent = function(){
			ins.AddListener(ENUM.EVNET_NAME.NEED_CREATE_CREEP, ins.handleEventCreateCreep); 
		}
		
		ins.handleEventCreateCreep = function(event) { 
		    spawn = ins.getSpawn();
			//console.log("recv event " + ENUM.EVNET_NAME.NEED_CREATE_CREEP + " type = " + event.type);
			var ret = spawn.canCreateCreep(event.body);
			if (OK != ret) {
			    //console.log("can't create, ret " + ret + " body is " + event.body + " total energy is " + spawn.energy + " name is " + spawn.name);
			    return; 
			}
			
			var orgEnergyCount = spawn.energy;
			var name = spawn.createCreep(event.body); 
			if (typeof(name) == 'string') { 
				console.log("creep created, name is " + name + ", type is " + event.type);
				
				var creep = Game.creeps[name];
				creep.memory.type = event.type; 
				EventManager.ins().dispatch({name: ENUM.EVNET_NAME.CREEP_CREATED, type: event.type, creepName:name});
				EventManager.ins().dispatch({name: ENUM.EVNET_NAME.ENERGY_SUB, type:ENUM.ENERGY_SUB_FOR.CREATE_CREEP, count : orgEnergyCount - spawn.energy});
			}
		}
		
		ins.tick = function() {
		    if (!ins._loadedCreeps) {
				//初始化creep
				_.forEach(Game.creeps, function(v) { 
					EventManager.ins().dispatch({name: ENUM.EVNET_NAME.CREEP_LOADED, roomName: v.room.name, creepName:v.name, type: v.memory.type});
				})
				
				ins._loadedCreeps = true;
		    }
		}
		
		return ins;
	}
}

module.exports = CtrlCreateCreep;