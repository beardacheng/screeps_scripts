/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('ctrl.mining.energy');
 * mod.thing == 'a thing'; // true
 */
 
var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager').ins();
var WorldInfo = require('info.world').ins();
var Tool = require('tool');
var CtrlMiningCreep = require('ctrl.mining.creep');

var CtrlMiningEnergy = {
    createNew : function(roomName) {
		var ins = _.assign(Listener.createNew(), { 
			_roomName : roomName,
			_paths : [],
			_creeps : [],
		});
		
		ins.init = function() {
		    var room = Game.rooms[ins._roomName];
		    var spawn = Game.spawns[WorldInfo.roomInfo(ins._roomName).spawnName()]; 
			
			ins.initEvent();
		   	
		    _.forEach(room.find(FIND_SOURCES, {resourceType:RESOURCE_ENERGY}), function(value){
		        createPath(spawn.pos, value.pos);
		    })
			
			if (_.size(Game.creeps) == 0){
				var event = {name: ENUM.EVNET_NAME.NEED_CREATE_CREEP, 
							body:[WORK,MOVE,CARRY], 
							type: ENUM.CREEP_TYPE.MINER};
				EventManager.dispatch(event); 
			}
			
			//初始化creep
			/*
			var creepsInRoom = _.filter(Game.creeps, _.property(['room', 'name']), ins._roomName);
			_.forEach(creepsInRoom, function(v) { 
				ins._creeps.push(CtrlMiningCreep.createNew(v.name, [])); 
			})
			*/
		    
			return true;
		}
		
	    var createPath = function(from, to) { 
			var room = Game.rooms[ins._roomName];
			var roomInfo = WorldInfo.roomInfo(ins._roomName);
			var mineAt = to;

			var posesAround = Tool.findTerrainInRange(room, to, 1, ['swamp', 'plain']);
			
			_.forEach(posesAround, function(v){
				roomInfo._pathFindMatrix.set(v.x, v.y, 2);
			})
			
			while (_.size(posesAround) > 0) {
				posesAround = _.map(posesAround, function(v) {
					to.x = v.x;
					to.y = v.y;
					v.pathRet = PathFinder.search(from, to, {roomCallback: function() {return roomInfo._pathFindMatrix}, swampCost : 1});
					return v; 
				});
				
				posesAround = _.sortBy(posesAround, _.property(['pathRet', 'cost']));
				var best = posesAround[0].pathRet.path;
				ins._paths.push(best);
				posesAround = _.drop(posesAround, 1);
				
				//更新路线cost
				_.forEach(best, function(v) { 
					var orgCost = roomInfo._pathFindMatrix.get(v.x, v.y);
					var addCost = 1;
					roomInfo._pathFindMatrix.set(v.x, v.y, orgCost == 0 ? 1 + addCost : orgCost + addCost);
				})
			}	
			
			
	    }
		
		ins.initEvent = function(){
			ins.AddListener(ENUM.EVNET_NAME.CREEP_CREATED, ins.eventHandleCreepCreated);
		}
		
		ins.tick = function() {
		    var room = Game.rooms[ins._roomName];
		    _.forEach(ins._paths, function(value){
		        room.visual.poly(value, {lineStyle:"dashed"});  
		    })
		}
		
		ins.eventHandleCreepCreated = function(event) {
			ins._creeps.push(CtrlMiningCreep.createNew(event.creepName, ins._paths[0])); 
		}
		
		return ins;
	}
}

module.exports = CtrlMiningEnergy;