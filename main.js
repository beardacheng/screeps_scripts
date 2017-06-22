//var EventManager = require("event.manager").ins();
var Tool = require('tool'); 

//var Listener = require('event.listener');
//var ENUM = require('enum'); 
//var WorldInfo = require('info.world');
//var RoomInfo = require("info.room");
var HQ = require("ctrl.hq");
//var CTRL_CONTROLLER = require("ctrl.controller");

Tool.init();
var myRoomNames = [];
module.exports.loop = function() { 
	var nowRoomNames = _.map(Game.rooms, function(v,k){return k;});
	
	if (myRoomNames.length == 0) {
		myRoomNames = nowRoomNames;
	}
	else if(!_.isEqual(myRoomNames, nowRoomNames)) {
		HQ.ins().deinit();
		HQ._ins = undefined;
		myRoomNames = nowRoomNames
	}
	
	HQ.ins().tick();
} 

