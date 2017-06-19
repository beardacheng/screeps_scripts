var Tool = require('tool');
var CTRL_CONTROLLER = require("ctrl.controller");

var HQ = _.assign(_.clone(Tool.Singleton), {
	createNew : function() {
		var ins = {
			ctrls : [],
		};
		
        _.forEach(Game.rooms, function(value,key) {
			var ctrl = CTRL_CONTROLLER.createNew(key);
			ins.ctrls.push(ctrl);
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