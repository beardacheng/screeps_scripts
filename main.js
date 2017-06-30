
var Tool = require('tool'); 
var HQ = require("ctrl.hq");
var Global = require('global');
var Log = require('log');
var EventManager = require('event.manager');
var ENUM = require('enum');

Tool.init();
Global.ins().init();

var spawnIDs = [];
module.exports.loop = function() { 
	EventManager.ins().tick(); 
	
	if (Global.ins()._id == 0) {
		var nowSpawnIDs = _.map(Game.spawns, function(v){return v.id});
				
		if (spawnIDs.length == 0) {
			spawnIDs = nowSpawnIDs; 
		}
		else if(_.size(_.xor(spawnIDs, nowSpawnIDs)) != 0) { 
			Log.info("system reset, send event");
			EventManager.ins().dispatch({name : ENUM.EVENT_NAME.SYSTEM_INIT});
			
			//init memory here
			_.each(Game.rooms, function(v) {
				Log.info("reset memory of room " + v.name);
				v.memory = {};
			})
			
			spawnIDs = nowSpawnIDs;
		}
	}
	
	if (Global.ins()._needInit) {
		var globalID = Global.ins()._id;
		
		EventManager._ins = undefined;
		EventManager.ins();
		
		Global._ins = undefined;
		Global.ins(globalID).init();
		
		HQ.ins().deinit();
		HQ._ins = undefined;
		
		// Global.ins()._needInit = false;
		Log.info("system reseted");
	}
	
	HQ.ins().tick();	
	Global.ins().tick();
} 

