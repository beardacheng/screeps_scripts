/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('event.manager');
 * mod.thing == 'a thing'; // true
 */

var Tool = require('tool');
var Global = require('global');
var ENUM = require('enum');

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
		    // console.log("dispatch " + event.name + ", listener count "  + _.size(this._listeners))
			ins.handleEvent(event);
			
			if (_.indexOf(ENUM.EVENT_NAME.BroadcastEvents(), event.name) != -1) {
				// console.log('send global event ' + event.name);
				Global.ins().sendData(event);
			}
		}
		
		ins.handleEvent = function(event) {
			_.forEach(ins._listeners, function(value, key) {
				if (value._name == event.name) {
					return !!!value._dealFunc.call(value._listener, event);
				}
			})
		}
		
		ins.tick = function() {
			var event = Global.ins().recvData(); 
			while(event != null) {				
				// console.log('recv global event ' + event.name);
				ins.handleEvent(event);
				event = Global.ins().recvData();
			}
		}
		
		return ins;
	}
	
}, Tool.Singleton);


module.exports = EventManager;