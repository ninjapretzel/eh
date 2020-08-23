// Duckpunching:
// When you want something to be a duck, 
// but it does not look like a duck, walk like a duck, or quack like a duck.
// so you punch it until it looks like a duck, walks like a duck, and quacks like a duck.

const quickdraw = using("/lib/quickdraw");

const dps = { failed: 0, loaded: {} };

quickdraw(__filename, (dp, file, err) => {
	if (err) { throw err; }
	dps.loaded[file] = dp;
});

module.exports = dps
