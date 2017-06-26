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

var CtrlMiningCreep = {                            
	createNew : function(creepName, path, lineSeq, isNew, a) {
		var STAT = {
			INIT : 0,
			GO : 1,
			BACK : 2,
			MINING : 3,
			DUMPING : 4,
		};
		
		var ins = _.assign({}, Base, CtrlCreep.createNew(creepName, a), {  
			_lineSeq : lineSeq,
			_path : path,
			_backPath : _(_.clone(path)).reverse().value(), 
			_stat : STAT.INIT,
		});
		
		var creep = Game.creeps[ins._creepName]; 
		if (!!!creep) return undefined;
		
		creep.memory.lineSeq = ins._lineSeq;
		if (!!isNew || !!!creep.memory.stat) creep.memory.stat = ins._stat;
		creep.memory.path = Tool.serializePath(ins._path);
				
		ins.tick = function() {			
			creep = Game.creeps[ins._creepName]; 
			if (!!!creep) return;   
			
			ins._stat = creep.memory.stat;
			// creep.say(ins._stat);
			switch(ins._stat) { 
			case STAT.INIT:
				{
					var orgPos = ins._path[0];			
					if (!_.isEqual(creep.pos, orgPos)) {
						var ret = creep.moveTo(orgPos);
						return;
					} 
					else {						
						ins._stat = STAT.GO;
						creep.memory.stat = ins._stat;
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
					if (!_.isEqual(creep.pos, destPos)) {
						creep.moveByPath(ins._path);
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
					creep.harvest(energySource);
					if (_.sum(creep.carry) == creep.carryCapacity) {
						ins._stat = STAT.BACK;
						creep.memory.stat = ins._stat;
					}
				}
				break;
			case STAT.BACK:
				{
					var destPos = _.last(ins._backPath);
					if (!_.isEqual(creep.pos, destPos)) {
						var ret = creep.moveByPath(ins._backPath);
						
						//creep.say(ret);
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
					}
					
					if (_.sum(creep.carry) == 0){ 
						ins.setRoundBegin();
						
						ins._stat = STAT.GO;
						creep.memory.stat = ins._stat;
					}
				}
				break;
			}
		}
		
		return ins;
	},
}

module.exports = CtrlMiningCreep;