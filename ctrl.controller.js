var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager');
var Tool = require('tool');
var CtrlControllerCreep = require('ctrl.controller.creep');
var Base = require('base');

var CtrlController = {
	createNew : function(roomName) {
		var ins = _.assign(Listener.createNew(), Base, { 
			_roomName : roomName,
			_creeps : []
		})
		
		var room = ins.getRoom();
		var controller = room.controller;
		var spawn = ins.getSpawn();
		var roomInfo = ins.getRoomInfo();
		
		ins.init = function() {
			ins.initEvent();
			
			ins._path = PathFinder.search(spawn.pos, {pos:controller.pos, range:1}, {roomCallback: function() {return roomInfo._pathFindMatrix}, maxCost : 100}).path;
			_.forEach(ins._path, function(v) {  
				roomInfo._pathFindMatrix.set(v.x, v.y, 100);
			})
			
			
			return true;
		}
		
		ins.initEvent = function(){
			ins.AddListener(ENUM.EVNET_NAME.CREEP_CREATED, ins.eventHandleInitCreep);
			ins.AddListener(ENUM.EVNET_NAME.CREEP_LOADED, ins.eventHandleInitCreep);
		}
		
		ins.eventHandleInitCreep = function(event) {  
			if (event.type == ENUM.CREEP_TYPE.CONTROLLER) {
				ins._creeps.push(CtrlControllerCreep.createNew(event.creepName, ins._path));
				
				console.log("CONTROLLER load creep(" + event.creepName + ")");
			}
		}
		
		ins.tick = function() {
			var controller = room.controller; 
			if (!!!controller) return; 
			
			var creepCount = roomInfo.creepCount(ENUM.CREEP_TYPE.CONTROLLER);
			if (creepCount <= 1) {
				var event = {name: ENUM.EVNET_NAME.NEED_CREATE_CREEP, 
							body:[WORK,MOVE,CARRY], 
							type: ENUM.CREEP_TYPE.CONTROLLER}
				EventManager.ins().dispatch(event)
			}
			
			room.visual.poly(ins._path, {lineStyle:"dashed", stroke:"#00FF00"}); 
			
			var invalidCreep = [];
			_.forEach(ins._creeps, function(v){
				var creep = Game.creeps[v._creepName];
				if (!!!creep) {
					invalidCreep.push(v);
					return true; 
				}
				console.log("controller tick, creep " + creep.name);
				v.tick();
			})
			_.pull(ins._creeps, invalidCreep);

		}
		
		return ins;
	}
}

module.exports = CtrlController;