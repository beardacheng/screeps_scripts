var EventManager = require('event.manager').ins();

var EventListener = {
	_uids : [],
	uid : function() {
		var id = _.random(10000000, 100000000 - 1, false);
		if (_.indexOf(this._uids, id) != -1) {
			return uid();
		}
		return id;
	},
	
	createNew : function() {
		var ins = {
			_id : EventListener.uid(),
		};
		
		ins.toString = function() {
			return "Eventlistener_" + ins._id;
		}
		
		ins.AddListener = function(eventName, dealFunc) {
			EventManager.add(eventName, this, dealFunc)
		}
		
		ins.RemoveListener = function(eventName) {
			EventManager.remove(eventName, this);
		}
		
		return ins;
	}
	
}

module.exports = EventListener;