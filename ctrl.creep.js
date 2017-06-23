var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager');
var Tool = require('tool');
var Base = require('base');

var CtrlCreep = {
	createNew : function() {
		var ins = {};
		
		ins.pickEnergyOnFloor = function(creep) {
			if (!!!creep) return;
			
			var sourceOnFloor = _(creep.room.lookAt(creep.pos)).filter({type:'resource'}).value();
			_.each(sourceOnFloor, function(v) {
				var energy = v['resource'];
				var ret = creep.pickup(energy); 
			});			
		}
		
		return ins;
	},
}

module.exports = CtrlCreep;