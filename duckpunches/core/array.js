Object.defineProperty(Array.prototype, "last", { get: function() { return this[this.length-1]; } } );
Object.defineProperty(Array.prototype, "choose", { value: function() { const pick = Math.floor(Random.value() * this.length); return this[pick]; } } );


// Verify: 
const x = [ 1,2,3 ];
if (x.last !== 3) { console.log("Error verifying {Array.last} duckpunch. x=", x, "x.last=", x.last); }
try { x.choose(); } catch (err) { console.log("Error verifying {Array.choose()} duckpunch.", err); }

const y = [];
if (y.choose()) { console.log("Error verifying {Array.choose()} duckpunch."); }

module.exports = "ARRAY";
