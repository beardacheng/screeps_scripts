var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager');
var Tool = require('tool');
var Base = require('base');
var Log = require('log');

var CtrlCreateCreep = {
	createNew : function(roomName) {
		var ins = _.assign({}, Listener.createNew(), Base, { 
			_roomName : roomName,
			_loadedCreeps : false,
		});
		
		var spawn = ins.getSpawn();
		
		ins.init = function() {
			ins.initEvent();
			
			return true;
		}
		
		ins.initEvent = function(){
			ins.AddListener(ENUM.EVENT_NAME.ENERGY_FULL, ins.handleEventEnergyFull); 
		}
		
		ins.createCreep = function(body, type) {
		    spawn = ins.getSpawn();
			// Log.debug('create creep ' + body + "; " + type);
			var ret = spawn.canCreateCreep(body);
			if (OK != ret) {
			    //console.log("can't create, ret " + ret + " body is " + event.body + " total energy is " + spawn.energy + " name is " + spawn.name);
			    return; 
			}
			
			var orgEnergyCount = spawn.energy;
			var name = spawn.createCreep(body); 
			if (typeof(name) == 'string') { 
				Log.info("creep created, name is " + name + ", type is " + type);
				
				var creep = Game.creeps[name];
				creep.memory = {};
				creep.memory.type = type; 
				EventManager.ins().dispatch({name: ENUM.EVENT_NAME.CREEP_CREATED, type: type, creepName:name});
			}
		}
		
		ins.handleEventEnergyFull = function(event) {
			if (ins._roomName != event.roomName) return;

			//query
			var queryEvent = {name: ENUM.EVENT_NAME.CHECK_NEED_CREAT_CREEP, roomName: ins._roomName, types:[]};
			EventManager.ins().dispatch(queryEvent);
			
			var roomInfo = ins.getRoomInfo();
			
			if (roomInfo.creepCount(ENUM.CREEP_TYPE.MINER) < 3) {
				if (_.indexOf(queryEvent.types, ENUM.CREEP_TYPE.MINER) != -1) {
					ins.createCreep([WORK,MOVE,CARRY], ENUM.CREEP_TYPE.MINER);
					return;
				}
			} 
			else if (roomInfo.creepCount(ENUM.CREEP_TYPE.CONTROLLER) == 0) {
				if (_.indexOf(queryEvent.types, ENUM.CREEP_TYPE.CONTROLLER) != -1) {
					ins.createCreep([WORK,MOVE,CARRY], ENUM.CREEP_TYPE.CONTROLLER);
					return;
				}
			} 
			
			if (_.indexOf(queryEvent.types, ENUM.CREEP_TYPE.MINER) != -1)
			{
				ins.createCreep([WORK,MOVE,CARRY], ENUM.CREEP_TYPE.MINER);
			}
			else if (_.indexOf(queryEvent.types, ENUM.CREEP_TYPE.CONTROLLER) != -1)
			{
				ins.createCreep([WORK,MOVE,CARRY], ENUM.CREEP_TYPE.CONTROLLER);
			}
			else {
				EventManager.ins().dispatch({name:ENUM.EVENT_NAME.ENERGY_OVER_FULL, roomName: ins._roomName});
				Log.info('OVERFLOW');
			}
			
		}
		
		ins.tick = function() {
		    if (!ins._loadedCreeps) {
				//初始化creep
				_.forEach(Game.creeps, function(v) { 
					EventManager.ins().dispatch({name: ENUM.EVENT_NAME.CREEP_LOADED, roomName: v.room.name, creepName:v.name, type: v.memory.type});
				})
				
				ins._loadedCreeps = true;
		    }
		}
		
		return ins;
	}
}

module.exports = CtrlCreateCreep;