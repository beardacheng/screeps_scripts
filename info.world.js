/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('info.world');
 * mod.thing == 'a thing'; // true
 */
var Tool = require('tool');
var RoomInfo = require("info.room");

var worldInfo = _.assign(_.clone(Tool.Singleton), {
    createNew: function() {
        var ins = _.assign(Tool.Singleton, {
            roomInfos:{} 
        });
        
		//创建房间信息
        _.forEach(Game.rooms, function(value,key) {
                ins.roomInfos[key] = RoomInfo.createNew(key); 
        })
		
		//获取房间信息
		ins.roomInfo = function(roomName) {
			return ins.roomInfos[roomName]; 
		}
        
		//打印房间信息
        ins.log = function() {
            _.forEach(ins.roomInfos, function(value, key) {
                value.log();
            })
        }
        
        return ins;
    },
});

module.exports = worldInfo;