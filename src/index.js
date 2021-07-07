const config = require('../config.json');
const mongoose = require('mongoose');

const uri =
// eslint-disable-next-line max-len
`mongodb://admin:adminpassword1234@helper-bot-shard-00-00.t6obw.mongodb.net:27017,helper-bot-shard-00-01.t6obw.mongodb.net:27017,helper-bot-shard-00-02.t6obw.mongodb.net:27017/${config.db}?ssl=true&replicaSet=atlas-1kmcg4-shard-0&authSource=admin&retryWrites=true&w=majority`;
mongoose.connect(uri,
	{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	console.log(`Connected to the database!`);
}).catch((err) => {
	console.log(`Unable to connect to the Mongodb database. Error:${err}`, 'error');
});


const Client = require('./Structures/Client');

const client = new Client(config);
client.start();