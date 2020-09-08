// !ATCHUNG!: Extremely hacky stuff.
// This makes any code using `using()` only work in this application.
global.using = require('app-root-path').require;
global.sneak = using("lib/sneak");

// !ATCHUNG!: Slightly less hacky stuff. Front-load some utility functions into the global namespace.
global.isArray = function(a) { return a.constructor === Array; }
global.isBool = function(b) { return typeof(b) === 'boolean' || b.constructor === Boolean; }
global.isNumber = function(n) { return typeof(n) === 'number' || n.constructor === Number; }
global.isString = function(s) { return typeof(s) === 'string' || s.constructor === String; }
global.isObject = function(o) { return typeof(o) === 'object' && o.constructor === Object }

global.clamp = function(v, min, max) { if (v < min) { return min; } if (v > max) { return max; } return v; }
global.clamp01 = function(v) { if (v < 0) { return 0; } if (v > 1) { return 1; } return v; }
global.add = function(a, b) { return a + b; }
global.mul = function(a, b) { return a * b; }
global.ratio = function(a, b) { return (1.0 - (1.0 - clamp01(a)) * (1.0 - clamp01(b))); }

function Random() {
	this.range = function(min, max) { const r = max-min; return min + Random.value() * r; };
	this.normal = function() { return (Random.value + Random.value + Random.value) / 3.0; }
	this.choose = function(it) {
		if (isArray(it)) { return it.choose(); }
		if (isObject(it)) { 
			weight = coll.sum;
		}
		return it;
	}
}
Object.defineProperty(Random.prototype, "value", { get: Math.random });
global.Random = new Random();
console.log(global.Random.value);


// !ATCHUNG!: Load more hacky stuff.
const DUCKPUNCHED = require("./duckpunches");
// console.log("Duckpunches: ", DUCKPUNCHED);

require("./app");
