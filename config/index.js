const quickdraw = using("lib/quickdraw");
const config = {}

quickdraw(__filename, (cfg, file, err) => {
	if (err) { throw err; }
	config[file] = cfg;
});

module.exports = config;
