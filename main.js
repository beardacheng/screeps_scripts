
var Tool = require('tool'); 
var HQ = require("ctrl.hq");

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

