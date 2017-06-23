/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('info.room');
 * mod.thing == 'a thing'; // true
 */

var Listener = require('event.listener');
var ENUM = require('enum'); 

var roomInfo = {	
    createNew: function(roomName) {
        var ins = _.assign(Listener.createNew(), {
            name : roomName,
			creepInfo : {
				init : function() {
					this.typeCount = {}
				},
				typeCount : {}  //type: controller
			},
			_pathFindMatrix : new PathFinder.CostMatrix,
        });
		
		ins.init = function() {
			ins.initEvent();
		}
		
		//更新各类型creep数量信息
		ins.updateCreepInfo = function() {
			ins.creepInfo.init();
			
			_.forEach(Game.creeps, function(value) {
				var type = value.memory.type;
				ins.creepInfo.typeCount[type] = ins.creepInfo.typeCount[type] == undefined ?  1 : ins.creepInfo.typeCount[type] + 1
			})
		}
		
		ins.spawnName = function() {
		    if (ins._spawnName != undefined) {
		        return ins._spawnName; 
		    }
		    
		   _.forEach(Game.spawns, function(value, key){
				if (value.room.name == ins.name) {
				    ins._spawnName = key;
					return false;
				}
			}) 
			
			return ins._spawnName;
		}
		
		var lastUpdateTime = 0;
		ins.creepCount = function(type) {
		    if (Game.time != lastUpdateTime) {
		        ins.updateCreepInfo();
		        lastUpdateTime = Game.time;
		    }
		    
			return ins.creepInfo.typeCount[type] == undefined ? 0 : ins.creepInfo.typeCount[type];
		}
        
        ins.log = function() {
            var room = Game.rooms[ins.name];
            console.log("controller level is " + room.controller.level);
            console.log("energy in the room " + room.energyAvailable + "/" + room.energyCapacityAvailable);
        }
		
		ins.initEvent = function(){
			ins.AddListener(ENUM.EVENT_NAME.CREEP_CREATED, ins.eventHandleInitCreep);
			ins.AddListener(ENUM.EVENT_NAME.CREEP_LOADED, ins.eventHandleInitCreep);
		}
		
		ins.eventHandleInitCreep = function(event) {
			var type = event.type;
			ins.creepInfo.typeCount[type] = ins.creepInfo.typeCount[type] == undefined ?  1 : ins.creepInfo.typeCount[type] + 1
		}
        
        return ins; 
    }
}

module.exports = roomInfo;