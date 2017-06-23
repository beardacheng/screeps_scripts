var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager');
var Tool = require('tool');
var Base = require('base');

var CtrlCreep = {
	createNew : function() {
		var ins = {
			_setoffTime : Game.time,
			_roundUsedSecs : 100,
			_lastRoundUsedSecs : 100, 
		};
		
		ins.pickEnergyOnFloor = function(creep) {
			if (!!!creep) return;
			
			var sourceOnFloor = _(creep.room.lookAt(creep.pos)).filter({type:'resource'}).value();
			if (_.size(sourceOnFloor) > 0) {
				var energy = sourceOnFloor[0]['resource'];
				return creep.pickup(energy);
			}
		}
		
		ins.setRoundBegin = function() {
			ins._setoffTime = Game.time;
		}
		
		ins.setRoundEnd = function() {
			ins._lastRoundUsedSecs = ins._roundUsedSecs;
			ins._roundUsedSecs = Game.time - ins._setoffTime;
			console.log("!!" + ins._roundUsedSecs);
		}
		
		ins.getRoundUsedSecs = function() {			
			return ins._lastRoundUsedSecs;
		}
		
		return ins;
	},
}

module.exports = CtrlCreep;