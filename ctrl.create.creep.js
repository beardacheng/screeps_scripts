var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager').ins();

var CtrlCreateCreep = {
	createNew : function(roomName) {
		var ins = _.assign(Listener.createNew(), { 
			_roomName : roomName,
			_spawn : undefined,
		});
		
		ins.init = function() {
			_.forEach(Game.spawns, function(value){
				if (value.room.name == ins._roomName) {
					ins._spawn = value;
					return false;
				}
			})
			
			//初始化判断
			if (!!!ins._spawn) 
				return false;
			
			ins.initEvent();
			
			return true;
		}
		
		ins.initEvent = function(){
			ins.AddListener(ENUM.EVNET_NAME.NEED_CREATE_CREEP, ins.handleEventCreateCreep);
		}
		
		ins.handleEventCreateCreep = function(event) {
			console.log("recv event " + ENUM.EVNET_NAME.NEED_CREATE_CREEP);
		}
		
		ins.tick = function() {
		}
		
		return ins;
	}
}

module.exports = CtrlCreateCreep;