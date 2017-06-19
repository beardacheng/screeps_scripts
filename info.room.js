/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('info.room');
 * mod.thing == 'a thing'; // true
 */

var Listener = require('event.listener');

var roomInfo = {	
    createNew: function(roomName) {
        var ins = _.assign(Listener.createNew(), {
            name : roomName,
			creepInfo : {
				init : function() {
					this.typeCount = {}
				},
				typeCount : {}  //type: controller
			}
        });
		
		//更新各类型creep数量信息
		ins.updateCreepInfo = function() {
			ins.creepInfo.init();
			
			_.forEach(Game.creeps, function(value) {
				var type = value.memory.type;
				ins.creepInfo.typeCount[type] = ins.creepInfo.typeCount[type] == undefined ?  1 : ins.creepInfo.typeCount[type] + 1
			})
		}
		
		ins.creepCount = function(type) {
			return ins.creepInfo.typeCount[type] == undefined ? 0 : ins.creepInfo.typeCount[type];
		}
        
        ins.log = function() {
            var room = Game.rooms[ins.name];
            console.log("controller level is " + room.controller.level);
            console.log("energy in the room " + room.energyAvailable + "/" + room.energyCapacityAvailable);
        }
        
        return ins; 
    }
}

module.exports = roomInfo;