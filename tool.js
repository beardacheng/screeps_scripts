/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tool');
 * mod.thing == 'a thing'; // true
 */

var Tool = {
	Singleton : {		
	    _ins : undefined,
		ins : function() {
			if (this._ins == undefined) { 
				switch(arguments.length) {
				case 1:
					this._ins = this.createNew(arguments[0]);
					break;
				case 2:
					this._ins = this.createNew(arguments[0], arguments[1]);
					break;
				case 3:
					this._ins = this.createNew(arguments[0], arguments[1], arguments[2]);
					break;
				default:
					this._ins = this.createNew.apply(this, arguments);
				}
			}        
			return this._ins;
		},
		deinit : function() {
			
		},
	},
	
	init : function(){
		
	},
	
	findInRange : function(room, pos, range, type, types) {
		return _.filter(room.lookAtArea(pos.y - range, pos.x - range , pos.y + range, pos.x + range, true), function(value) {			
			switch(value.type){
			case 'terrain':
				return value.type == type && types.indexOf(value.terrain) != -1;
			case 'source':
				return value.type == type;
			default:
				return false;
			} 
		}) 
	},
	
	serializePath : function(path) {
	    if (_.size(path) == 0) return "";
	    var s = path[0].roomName;
	    _.forEach(path, function(v) { s += "|" + v.x + "_" + v.y});
		this.deserializePath(s); //TODO: delete
	    return s;
	},
	
	deserializePath : function(path) {
	    var poses = path.split("|");
		var roomName = poses[0];
		var ret = [];
		
		poses = _.drop(poses, 1);
		_.forEach(poses, function(v){
			var xy = v.split("_");
			ret.push(new RoomPosition(xy[0], xy[1], roomName))
		});
		
		return ret;
	},
	
	createArea : function(center, range) {
		var x = center.x;
		var y = center.y;
		var MAX = 49;
		
		return {top : y - range < 0 ? 0 : y - range, bottom : y + range > MAX ? MAX : y + range, 
				left : x - range < 0 ? 0 : x - range, right : x + range > MAX ? MAX : x + range};
	},
}



module.exports = Tool;