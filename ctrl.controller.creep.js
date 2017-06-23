

var Listener = require('event.listener');
var ENUM = require('enum'); 
var Tool = require('tool');
var Base = require('base');
var EventManager = require('event.manager');
var CtrlCreep = require('ctrl.creep');

var CtrlControllerCreep = {
	createNew : function(creepName, path) {
		var STAT = {
			INIT : 0,
			GO : 1,
			BACK : 2,
			WITHDRAW : 3,
			DUMPING : 4,
		};
		
		var AHEAD_STAT = _.assign(STAT, {
			NO_CREEP : -1,
			PATH_END : -2,
		});
		
		var ins = _.assign(Listener.createNew(), Base, CtrlCreep.createNew(), { 
			_creepName : creepName, 
			_path : path,
			_backPath : _(_.clone(path)).reverse().value(), 
			_stat : STAT.INIT,
		});
		
		var creep = Game.creeps[ins._creepName]; 
		if (!!!creep) return undefined; 
		ins._roomName = creep.room.name;
		
		if (!!!creep.memory.stat) creep.memory.stat = ins._stat; 
		creep.memory.path = Tool.serializePath(ins._path);
				
		ins.tick = function() {
			creep = Game.creeps[ins._creepName]; 
			spawn = ins.getSpawn();
			if (!!!creep) return;   
			
			ins._stat = creep.memory.stat;
			//creep.say(ins._stat);
			switch(ins._stat) { 
			case STAT.INIT:
				{
					var orgPos = ins._path[0];		  	
					if (!_.isEqual(creep.pos, orgPos)) {
						var ret = creep.moveTo(orgPos);
						return;
					} 
					else {
						ins._stat = STAT.WITHDRAW;
						creep.memory.stat = ins._stat;
					}
				}
				break;
			case STAT.WITHDRAW:
				{
					var ret = creep.withdraw(spawn, RESOURCE_ENERGY, creep.carryCapacity - _.sum(creep.carry));
					if (ERR_NOT_ENOUGH_RESOURCES == ret) {
					    EventManager.ins().dispatch({name: ENUM.EVNET_NAME.ENERGY_WAITFOR_SUB, roomName:creep.room.name});
					}
					
					if (creep.carryCapacity == _.sum(creep.carry)) {
						ins._stat = STAT.GO;
						creep.memory.stat = ins._stat;
						EventManager.ins().dispatch({name: ENUM.EVNET_NAME.ENERGY_SUB, type:ENUM.ENERGY_SUB_FOR.CONTROLLER, count : creep.carryCapacity});
					}
					else {
						
					}
				}
				break;
			case STAT.GO:
				{
					var destPos = _.last(ins._path);
					if (!_.isEqual(creep.pos, destPos)) {
						var ret = creep.moveByPath(ins._path);
						
						var aheadCreepStat = ins.aheadCreepStat(creep.pos);
						if (aheadCreepStat == AHEAD_STAT.DUMPING || aheadCreepStat == AHEAD_STAT.PATH_END) {
							ins._stat = STAT.DUMPING;
							creep.memory.stat = ins._stat;
						}

					}
					else {
						ins._stat = STAT.DUMPING;
						creep.memory.stat = ins._stat;
					}
					
					
				}
				break;
			case STAT.DUMPING:
				{
					if (_.sum(creep.carry) == 0) {
						ins._stat = STAT.BACK;
						creep.memory.stat = ins._stat;
						break;
					}
					
					var aheadCreepStat = ins.aheadCreepStat(creep.pos);
					if (!(aheadCreepStat == AHEAD_STAT.DUMPING || aheadCreepStat == AHEAD_STAT.PATH_END)) {
						ins._stat = STAT.GO;
						creep.memory.stat = ins._stat;
					}
					else {
						var ret = creep.upgradeController(creep.room.controller);
						if (ERR_NOT_IN_RANGE == ret) {
							ins._stat = STAT.GO;
							creep.memory.stat = ins._stat;
						}
					}
				}
				break;
			case STAT.BACK:
				{
					ins.pickEnergyOnFloor(creep); 
					
					var destPos = _.last(ins._backPath);
					if (!_.isEqual(creep.pos, destPos)) {
						var ret = creep.moveByPath(ins._backPath);
					}
					else {
						ins._stat = STAT.WITHDRAW;
						creep.memory.stat = ins._stat;
					}
				}
				break;
			} 
		};
		
		ins.aheadCreepStat = function(pos) {
			
			if (_.isEqual(pos, _.last(ins._path))) return AHEAD_STAT.PATH_END;
			
			var index = _.findLastIndex(ins._path, function(v) {
				return  _.isEqual(pos, v);
				});
			
			if (-1 == index) return null;
			
			var room = ins.getRoom();
			var aheadCreep = _.find(room.lookAt(ins._path[index + 1]), _.property('creep'));
			if (!!!aheadCreep) return AHEAD_STAT.NO_CREEP;
			aheadCreep = aheadCreep.creep;
			return aheadCreep.memory.stat;
		};
		
		return ins;
	},
}

module.exports = CtrlControllerCreep;