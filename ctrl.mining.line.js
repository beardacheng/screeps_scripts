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
var Log = require('log');
var Base = require('base');
var CtrlCreep = require('ctrl.creep');

var CtrlMiningLine = {
	createNew : function(seq, roomName, path) {
		var ins = _.assign({}, Base, Listener.createNew(), { 
			_roomName : roomName,
			_seq : seq, 
			_path : path,
			_creeps : [],
			_priority : _.size(path),
			_full : true,
			_canBuild : false,
		});
		
		ins.AddListener(ENUM.EVENT_NAME.MINE_LINE_FULL, function(event) {
			if (event.roomName == ins._roomName && event.seq == ins._seq) {
				// Log.debug('line ' + ins._seq + ' full is ' + event.isFull);
				ins._full = event.isFull;
			}
		});
		
		ins.AddListener(ENUM.EVENT_NAME.ENERGY_OVER_FULL, function(event) {
			if (event.roomName == ins._roomName) {
				ins._canBuild = true;
			}
		});
		
		ins.tick = function() { 
			var validSceeps = [];
			var roundUsedSecs = [];
			var spawn = ins.getSpawn();
			
			if (spawn.energy != spawn.energyCapacity) ins._canBuild = false;
			
			_.forEach(ins._creeps, function(v){
				var creep = Game.creeps[v._creepName]; 
				if (!!!creep) {
					return true;
				}
				//console.log("mine seq " + ins._seq + " tick, creep " + creep.name);
				v.tick();
				roundUsedSecs.push(v.getRoundUsedSecs()); 
				validSceeps.push(v); 
			})
				
			ins._creeps = validSceeps;
			
			//更新优先级
			ins.updatePriority();
			
			//test 
            //Log.debug([ins._seq, ins.isFull()]);
		};
		
		ins.updatePriority = function() {
			var roundUsedSecs = [];
			_.forEach(ins._creeps, function(v){				
				roundUsedSecs.push(v.getRoundUsedSecs());  
			})
			
			//计算creep创建优先级
			if (_.size(roundUsedSecs) > 0) {  
				ins._priority = _.floor(_.sum(roundUsedSecs) / _.size(roundUsedSecs));
			}
			else {
				ins._priority = 0;
			}

		}
		
		ins.isCanAddCreep = function() {
			return _.size(ins._creeps) == 0 || (_.size(ins._creeps) < _.size(ins._path) && !ins.isFull());
		}
		 
		ins.addCreep = function(creepName, isNew) { 			 
			//console.log('new creep is ' + newCreep + ' seq is ' + ins._seq);
			ins._creeps.push(CtrlMiningCreep.createNew(creepName, ins, isNew)); 
			ins.updatePriority();
		};
		
		ins.isFull = function() {
		    var room = ins.getRoom();
		    return _.size(Tool.findInRange(room, _.first(ins._path), 0, 'creep')) == 1 
		            || _.size(Tool.findInRange(room, _.last(ins._path), 0, 'creep')) == 1 ; 
		};
		
		return ins;
	}	
}

module.exports = CtrlMiningLine;