/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('ctrl.mining.line');
 * mod.thing == 'a thing'; // true
 */
var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager');
var Tool = require('tool');
var CtrlMiningCreep = require('ctrl.mining.creep');

var CtrlMiningLine = {
	createNew : function(seq, roomName, path) {
		var ins = _.assign(Listener.createNew(), { 
			_roomName : roomName,
			_seq : seq, 
			_path : path,
			_creeps : [],
		});
		
		ins.init = function() {
			return true;
		};
		
		ins.tick = function() { 
			var invalidCreep = [];
			_.forEach(ins._creeps, function(v){
				var creep = Game.creeps[v._creepName];
				if (!!!creep) {
					invalidCreep.push(v); 
					return true;
				}
				//console.log("mine seq " + ins._seq + " tick, creep " + creep.name);
				v.tick();
			})
			_.pull(ins._creeps, invalidCreep);
		}
		 
		ins.addCreep = function(creepName, isNew) {
			ins._creeps.push(CtrlMiningCreep.createNew(creepName, ins._path, ins._seq, isNew)); 
		};
		
		return ins;
	}	
}

module.exports = CtrlMiningLine;