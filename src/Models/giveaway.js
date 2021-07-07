const mongoose = require('mongoose');

// eslint-disable-next-line new-cap
const productSchema = mongoose.Schema({
	id: { type: String, required: true },
	time: { type: Number, required: true },
	serverRequirement: { type: Object, default: null },
	winners: { type: Number, required: true },
	roleRequirement: { type: Array, default: [] },
	prize: { type: String, required: true },
	host: { type: Object, required: true },
	channel: { type: String, required: true },
	embed: { type: Object, required: true },
	msgId: { type: String, required: true },
	enabled: { type: Boolean, required: true },
	guild: { type: String, required: true },
	msgLink: { type: String, required: true },
	startedAt: { type: Number, required: true }
});

module.exports = mongoose.model('Giveaway', productSchema);
