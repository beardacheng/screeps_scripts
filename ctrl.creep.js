var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager');
var Tool = require('tool');
var Base = require('base');

var CtrlCreep = {
	createNew : function(creepName, a) {
		var ins = _.assign({}, Listener.createNew(), {
			_creepName : creepName,
			_setoffTime : Game.time,
			_roundUsedSecs : 100,
			_lastRoundUsedSecs : 100,  
		});
		
		ins.AddListener(ENUM.EVENT_NAME.CREEP_ROUND_END, function(event) {
			if (ins._creepName == event.creepName) {
				ins._lastRoundUsedSecs = event.roundSecs;
				return false;
			}
		});
		
		ins.pickEnergyOnFloor = function(creep) {
			if (!!!creep) return;
			
			var sourceOnFloor = _(creep.room.lookAt(creep.pos)).filter({type:'resource'}).value();
			if (_.size(sourceOnFloor) > 0) {
				var energy = sourceOnFloor[0]['resource'];
				return creep.pickup(energy);
			}
		}
		
		ins.setRoundBegin = function() {
			ins._roundUsedSecs = Game.time - ins._setoffTime;
			EventManager.ins().dispatch({name: ENUM.EVENT_NAME.CREEP_ROUND_END, creepName:ins._creepName, roundSecs : ins._roundUsedSecs});
			ins._setoffTime = Game.time;
		}
		

		ins.getRoundUsedSecs = function() {			
			return ins._lastRoundUsedSecs;
		}
		
		return ins;
	},
}

module.exports = CtrlCreep;