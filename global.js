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
				console.log(v);
				console.log("!!" + RawMemory.segments[v]);
				var org = JSON.parse(RawMemory.segments[v]);
				org.push(data);
				RawMemory.segments[v] = JSON.stringify(org);
				RawMemory.setActiveSegments([v]);
			})
		}
		
		ins.RecvData = function() { 
			var memory = RawMemory.segments[ins._id];
			console.log("recvdata : " + memory);
			
			/*
			if (_.size(memory) > 0) {
				var data = _.head(memory);
				RawMemory.segments[ins._id] = JSON.stringify(_.drop(memory, 1));
			}
			*/
		}
		
		ins.tick = function() {
			if (preticked) {
				preticked = true;
				return;
			}
			
			console.log('i am ' + ins._id);
			ins.SendData(Game.time);
			console.log('send ' + Game.time);
			console.log('recv ' + ins.RecvData());
			console.log('i am ' + ins._id + ' end');
		}
		
		return ins;
	},
})

module.exports = Global;