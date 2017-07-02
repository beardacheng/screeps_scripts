/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('ctrl.mining.creep');
 * mod.thing == 'a thing'; // true
 */

var Listener = require('event.listener');
var ENUM = require('enum'); 
var Tool = require('tool');
var EventManager = require('event.manager');
var CtrlCreep = require('ctrl.creep');
var Base = require('base');
var Log = require('log');

var CtrlMiningCreep = {                            
	createNew : function(creepName, line, isNew) {
		var STAT = {
			INIT : 0,
			GO : 1,
			BACK : 2,
			MINING : 3,
			DUMPING : 4,
		};
		
		var ins = _.assign({}, Base, CtrlCreep.createNew(creepName), {  
			_lineSeq : line._seq,
			_path : line._path,
			_backPath : _(_.clone(line._path)).reverse().value(),  
			_stat : STAT.INIT,
			_orgPos : null,
			_initStatSecs : 0,
		});
		
		var creep = Game.creeps[ins._creepName]; 
		ins._roomName = creep.room.name;
		if (!!!creep) return undefined;
		
		if (!!isNew || !!!creep.memory.stat) {
			creep.memory.stat = ins._stat;
			creep.memory.lineSeq = ins._lineSeq;
			Log.debug(creep.memory.lineSeq);
		}
					
		creep.memory.path = Tool.serializePath(ins._path);
						
		ins.tick = function() {			
			creep = Game.creeps[ins._creepName]; 
			if (!!!creep) return;   
			
			ins._stat = creep.memory.stat;
			// creep.say(ins._stat);
			switch(ins._stat) { 
			case STAT.INIT:
				{
				    ins._initStatSecs++;
				    
					var orgPos = ins._path[0];			
					if (!_.isEqual(creep.pos, orgPos)) { 
						var ret = creep.moveTo(orgPos);
					} 
					else {						
						ins._stat = STAT.GO;
						creep.memory.stat = ins._stat; 
					}
					
					if (ins._initStatSecs >= 200) {
					    creep.say('i am over init');
					    var spawn = ins.getSpawn();
					    spawn.recycleCreep(creep);
					}
				}
				break;
			case STAT.GO:
				{
					if (OK == ins.pickEnergyOnFloor(creep)) { 
						break;
					}
					
					if (creep.carryCapacity == creep.carry[RESOURCE_ENERGY]) {
						ins._stat = STAT.BACK;
						creep.memory.stat = ins._stat;
					}
					
					var destPos = _.last(ins._path);
					var tmp = creep.pos;
					if (!_.isEqual(creep.pos, destPos)) {
						var ret = creep.moveByPath(ins._path);
						
						if (ret == ERR_NOT_FOUND) 
						{
							ins._stat = STAT.INIT;
							creep.memory.stat = ins._stat; 
						}
						else if (OK == ret) {
							if (!_.isEqual(ins._orgPos, creep.pos)) {
								ins._orgPos = creep.pos;
							}
						}
					}
					else {
						ins._stat = STAT.MINING;
						creep.memory.stat = ins._stat;
					}
				}
				break;
			case STAT.MINING:
				{
					var energySource = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
					var ret = creep.harvest(energySource);
					
					creep = Game.creeps[ins._creepName]; 
					
					
					EventManager.ins().dispatch({name:ENUM.EVENT_NAME.MINE_LINE_FULL, 
						roomName : ins._roomName, seq : ins._lineSeq, isFull :  (ret == ERR_NOT_ENOUGH_RESOURCES || ins.isCreepBehind(_.last(ins._path)))});
					
					if (_.sum(creep.carry) == creep.carryCapacity) { 
						
							
						ins._stat = STAT.BACK;
						creep.memory.stat = ins._stat;
					}
				}
				break;
			case STAT.BACK:
				{
					var room = ins.getRoom();
					
					ins.build(creep);
					ins.dumpEnergy();
					
					if (_.sum(creep.carry) == 0) {
						ins._stat = STAT.GO;
						creep.memory.stat = ins._stat;
						break;
					}
					
					var destPos = _.last(ins._backPath);
					if (!_.isEqual(creep.pos, destPos)) {
						var ret = creep.moveByPath(ins._backPath);
						
						// creep.say(ret);
					}
					else {
						ins._stat = STAT.DUMPING;
						creep.memory.stat = ins._stat;
					}
				}
				break; 
			case STAT.DUMPING:
				{
					var storage = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
					var ret = creep.transfer(storage, RESOURCE_ENERGY);
					if (ERR_FULL == ret) {
					    EventManager.ins().dispatch({name: ENUM.EVENT_NAME.ENERGY_WAITFOR_ADD, roomName:creep.room.name});
						EventManager.ins().dispatch({name:ENUM.EVENT_NAME.MINE_LINE_FULL, roomName : ins._roomName, seq : ins._lineSeq, isFull : true});
						
						ins.build(creep);
						if (_.sum(creep.carry) == 0) {
							ins._stat = STAT.GO;
							creep.memory.stat = ins._stat;
							break;
						}
						
					}
					
					creep = Game.creeps[ins._creepName]; 
					if (_.sum(creep.carry) == 0){ 
						ins.setRoundBegin();
						
						ins._stat = STAT.GO;
						creep.memory.stat = ins._stat;
					}
				}
				break;
			}
		}
		
		ins.isCreepBehind = function(pos) {
			if (_.isEqual(pos, _.first(ins._path))) return false;
			
			var index = _.findLastIndex(ins._path, function(v) {
				return  _.isEqual(pos, v);
				});
			
			if (-1 == index) return false;
			
			var room = ins.getRoom();
			var creepBehind = _.find(room.lookAt(ins._path[index - 1]), _.property('creep'));
			return !!creepBehind;
		}
		
		return ins;
	},
}

module.exports = CtrlMiningCreep;