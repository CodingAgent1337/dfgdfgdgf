/* eslint-disable no-shadow */
/* eslint-disable id-length */
const { MessageEmbed, Collection } = require('discord.js');
const Giveaway = require('../Models/giveaway');
const Event = require('../Structures/Event');

async function fetchReactedUsers(reaction, after) {
	const opts = { limit: 100, after };
	const reactions = await reaction.users.fetch(opts);
	if (!reactions.size) return [];


	const last = reactions.last().id;
	const next = await fetchReactedUsers(reaction, last);
	return reactions.array().concat(next);
}

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	run() {
		console.log([
			`Logged in as ${this.client.user.tag}`,
			`Loaded ${this.client.commands.size} commands!`,
			`Loaded ${this.client.events.size} events!`
		].join('\n'));

		const activities = [
			`VERIFIED!! `,
			`${this.client.guilds.cache.size} servers!`,
			`${this.client.channels.cache.size} channels!`,
			`${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users!`
		];

		let i = 0;
		setInterval(() => this.client.user.setActivity(`${this.client.prefix}help | ${activities[i++ % activities.length]}`, { type: 'LISTENING' }), 15000);

		setInterval(() => {
			(async () => {
				const giveaways = await Giveaway.find({ enabled: true });


				// eslint-disable-next-line complexity
				giveaways.forEach(async result => {
					const embed = new MessageEmbed(result.embed);
					const channel = this.client.channels.cache.get(result.channel);
					if (!channel) {
						await Giveaway.deleteOne({ id: result.id, enabled: true, channel: result.channel, msgId: result.msgId });
						return;
					}
					const msg = await channel.messages.fetch(result.msgId).catch(() => {
						// .
					});
					if (!msg) {
						await Giveaway.deleteOne({ id: result.id, enabled: true, channel: result.channel, msgId: result.msgId });
						return;
					}

					if (Date.now() > result.time) {
						const reaction = msg.reactions.cache.get('🎉');


						const reqGuild = result.serverRequirement ? this.client.guilds.cache.get(result.serverRequirement.id) : null;

						const members = reqGuild ? await reqGuild.members.fetch() : new Collection();


						const users = await (await fetchReactedUsers(reaction)).filter(user => reqGuild ? members.has(user.id) : true);


						const list = await users.filter(user => user.bot !== true);

						if (!list.length) {
							embed.description = `${this.client.getEmoji('medal')} Winner: No one.`;
							embed.footer.text = ` | Giveaway Finished`;

							result.enabled = false;
							await result.save().catch(console.error);
							// await GiveawaySchema.deleteOne({id: giveaway.id, enabled: true, channel: giveaway.channel, msgId: giveaway.msgId})
							// eslint-disable-next-line consistent-return
							return msg.edit(embed);
						}

						const winners = [];
						for (let i = 0; i < result.winners; i++) {
							const x = this.client.draw(list);


							if (!winners.includes(x)) winners.push(x);
						}


						embed.description = `${this.client.getEmoji('medal')} Winner(s): ${winners.filter(u => u !== undefined && u !== null).map(u => u.toString()).join(', ')}`;
						embed.footer.text = ` | Giveaway Finished`;


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
						}
						*/

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
								.setDescription(`${this.client.getEmoji('tada')} Congratulations! You won the giveaway for **${result.prize}**! ${this.client.getEmoji('tada')}`)
							);
						}
					} else {
						const time = result.time - Date.now();
						await this.client.delay(3000);


						await msg.edit(embed
							.setDescription(embed.description
								.replace(/{TIME}/g, time > 0 ? this.client.convertMs(time) : `**0** seconds`)
							));
					}
				});
			})();
		}, 35000);
	}

};
