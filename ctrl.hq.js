var Tool = require('tool');
var CTRL_CONTROLLER = require("ctrl.controller");
var CTRL_CREATE_CREEP = require("ctrl.create.creep");
var CTRL_MINING_ENERGY = require("ctrl.mining.energy");
var CtrlResourceEnergy = require('ctrl.resource.energy');
var WorldInfo = require('info.world');
var EventManager = require('event.manager');

var HQ = _.assign(_.clone(Tool.Singleton), {
	createNew : function() {
		var ins = {
			ctrls : [],
		};
		
		var initCtrl = function(value, key, ctrl) {
			var c = ctrl.createNew(key);
			if (c.init()) {
				ins.ctrls.push(c);
			}
		};
		
        _.forEach(Game.rooms, function(value,key) {
			initCtrl(value, key, CTRL_CONTROLLER);
			initCtrl(value, key, CTRL_MINING_ENERGY); 
			initCtrl(value, key, CTRL_CREATE_CREEP);
			initCtrl(value, key, CtrlResourceEnergy);
        })
		
		ins.deinit = function() {
			ins.ctrls = [];
			WorldInfo._ins = undefined;
			EventManager._ins = undefined;
		}
				
		ins.tick = function() {	
			_.forEach(ins.ctrls, function(value) {
				value.tick();
			})
		}
		
		return ins;
	}
});

module.exports = HQ;