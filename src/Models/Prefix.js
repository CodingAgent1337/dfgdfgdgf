const { model, Schema } = require('mongoose');

const productSchema = new Schema({
	id: { type: String, required: true },
	prefix: { type: String, required: true }
});

module.exports = model('Prefix', productSchema);
