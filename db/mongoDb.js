const MongoClient = require('mongodb').MongoClient;
const MONGO_URI = require('./config.js').uri;
const MONGO_DB = require('./config.js').db;

module.exports = function(app) {
	MongoClient.connect(MONGO_URI, { useNewUrlParser: true })
		.then(async client => {
			const db = client.db(MONGO_DB);
			app.users = db.collection('users');
			console.log('Database connection established');
		})
		.catch(err => console.error(err));
};