/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('ctrl.resource.energy');
 * mod.thing == 'a thing'; // true
 */
var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager');
var Tool = require('tool');
var Base = require('base');
var Log = require('log');

var CtrlResourceEnergy = {
    createNew : function(roomName) {
		var ins = _.assign({}, Listener.createNew(), Base, { 
			_roomName : roomName,
		});

		var room = ins.getRoom();
		room.memory.energy_last_show = 0;
		room.memory.energy_add_waited = 0;
		room.memory.energy_sub_waited = 0;
	
	    ins.init = function() {
			var room = ins.getRoom();
			
	        ins.AddListener(ENUM.EVENT_NAME.ENERGY_WAITFOR_ADD, function(event) {
	            if (event.roomName == ins._roomName) room.memory.energy_add_waited++;
	        });
	         
	        ins.AddListener(ENUM.EVENT_NAME.ENERGY_WAITFOR_SUB, function(event) {
	            if (event.roomName == ins._roomName) room.memory.energy_sub_waited++;
	        });
	        
	        
	        return true;
	    }
	    
	    ins.tick = function() {
			var room = ins.getRoom();
			var spawn = ins.getSpawn();
			
			// 统计数据
	        if (Game.time % 60 == 0 && room.memory.energy_last_show != Game.time) {
	            Log.info("----- ENERGY INFO: ADD WAIT " + room.memory.energy_add_waited + "; SUB WAIT " + room.memory.energy_sub_waited + " -----");
	            room.memory.energy_add_waited = 0;
	            room.memory.energy_sub_waited = 0;
	            room.memory.energy_last_show = Game.time;
	        }
			
			//spawn是否已满 
			// console.log([spawn.energy, spawn.energyCapacity]);
			if (spawn.energy == spawn.energyCapacity) {
				EventManager.ins().dispatch({name:ENUM.EVENT_NAME.ENERGY_FULL, roomName: ins._roomName});
			}
			
	    }
		
		return ins;
    }
}

module.exports = CtrlResourceEnergy;