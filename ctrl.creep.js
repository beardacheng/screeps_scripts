var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager');
var Tool = require('tool');
var Base = require('base');
var Log = require('log');

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
			var site = _(room.lookForAtArea(LOOK_CONSTRUCTION_SITES, area.top, area.left, area.bottom, area.right, true)).filter(function(v) { 
			    return (v.x != creep.pos.x || v.y != creep.pos.y);
			}).sortBy(
			    function(v) {
			        return v.progress / v.progressTotal; 
			    }).last();
			    
			if (site != undefined) {
				creep.build(site.constructionSite);
			}
			
		}
		
		ins.findNearByStructure = function(types) {
		    var range = 1;
		    var creep = Game.creeps[ins._creepName];
		    
		    return _.map(Tool.findInRange(creep.room, creep.pos, 1, 'structure', types), 'structure');
		};
		
		ins.carryEnergy = function() {
		    return Game.creeps[ins._creepName].carry[RESOURCE_ENERGY];
		}
		
		ins.dumpEnergy = function() {
		    var creep = Game.creeps[ins._creepName];
		    var storages = ins.findNearByStructure([STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_STORAGE]);
		    if (_.size(storages) == 0 || ins.carryEnergy() == 0) return;
		    
		    var count = ins.carryEnergy();
		    _.each(storages, function(v) {
		        creep.transfer(v, RESOURCE_ENERGY);
		    })
		};
		
		return ins;
	},
}

module.exports = CtrlCreep;