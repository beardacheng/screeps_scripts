/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('ctrl.mining.energy');
 * mod.thing == 'a thing'; // true
 */
 
var Listener = require('event.listener');
var ENUM = require('enum'); 
var EventManager = require('event.manager').ins();
var WorldInfo = require('info.world').ins();

var CtrlMiningEnergy = {
    createNew : function(roomName) {
		var ins = _.assign(Listener.createNew(), { 
			_roomName : roomName,
			_paths : []
		});
		
		ins.init = function() {
		    var room = Game.rooms[ins._roomName];
		    var spawn = Game.spawns[WorldInfo.roomInfo(ins._roomName).spawnName()]; 
		    
		    console.log(spawn);

		    _.forEach(room.find(FIND_SOURCES, {resourceType:RESOURCE_ENERGY}), function(value){
		        createPath(spawn.pos, value.pos);
		    })
		    
			return true;
		}
		
	    var createPath = function(from, to) {
	        
	        
	        console.log(from + " -> " + to);
	        var path = PathFinder.search(from, to);
	        ins._paths.push(path.path);
	    }
		
		ins.initEvent = function(){
			
		}
		
		
		ins.tick = function() {
		    var room = Game.rooms[ins._roomName];
		    
		    _.forEach(ins._paths, function(value){
		        room.visual.poly(value, {lineStyle:"dashed"});  
		    })

		}
		
		return ins;
	}
}

module.exports = CtrlMiningEnergy;