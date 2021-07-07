const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'gend',
			category: 'giveaway',
			cooldown: 30,
			usage: '<messageID>',
			description: 'End a giveaway.',
			botPerms: ['EMBED_LINKS', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],
			dirname: __dirname,
			filename: __filename
		});
	}
	async run(message, args) {
		return this.client.giveawayManager.endGiveaway(args[0], message.guild).then(resultType => {
			if (resultType === 'NO_MSG_ID') {
				return message.reply({embed: { color: "RED", description: "<a:deny:810218259797245963> Please provide a Message **ID**"}}).then(msg => {
					msg.delete({ timeout: 1000000 })
				  });
			}

			if (resultType === 'NO_GIVEAWAY_FOUND') {
				return message.reply({ embed: { color: "RED", description: `"<a:deny:810218259797245963> No giveaway has been found with the ID \`${args[0]}\`...`}}).then(msg => {
					msg.delete({ timeout: 1000000 })
				  });
			}

			if (resultType === 'SUCCESSFUL_END') {
				return message.reply({ embed: { color: "GREEN", description: `<a:tick_Yes:810218354110758933> I have successfully ended the giveaway!`}}).then(msg => {
					msg.delete({ timeout: 1000000 })
				  });
			}

			return '';
		});
	}

};
