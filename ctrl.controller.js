var Listener = require('event.listener');
var WorldInfo = require('info.world').ins();
var ENUM = require('enum'); 
var EventManager = require('event.manager').ins();

var CtrlController = {
	createNew : function(roomName) {
		var ins = _.assign(Listener.createNew(), { 
			_roomName : roomName,
		})
		
		ins.init = function() {
			return true;
		}
		
		/*
		//event
		ins.AddListener("TEST_EVENT", function(event) {
			console.log(event.str);
		})
		*/
		
		//EventManager.dispatch({name: "TEST_EVENT", str:"event system is valid"})
		
		ins.tick = function() {
			var roomInfo = WorldInfo.roomInfo(this._roomName);
			var creepCount = roomInfo.creepCount(ENUM.CREEP_TYPE.CONTROLLER);
			
			if (creepCount <= 0) {
				var event = {name: ENUM.EVNET_NAME.NEED_CREATE_CREEP, 
							body:[WORK,MOVE,CARRY], 
							type: ENUM.CREEP_TYPE.CONTROLLER,
							priority: ENUM.PRIORITY.LV_1}
				EventManager.dispatch(event)
			}
		}
		
		return ins;
	}
}

module.exports = CtrlController;