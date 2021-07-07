/* eslint-disable id-length */
/* eslint-disable consistent-return */
const Prefix = require('../../Models/Prefix');
const Event = require('../../Structures/Event');

module.exports = class extends Event {

	// eslint-disable-next-line complexity
	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (message.author.bot || !message.guild) return;

		const prefixRes = await Prefix.findOne({ id: message.guild.id });

		const realPrefix = prefixRes ? prefixRes.prefix : this.client.prefix;

		if (message.content.match(mentionRegex)) message.channel.send({ embed: { color: "GREEN", description: `My prefix for ${message.guild.name} is \`${realPrefix}\`.`}});


		const prefix = message.content.match(mentionRegexPrefix) ?
			message.content.match(mentionRegexPrefix)[0] : realPrefix;

		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) {
				return message.channel.send({ embed: { color: "RED", description: 'Sorry, this command can only be used by the bot owners.'}});
			}

			if (command.guildOnly && !message.guild) {
				return message.channel.send({ embed: { color: "RED", description: 'Sorry, this command can only be used in a discord server.'}});
			}

			if (command.nsfw && !message.channel.nsfw) {
				return message.channel.send({ embed: { color: "RED", description: 'Sorry, this command can only be ran in a NSFW marked channel.'}});
			}

			if (command.args && !args.length) {
				return message.channel.send({ embed: { color: "RED", description: `Sorry, this command requires arguments to function. Usage: ${command.usage ?
					`${this.client.prefix + command.name} ${command.usage}` : 'This command doesn\'t have a usage format'}`}});
			}

			if (message.guild) {
				if (command.category.toLowerCase() === 'giveaway') {
					if (!message.channel.permissionsFor(message.guild.me).has(['EMBED_LINKS', 'ADD_REACTIONS'])) {
						return message.channel.send({ embed: { color: "RED", description: `I am missing \`EMBED_LINKS\` or \`ADD_REACTIONS\` permission. For simplicity. I require these permissions.`}});
					}

					const eventRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'giveaways');
					if (!message.member.hasPermission('MANAGE_GUILD') && !message.member.roles.cache.get(eventRole ? eventRole.id : undefined)) {
						return message.reply(`You must have a role called 'Giveaways' or 'MANAGE SERVER' permission`);
					}
				}
				const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
				if (userPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);
					if (missing.length) {
						return message.channel.send({ embed: { color: "RED", description: `You are missing ${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))} permissions, you need them to use this command!`}});
					}
				}

				const botPermCheck = command.botPerms ? this.client.defaultPerms.add(command.botPerms) : this.client.defaultPerms;
				if (botPermCheck) {
					const missing = message.channel.permissionsFor(this.client.user).missing(botPermCheck);
					if (missing.length) {
						return message.channel.send({embed: { color: "RED", description: `I am missing ${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))} permissions, I need them to run this command!`}});
					}
				}
			}

			command.run(message, args);
		}
	}

};
