const quickdraw = using("lib/quickdraw");
const config = using("config");

const mongoose = require('mongoose');

mongoose.connect(`mongodb://${config.db.url}`, {
	useNewUrlParser: true,
	useUnifiedTopology:true
});

const db = {
	schemas: {},
	conn:mongoose,
}

quickdraw(__filename, (schema, file, err) => {
	if (err) { throw err; }
	const slash = file.lastIndexOf("/");
	const shortName = (slash > 0) ? file.substring(slash+1) : file;
	
	try {
		const model = mongoose.model(shortName, schema);
		db.schemas[shortName] = schema;
		db[shortName] = model;
	} catch (err) {
		console.log("error converting", shortName, "to schema/model.", err, "\nSkipping", shortName);
	}	
});
console.log(Object.keys(db.schemas));

module.exports = db;
