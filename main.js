//var EventManager = require("event.manager").ins();
var Tool = require('tool');

//var Listener = require('event.listener');
//var ENUM = require('enum'); 
//var WorldInfo = require('info.world');
//var RoomInfo = require("info.room");
var HQ = require("ctrl.hq").ins()
//var CTRL_CONTROLLER = require("ctrl.controller");

Tool.init();
module.exports.loop = function() {
	HQ.tick();
} 

