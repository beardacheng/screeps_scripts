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
var EventManager = require('event.manager').ins();
var Tool = require('tool');

var CtrlMiningCreep = {
	createNew : function(creepName, path) {
		var STAT = {
			INIT : 0,
			GO : 1,
			BACK : 2,
			MINING : 3,
			DUMPING : 4,
		};
		
		var ins = _.assign(Listener.createNew(), { 
			_creepName : creepName,
			_path : path,
			_stat : STAT.INIT,
		});
		
		var creep = Game.creeps[ins._creepName];
		console.log('look at ' + creep + ". name is " + ins._creepName);
		if (!!!creep) return;
		
		if (creep.memory.stat == undefined) {
			creep.memory.stat = ins._stat;
			//console.log(ins._path); 
			creep.memory.path = Room.serializePath(ins._path);
		}
		else {
			ins._stat = creep.memory.stat;
			ins._path = Room.deserializePath(creep.memory.path);
			console.log(ins._path); 
		}
		
		ins.tick = function() {
			
			if (!!!creep) return;
			
			switch(ins._stat) {
			case STAT.INIT:
				{
					var orgPos = ins._path[0];
					if (creep.pos != orgPos) {
						creep.moveTo(orgPos);
						return;
					}
					else {
						ins._stat = STAT.GO;
					}
				}
				break;
			case STAT.GO:
				{
					var ret = creep.moveByPath(ins._path);
					if (ret == OK && creep.pos == _.last(ins._path)) {
						ins._stat = STAT.MINING;
					}
				}
				break;
			case STAT.MINING:
				{
					var resource = Tool.findTerrainInRange(creep.room, creep.pos, 1, ['resource']);
					console.log(resource);
				}
				break;
			}
		}
		
		return ins;
	},
}

module.exports = CtrlMiningCreep;