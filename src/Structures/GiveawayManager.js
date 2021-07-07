/* eslint-disable id-length */
/* eslint-disable valid-jsdoc */
// eslint-disable-next-line no-unused-vars
const { Collection, Guild, User, TextChannel, MessageEmbed, Invite, Role, Message } = require('discord.js');
const Giveaway = require('./../Models/giveaway');
// eslint-disable-next-line no-unused-vars
const Ghost = require('./Client');

async function fetchReactedUsers(reaction, after) {
	const opts = { limit: 100, after };
	const reactions = await reaction.users.fetch(opts);
	if (!reactions.size) return [];

	const last = reactions.last().id;
	const next = await fetchReactedUsers(reaction, last);
	return reactions.array().concat(next);
}

module.exports = class GiveawayManager {

	constructor(client) {
		/**
         * @type {Ghost}
         */
		this.client = client;
	}

	/**
     *
     * @param {string} prize
     * @param {Invite} serverReq
     * @param {Arra<Role>} roleReq
     * @param {number} time
     * @param {Guild} guild
     * @param {User} host
     * @param {TextChannel} channel
     * @param {number} msgReq
     */
	async create(prize, winners, serverReq, roleReq = [], time, guild, host, channel) {
		const startedAt = Date.now();
		const giveawayTime = Date.now() + time;
		const giveawayWinners = winners;
		const giveawayHost = {
			id: host.id,
			name: host.tag
		};
		const giveawayPrize = prize;
		const giveawayChannel = channel.id;

		//${this.client.getEmoji('tick')} React with :tada: to enter the Giveaway!

		let text = `${this.client.getEmoji('dot')} | Hosted by: ${host.toString()}\n${this.client.getEmoji('dot')} | Winner(s): ${winners}\n${this.client.getEmoji('dot')} | Time remaining: {TIME}\n\n**How to Participate?**\n${this.client.getEmoji("announce")} | React with :tada: to participate!\n\n${this.client.getEmoji("giveaway")} | **2X Giveaway Entry if you -**\n[Invite the Bot](https://discord.com/oauth2/authorize?client_id=810145829133221959&permissions=8&scope=bot) or [Upvote the Bot](https://top.gg/bot/810145829133221959/vote)`;

        	if(serverReq || (roleReq || []).length) text += `\n\n**Tasks:**`

        	if (serverReq) {
        	    text += `\n${this.client.getEmoji('link')} | Should be in [${serverReq.guild.name}](https://discord.gg/${serverReq.code})!`;
        	}

        	if (roleReq && roleReq.length) {
        	    text += `\n${this.client.getEmoji('link')} | Must have the role ${roleReq.map(role => `<@&${role.id}>`).join(', ')} to enter the giveaway!`;
        	}
		
		let serverRequirement = null, roleRequirement = null;

		if (serverReq) {
			serverRequirement = {
				id: serverReq.guild.id,
				invite: `https://discord.gg/${serverReq.code}`
			};
		}

		if (roleReq) {
			roleRequirement = roleReq && roleReq.length ? roleReq : [];
		}


		const embed = new MessageEmbed()
			.setTitle(`${this.client.getEmoji('gift')} ${prize}`)
			.setColor(0xcc8822)
			.setDescription(text.replace(/{TIME}/g, this.client.convertMs(giveawayTime - Date.now())))
			.setFooter(`By reacting you agree to be DMED | Ending on`, `https://cdn.discordapp.com/emojis/808686017003257857.gif`)
			.setTimestamp(giveawayTime);

		const msg = await channel.send(embed);

		await msg.react('🎉');

		const newDoc = new Giveaway({
			msgId: msg.id,
			id: guild.id,
			time: giveawayTime,
			serverRequirement,
			roleRequirement: roleRequirement ? roleRequirement.map(role => role.id) : [],
			prize: giveawayPrize,
			winners: giveawayWinners,
			host: giveawayHost,
			channel: giveawayChannel,
			embed: embed.setDescription(text).toJSON(),
			enabled: true,
			guild: msg.guild.id,
			msgLink: msg.url,
			startedAt
		});


		await newDoc.save().catch(err => this.client.logger.err(err));

		return newDoc;
	}

	// eslint-disable-next-line consistent-return
	// eslint-disable-next-line complexity
	async endGiveaway(msgId, guild) {
		if (!msgId) return 'NO_MSG_ID';

		const result = await Giveaway.findOne({ msgId: msgId, guild: guild.id, enabled: true });

		if (!result) return 'NO_GIVEAWAY_FOUND';

		const channel = this.client.channels.cache.get(result.channel);

		if (!channel) {
			await Giveaway.deleteOne(result.toObject()).catch(console.error);
			return 'NO_GIVEAWAY_FOUND';
		}

		const msg = await channel.messages.fetch(result.msgId).catch(() => {
			// .
		});

		if (!msg) {
			await Giveaway.deleteOne(result.toObject()).catch(console.error);
			return 'NO_GIVEAWAY_FOUND';
		}

		const embed = new MessageEmbed(result.embed);

		const reaction = msg.reactions.cache.get('🎉');


		const reqGuild = result.serverRequirement ? this.client.guilds.cache.get(result.serverRequirement.id) : null;

		const members = reqGuild ? await reqGuild.members.fetch() : new Collection();


		const users = await (await fetchReactedUsers(reaction)).filter(user => reqGuild ? members.has(user.id) : true);


		const list = await users.filter(user => user.bot !== true);

		if (!list.length) {
			embed.description = `${this.client.getEmoji('medal')} Winner: No one.`;
			embed.footer.text = ` | Giveaway has been finished!`;

			result.enabled = false;
			await result.save().catch(console.error);
			// await GiveawaySchema.deleteOne({id: giveaway.id, enabled: true, channel: giveaway.channel, msgId: giveaway.msgId})
			// eslint-disable-next-line consistent-return
			await msg.edit(embed);

			return 'SUCCESSFUL_END';
		}

		const winners = [];
		for (let i = 0; i < result.winners; i++) {
			// eslint-disable-next-line id-length
			const x = this.client.draw(list);


			if (!winners.includes(x)) winners.push(x);
		}


		embed.description = `${this.client.getEmoji('medal')} Winner(s): ${winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(', ')}`;
		embed.footer.text = ` | Giveaway has been finished!`;

		/* const { host } = result;
		const hostUser = this.client.users.cache.get(host.id);
		if (hostUser) {
			hostUser.send(new MessageEmbed()
				.setTitle(`${this.client.getEmoji('me')} Giveaway Finished ${this.client.getEmoji('tada')}`)
				.setDescription(`${this.client.getEmoji('medal')} Winner(s): ${winners.map(user => `${user.toString()} - ${user.id} - ${user.tag}`).join('\n') || 'No Winners'}
${this.client.getEmoji('link')} [Link to giveaway](${msg.url})`)).catch(() => {
				// .
			});
		} */

		await msg.edit(embed);
		result.enabled = false;

		await result.save().catch(err => console.log(err));
		if (winners.length) {
			/* for (const user of winners) {
				user.send(new MessageEmbed()
					.setTitle(`${this.client.getEmoji('tada')} You Won A Giveaway!`)
					.setDescription(`${this.client.getEmoji('gift')} Prize: ${result.prize}
${this.client.getEmoji('giveaway')} Hosted by: <@${host.id}>(${host.id}) - ${host.name}\n\n${this.client.getEmoji('link')} [Link to giveaway](${msg.url})`)).catch(() => {
					// .
				});
			}
			*/
			msg.channel.send(winners.map(user => user.toString()).join(', '), new MessageEmbed()
			.setColor('GREEN')
			.setTitle("Congratulations! <a:gift:810392159919538216>")
			.setDescription(`${this.client.getEmoji('tada')} You officialy won the giveaway for **${result.prize}**! Make sure to direct message the host of the giveaway, for your reward.`)
			);
		}

		return 'SUCCESSFUL_END';
	}

	// eslint-disable-next-line complexity
	async rerollGiveaway(msgId, guild) {
		if (!msgId) return 'NO_MSG_ID';

		const result = await Giveaway.findOne({ msgId: msgId, guild: guild.id, enabled: false });

		if (!result) return 'NO_GIVEAWAY_FOUND';

		const channel = this.client.channels.cache.get(result.channel);

		if (!channel) {
			await Giveaway.deleteOne(result.toObject()).catch(console.error);
			return 'NO_GIVEAWAY_FOUND';
		}

		const msg = await channel.messages.fetch(result.msgId).catch(() => {
			// .
		});

		if (!msg) {
			await Giveaway.deleteOne(result.toObject()).catch(console.error);
			return 'NO_GIVEAWAY_FOUND';
		}

		const embed = new MessageEmbed(result.embed);

		const reaction = msg.reactions.cache.get('🎉');


		const reqGuild = result.serverRequirement ? this.client.guilds.cache.get(result.serverRequirement.id) : null;

		const members = reqGuild ? await reqGuild.members.fetch() : new Collection();


		const users = await (await fetchReactedUsers(reaction)).filter(user => reqGuild ? members.has(user.id) : true);


		const list = await users.filter(user => user.bot !== true);

		if (!list.length) {
			embed.description = `${this.client.getEmoji('medal')} Winner: No one.`;
			embed.footer.text = ` | Giveaway has been finished!`;

			result.enabled = false;
			await result.save().catch(console.error);
			// await GiveawaySchema.deleteOne({id: giveaway.id, enabled: true, channel: giveaway.channel, msgId: giveaway.msgId})
			// eslint-disable-next-line consistent-return
			await msg.edit(embed);

			return 'SUCCESSFUL_END';
		}

		const winners = [];
		for (let i = 0; i < result.winners; i++) {
			// eslint-disable-next-line id-length
			const x = this.client.draw(list);


			if (!winners.includes(x)) winners.push(x);
		}


		embed.description = `${this.client.getEmoji('medal')} Winner(s): ${winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(', ')}`;
		embed.footer.text = ` | Giveaway has been finished!`;


		/*
		const { host } = result;
		const hostUser = this.client.users.cache.get(host.id);
		if (hostUser) {
			hostUser.send(new MessageEmbed()
				.setTitle(`${this.client.getEmoji('me')} Giveaway Finished ${this.client.getEmoji('tada')}`)
				.setDescription(`${this.client.getEmoji('medal')} Winner(s): ${winners.map(user => `${user.toString()} - ${user.id} - ${user.tag}`).join('\n') || 'No Winners'}
${this.client.getEmoji('link')} [Link to giveaway](${msg.url})`)).catch(() => {
				// .
			});
		} */

		await msg.edit(embed);
		result.enabled = false;

		await result.save().catch(err => console.log(err));
		if (winners.length) {
			/* for (const user of winners) {
				user.send(new MessageEmbed()
					.setTitle(`${this.client.getEmoji('tada')} You Won A Giveaway!`)
					.setDescription(`${this.client.getEmoji('gift')} Prize: ${result.prize}
${this.client.getEmoji('giveaway')} Hosted by: <@${host.id}>(${host.id}) - ${host.name}\n\n${this.client.getEmoji('link')} [Link to giveaway](${msg.url})`)).catch(() => {
					// .
				});
			}
			*/
			msg.channel.send(winners.map(user => user.toString()).join(', '), new MessageEmbed()
				.setColor('GREEN')
				.setTitle("Congratulations new winner! <a:gift:810392159919538216>")
				.setDescription(`${this.client.getEmoji('medal')} You officialy won the giveaway for **${result.prize}**! Make sure to direct message the host of the giveaway, for your reward.`)
			);
		}
		return 'SUCCESSFUL_END';
	}

};
