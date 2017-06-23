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
		
		ins.SendData = function(data) {
			_.each(ins._otherIDs, function(v) {
				var org = JSON.parse(RawMemory.segments[v]);
				org.push(data);
				RawMemory.segments[v] = JSON.stringify(org);
			})
		}
		
		ins.RecvData = function() { 
			var memory = JSON.parse(RawMemory.segments[ins._id]);			
			if (_.size(memory) > 0) {
				var data = _.head(memory); 
				RawMemory.segments[ins._id] = JSON.stringify(_.drop(memory, 1));
				return data;
			}
			
			return null;
		}
		
		ins.tick = function() {
			RawMemory.setActiveSegments([0,1]);
			if (preticked) {
				preticked = true;
				return; 
			}
			
			ins.SendData(Game.time);
			var data = ins.RecvData();
		}
		
		return ins;
	},
})

module.exports = Global;