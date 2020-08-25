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
	const model = mongoose.model(file, schema);
	db.schemas[file] = schema;
	db[file] = model;
});
//console.log(db);

module.exports = db;
