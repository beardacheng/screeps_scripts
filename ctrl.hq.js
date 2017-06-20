var Tool = require('tool');
var CTRL_CONTROLLER = require("ctrl.controller");
var CTRL_CREATE_CREEP = require("ctrl.create.creep");

var HQ = _.assign(_.clone(Tool.Singleton), {
	
	
	createNew : function() {
		var ins = {
			ctrls : [],
		};
		
		var initCtrl = function(value, key, ctrl) {
			var c = ctrl.createNew(key);
			if (c.init()) {
				console.log(c);
				ins.ctrls.push(c);
			}
		};
		
        _.forEach(Game.rooms, function(value,key) {
			initCtrl(value, key, CTRL_CONTROLLER);
			initCtrl(value, key, CTRL_CREATE_CREEP);
        })
		
		/*
		//event
		ins.AddListener("TEST_EVENT", function(event) {
			console.log(event.str);
		})
		*/
		
		//EventManager.dispatch({name: "TEST_EVENT", str:"event system is valid"})
		
		ins.tick = function() {
			_.forEach(ins.ctrls, function(value) {
				value.tick();
			})

		}
		
		return ins;
	}
});

module.exports = HQ;