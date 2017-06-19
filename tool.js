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
				this._ins = this.createNew();
			}        
			return this._ins;
		},
	},
	
	init : function(){
		
	}
}



module.exports = Tool;