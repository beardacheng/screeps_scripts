var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager');
var Tool = require('tool');
var Base = require('base');

var CtrlCreep = {
	createNew : function(creepName) {
		var ins = _.assign({}, Listener.createNew(), {
			_creepName : creepName,
			_setoffTime : Game.time,
			_roundUsedSecs : ENUM.MAX_ROUND_SECS,
			_lastRoundUsedSecs : ENUM.MAX_ROUND_SECS,  
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
		
		ins.build = function(creep) {
			var room = creep.room;
			
			var road = _.find(room.lookAt(creep.pos), {type:'structure'});
			if (!!!road) {
				room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
			}
			
			var area = Tool.createArea(creep.pos, 1);
			var sites = room.lookForAtArea(LOOK_CONSTRUCTION_SITES, area.top, area.left, area.bottom, area.right, true);
			if (_.size(sites) > 0) {
				var site = _.find(sites, function(v) { if (v.x != creep.pos.x || v.y != creep.pos.y) return true;});
				if (!!site) creep.build(site.constructionSite);
			}
		}
		
		return ins;
	},
}

module.exports = CtrlCreep;