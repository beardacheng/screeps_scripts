var Tool = require('tool'); 

var Global = _.assign(_.clone(Tool.Singleton), {
	CPU_COUNT : 2,
	
	createNew : function() {
		var ins = {
			_id : Game.time % Global.CPU_COUNT,
		}
		
		var preticked = false;
		
		RawMemory.segments[ins._id] = JSON.stringify([]);
				
		ins.init = function() {
			ins._otherIDs = [];
			for (var i = 0; i < Global.CPU_COUNT; i++) { 
				if (i != ins._id) ins._otherIDs.push(i); 
			}
		}		
		
		ins.sendData = function(data) {
			_.each(ins._otherIDs, function(v) {
				var org = JSON.parse(RawMemory.segments[v]);
				org.push(data);
				RawMemory.segments[v] = JSON.stringify(org);
			})
		}
		
		ins.recvData = function() { 
			var memory = JSON.parse(RawMemory.segments[ins._id]);			
			if (_.size(memory) > 0) {
				var data = _.head(memory); 
				RawMemory.segments[ins._id] = JSON.stringify(_.drop(memory, 1));
				return data;
			}
			
			return null;
		}
		
		ins.tick = function() {
		}
		
		return ins;
	},
})

module.exports = Global;