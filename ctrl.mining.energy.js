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
var EventManager = require('event.manager');
var Tool = require('tool');
var CtrlMiningLine = require('ctrl.mining.line');
var Base = require('base');
var Log = require('log');
var Global = require('global');

var CtrlMiningEnergy = {
    createNew : function(roomName) {
		var ins = _.assign({}, Listener.createNew(), Base, { 
			_roomName : roomName,
			_paths : [],
			_lines : [],
		});
		
		ins.init = function() {
			var room = ins.getRoom();
			var spawn = ins.getSpawn();
			var roomInfo = ins.getRoomInfo();
			
			ins.initEvent();
		   	
			//init paths 
			if (ins.needInitPath()) {
			    Log.info('----INIT PATH----');
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
		
		ins.needInitPath = function() {
			var room = ins.getRoom();
			var spawn = ins.getSpawn();
			var roomInfo = ins.getRoomInfo();
						
			return room.memory.mining_energy_paths == undefined || !!!room.memory.spawnId ||room.memory.spawnId != spawn.id;
		}
		
	    var createPath = function(from, to) { 
			var room = ins.getRoom();
			var spawn = ins.getSpawn();
			var roomInfo = ins.getRoomInfo();
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
			ins.AddListener(ENUM.EVENT_NAME.CREEP_CREATED, ins.eventHandleCreepCreated);
			ins.AddListener(ENUM.EVENT_NAME.CREEP_LOADED, ins.eventHandleCreepLoaded);
			ins.AddListener(ENUM.EVENT_NAME.CHECK_NEED_CREAT_CREEP, ins.eventHandleCreateCreepCheck);
		}
		
		ins.eventHandleCreateCreepCheck = function(event) {
			if (ins.highestLineFree() == -1) return;
			event.types.push(ENUM.CREEP_TYPE.MINER);
		}
		
		ins.tick = function() {	
			//画出线路
			ins.showLine(); 
			
			//驱动线路
			_.forEach(ins._lines, function(v){  
				v.tick();
				// console.log('line ' + v._seq + ' pri is ' + v._priority);
			})			
			
			//
			Log.debug(_.map(ins._lines, '_priority'));
			Log.debug(ins.highestLineFree());
		}

		ins.showLine = function() {
			var room = ins.getRoom();
			var spawn = ins.getSpawn();
			var roomInfo = ins.getRoomInfo();
			
		    _.forEach(ins._paths, function(value){
		        room.visual.poly(value, {lineStyle:"dashed"});  
		    })
		}
		
		ins.highestLineFree = function() {
			var pri = ENUM.MAX_ROUND_SECS; 
			var seq = -1;
			
			_.each(ins._lines, function(v,i){  
				if (!v.isCanAddCreep()) return true;
				
				if (v._priority < pri) {
					pri = v._priority;
					seq = i;
				}
			});
			
			return seq;
		}
		
		ins.eventHandleCreepCreated = function(event) {
			if (event.type == ENUM.CREEP_TYPE.MINER) { 
				var creep = Game.creeps[event.creepName];
				
				var lineSeq = !!creep.memory.lineSeq ? creep.memory.lineSeq : ins.highestLineFree();
				ins._lines[lineSeq].addCreep(event.creepName, true);  
			}
		}
		
		ins.eventHandleCreepLoaded = function(event) { 
			if (event.roomName == ins._roomName && event.type == ENUM.CREEP_TYPE.MINER) {
				var creep = Game.creeps[event.creepName];
				if (creep.memory.lineSeq === undefined) {
					Log.warn('seq invalid, creep name is ' + creep.name);
					return;
				}
				
				ins._lines[creep.memory.lineSeq].addCreep(event.creepName); 
				Log.debug("MINING load creep(" + creep.name + ")");
			}
		}
		

		
		return ins;
	}
}

module.exports = CtrlMiningEnergy;