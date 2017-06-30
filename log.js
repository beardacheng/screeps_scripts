var Global = require('global');

var Log = {
	info : function(v) {
		this.log("INFO", v);
	},
	
	warn : function(v) {
		this.log("WARN", v, true);
	},
	
	debug : function(v) {
		this.log("DEBUG", v, true);
	},
	
	log : function(type, v, showFileAndLine) {
		var fileAndLine = ""
		
		if (showFileAndLine) {
			try {
				throw new Error();
			} catch (e) {
				fileAndLine = e.stack.replace(/Error\n/).split(/\n/)[2].replace(/^.*\((.*)\).*$/, "$1");
				fileAndLine = "(" + fileAndLine + ")";
			}
		}
		
		console.log(type + "(P" + Global.ins()._id + "): " + v + " " + fileAndLine);
	},
}

module.exports = Log; 