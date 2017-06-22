/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('base');
 * mod.thing == 'a thing'; // true
 */
var WorldInfo = require('info.world').ins();

var Base = {
	getSpawn : function(){
		return Game.spawns[WorldInfo.roomInfo(this._roomName).spawnName()];
	},
	
	getRoom : function() {
		return Game.rooms[this._roomName];
	},
	
	getRoomInfo : function() {
		return WorldInfo.roomInfo(this._roomName);
	},

}

module.exports = Base;