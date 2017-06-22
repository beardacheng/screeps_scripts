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
var CtrlMiningLine = require('ctrl.mining.line');
var Base = require('base');

var CtrlMiningEnergy = {
    createNew : function(roomName) {
		var ins = _.assign(Listener.createNew(), Base, { 
			_roomName : roomName,
			_paths : [],
			_lines : [],
			//_pathFindMatrix : new PathFinder.CostMatrix,
		});
		
		ins.init = function() {
		    var room = Game.rooms[ins._roomName];
		    var spawn = Game.spawns[WorldInfo.roomInfo(ins._roomName).spawnName()]; 
			
			ins.initEvent();
		   	
			//init paths
			if (room.memory.mining_energy_paths == undefined || !!!room.memory.spawnId ||room.memory.spawnId != spawn.id) {
			//if (true) {
			    _.forEach(room.find(FIND_SOURCES, {resourceType:RESOURCE_ENERGY}), function(value){
			        createPath(spawn.pos, value.pos);
			    })
				
				var paths = [];   
				_.forEach(ins._paths, function(v){
					paths.push(Tool.serializePath(v)); 
				})
				room.memory.mining_energy_paths = paths;
				room.memory.spawnId = spawn.id;
			}
			else {
				_.forEach(room.memory.mining_energy_paths, function(v){ 
					ins._paths.push(Tool.deserializePath(v));
				})
			}
		    
			_.each(ins._paths, function(v,i){
				ins._lines.push(CtrlMiningLine.createNew(i, ins._roomName, v));
			})
			
			return true;
		}
		
	    var createPath = function(from, to) { 
			var room = Game.rooms[ins._roomName];
			var roomInfo = WorldInfo.roomInfo(ins._roomName);
			var mineAt = to;

			var posesAround = Tool.findInRange(room, to, 1, 'terrain', ['swamp', 'plain']);
			
			while (_.size(posesAround) > 0) {
				posesAround = _.map(posesAround, function(v) {
					to.x = v.x;
					to.y = v.y;
					v.pathRet = PathFinder.search(from, to, {roomCallback: function() {return roomInfo._pathFindMatrix;},  swampCost : 1, maxCost : 100});
					return v.pathRet.incomplete ? undefined : v;
				});
				
				posesAround = _.compact(posesAround);
				if (_.size(posesAround) == 0) break;
				
				posesAround = _.sortBy(posesAround, _.property(['pathRet', 'cost']));
				var best = posesAround[0].pathRet.path; 
				ins._paths.push(best);
				posesAround = _.drop(posesAround, 1);
				
				//更新路线cost
				_.forEach(best, function(v) {  
					var orgCost = roomInfo._pathFindMatrix.get(v.x, v.y); 
					var addCost = 2;
					roomInfo._pathFindMatrix.set(v.x, v.y, 100);
				})
			}	
	    }
		
		ins.initEvent = function(){
			ins.AddListener(ENUM.EVNET_NAME.CREEP_CREATED, ins.eventHandleCreepCreated);
			ins.AddListener(ENUM.EVNET_NAME.CREEP_LOADED, ins.eventHandleCreepLoaded);
		}
		
		ins.tick = function() {			
		    var room = Game.rooms[ins._roomName]; 
			var spawn = Game.spawns[WorldInfo.roomInfo(ins._roomName).spawnName()]; 
			var roomInfo = ins.getRoomInfo();
			
			//画出线路
		    _.forEach(ins._paths, function(value){
		        room.visual.poly(value, {lineStyle:"dashed"});  
		    })
			
			//驱动线路
			_.forEach(ins._lines, function(v){ 
				v.tick();
			})
			
			//生成creep
			var creepCount = roomInfo.creepCount(ENUM.CREEP_TYPE.MINER);
			if (creepCount <= 0) {
				var event = {name: ENUM.EVNET_NAME.NEED_CREATE_CREEP, 
							body:[WORK,MOVE,CARRY], 
							type: ENUM.CREEP_TYPE.MINER,
							priority: ENUM.PRIORITY.LV_1}
				EventManager.dispatch(event)
			}
			/*
			else if (spawn.energy == spawn.energyCapacity) {
				//TODO: 
				if (_.size(Game.creeps) < 10){
					var event = {name: ENUM.EVNET_NAME.NEED_CREATE_CREEP, 
								body:[WORK,MOVE,CARRY], 
								type: ENUM.CREEP_TYPE.MINER};
					EventManager.dispatch(event); 
				}
				
			}*/
		}
		
		ins.eventHandleCreepCreated = function(event) {
			//TODO
			if (event.type == ENUM.CREEP_TYPE.MINER) { 
				ins._lines[0].addCreep(event.creepName);
			}
		}
		
		ins.eventHandleCreepLoaded = function(event) {
			if (event.roomName == ins._roomName && event.type == ENUM.CREEP_TYPE.MINER) {
				var creep = Game.creeps[event.creepName];
				
				//if (!!!creep.memory.lineSeq) console.log(creep.name);
				console.log(creep.memory.type);  
				ins._lines[creep.memory.lineSeq].addCreep(event.creepName); 
				
				console.log("MINING load creep(" + creep.name + ")");
			}
		}
		
		return ins;
	}
}

module.exports = CtrlMiningEnergy;