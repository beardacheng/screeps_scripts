/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('event.manager');
 * mod.thing == 'a thing'; // true
 */

var Tool = require('tool');

var EventManager = _.assign({
	createNew : function() {
		var ins = {
			_listeners : {}
		}
		
		ins.add = function(eventName, listener, dealFunc) {
			var key = eventName + "_" + listener;
			this._listeners[key] = {
				_name : eventName,
				_listener : listener,
				_dealFunc : dealFunc,
			}
		}
		
		ins.remove = function(eventName, listener) {
			var key = eventName + "_" + listener;
			delete this._listener[key];
		}
		
		ins.dispatch = function(event) {
		    //console.log("dispatch " + event.name + ", listener count "  + _.size(this._listeners))
			_.forEach(this._listeners, function(value, key) {
				if (value._name == event.name) {
					value._dealFunc.call(value._listener, event)
				}
			})
		}
		
		return ins;
	}
	
}, Tool.Singleton);


module.exports = EventManager;