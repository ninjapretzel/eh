Object.defineProperty(Object.prototype, "isPojo", { 
	value: function() { 
		if (typeof(this)!=="object") { return false; }
		const proto = Object.getPrototypeOf(this);
		return !proto || proto.constructor.name === "Object";
	},
});


module.exports = "OBJECT";
