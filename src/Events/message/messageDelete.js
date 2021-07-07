const Event = require('../../Structures/Event');

module.exports = class extends Event {

	// eslint-disable-next-line valid-jsdoc
	/**
     *
     * @param {import('discord.js').Message} m Message
     */
	// eslint-disable-next-line id-length
	async run(m) {
		if (m.partial) return;
		this.client.snipe.set(m.channel.id, {
			content: m.content,
			sender: m.author.id,
			timestamp: m.createdTimestamp
		});
	}

};