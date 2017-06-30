var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager');
var Tool = require('tool');
var CtrlControllerCreep = require('ctrl.controller.creep');
var Base = require('base');
var Log = require('log');

var CtrlController = {
	createNew : function(roomName) {
		var ins = _.assign({}, Listener.createNew(), Base, { 
			_roomName : roomName,
			_creeps : [], 
			_isFull : false,
		})
		
		var room = ins.getRoom();
		var controller = room.controller;
		var spawn = ins.getSpawn();
		var roomInfo = ins.getRoomInfo();
				
		ins.init = function() {
			ins.initEvent();
			
			// ins._path = PathFinder.search(spawn.pos, {pos:controller.pos, range:1}, {roomCallback: function() {return roomInfo._pathFindMatrix}, maxCost : 100}).path;

			var destPoses = Tool.findInRange(room, room.controller.pos, 2, 'terrain', ['plain', 'swamp']);
			var longestPath = _(destPoses).map(function(v){
				var path = PathFinder.search(spawn.pos, {pos : new RoomPosition(v.x, v.y, ins._roomName)});
				if (path.incomplete) return;
				path = path.path;
				return {path: path, length:_.size(path)};
			}).compact().sortBy('length').last().path;

			var nearPoses = function(pos) {
				var x = pos.x;
				var y = pos.y;
				var MAX = 49;
	
				var poses = [
								{x: x - 1, y: y - 1}, 	{x:x, y:y - 1}, 	{x: x + 1, y:y - 1}, 
								{x: x - 1, y: y	   }, 						{x: x + 1, y:y	  }, 
								{x: x - 1, y: y + 1}, 	{x:x, y:y + 1}, 	{x: x + 1, y:y + 1}, 
							];
				return _(poses).map(function(v) { return (v.x < 0 || v.x > MAX || v.y < 0 || v.y > MAX) ? undefined : v }).compact().value();
			}
			
			var index = 0;
			while(true) {
				var len = _.size(longestPath);
				if (len - index - 2 < 0)
					break;
				
				var lastPos = longestPath[len - index - 1];
				var lastPos2 = longestPath[len - index - 2];
				var commonNearbyPos = _.map(_.intersection(_.map(nearPoses(lastPos), function(v) {return v.x + '_' + v.y;}), 
												_.map(nearPoses(lastPos2), function(v) {return v.x + '_' + v.y;})), 
														function(v) {var pos = v.split('_'); return new RoomPosition(pos[0], pos[1], ins._roomName);});
		
				var isAdded = false;
							
				_.each(destPoses, function(v1) {
					var pos = _.find(commonNearbyPos, function(v2) {return v1.x == v2.x && v1.y == v2.y});
					if (!!!pos) return true;
				
					if (_.findIndex(longestPath, function(v){return v.x == pos.x && v.y == pos.y;}) != -1) return true;
			
					longestPath = _.slice(longestPath, 0, len - index - 1).concat([pos], _.slice(longestPath, len - index - 1));
					isAdded = true;
					return false;
				});	
				
				if (isAdded == false) {
					index++;
				}
			}
			
			ins._path = longestPath;
			_.forEach(ins._path, function(v) {
						roomInfo._pathFindMatrix.set(v.x, v.y, 100);
			})
			
			
			return true;
		}
		
		ins.initEvent = function(){
			ins.AddListener(ENUM.EVENT_NAME.CREEP_CREATED, ins.eventHandleInitCreep);
			ins.AddListener(ENUM.EVENT_NAME.CREEP_LOADED, ins.eventHandleInitCreep);
			ins.AddListener(ENUM.EVENT_NAME.CHECK_NEED_CREAT_CREEP, ins.eventHandleCreateCreepCheck);
		}
		
		ins.eventHandleCreateCreepCheck = function(event) {
			var spawn = ins.getSpawn();
			if (ins._isFull || spawn.energy < 50) return;
			event.types.push(ENUM.CREEP_TYPE.CONTROLLER);
		}
		
		ins.eventHandleInitCreep = function(event) {   
			if (event.type == ENUM.CREEP_TYPE.CONTROLLER) {
				var creep = CtrlControllerCreep.createNew(event.creepName, ins._path, event.name == ENUM.EVENT_NAME.CREEP_CREATED);
				
				if (!!creep) ins._creeps.push(creep);
				
				console.log("CONTROLLER load creep(" + event.creepName + ")");
			}
		}
		
		ins.tick = function() {
			var controller = room.controller; 
			if (!!!controller) return; 
			
			room.visual.poly(ins._path, {lineStyle:"dashed", stroke:"#00FF00"}); 
			
			var invalidCreep = [];
			
			ins._isFull = false;
			_.forEach(ins._creeps, function(v){ 
				var creep = Game.creeps[v._creepName];
				if (!!!creep) {
					invalidCreep.push(v);
					return true; 
				}
				//console.log("controller tick, creep " + creep.name);
				v.tick();
				//Log.debug(v._isWaiting);
				ins._isFull = ins._isFull || v._isWaiting;
			})
			_.pull(ins._creeps, invalidCreep);
			
			Log.debug('controller stat: ' + ins._isFull);
		}
		
		return ins;
	}
}

module.exports = CtrlController;