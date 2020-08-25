const quickdraw = using("lib/quickdraw");
const config = {};

quickdraw(__filename, (cfg, file, err) => {
	if (err) { throw err; }
	// console.log(`Loading config [${file}]`);
	config[file] = cfg;
});
// console.log(config);

module.exports = config;
