/* eslint-disable max-len */
/* eslint-disable consistent-return */
// eslint-disable-next-line no-unused-vars
const { MessageReaction, User, MessageEmbed } = require('discord.js');
const Event = require('../../Structures/Event');
const GiveawaySchema = require('../../Models/giveaway');

module.exports = class extends Event {

	/**
     *
     * @param {MessageReaction} reaction .
     * @param {User} user .
     */
	async run(reaction, user) {
		const { client } = this;
		let { message } = reaction;

		if (reaction.message.partial) message = await reaction.message.fetch();

		let member = message.guild.members.cache.get(user.id);

		if (!member) member = await message.guild.members.fetch(user.id);
		if (member.id === this.client.user.id) return;

		if (reaction.partial) await reaction.fetch();

		let { channel } = reaction.message;

		if (channel.partial) channel = await channel.fetch();


		if ((reaction.emoji.name === '🎉') || (reaction.emoji.toString() === '🎉') || (reaction.emoji.id === '🎉')) {
			const result = await GiveawaySchema.findOne({ id: message.guild.id, enabled: true, channel: channel.id, msgId: message.id });

			if (result) {
				/* if(result.req[0] == undefined && result.req[1] == undefined) {
                return message.channel.send(embed);
            } */
				if (result.Requirement !== []) {
					let doesNotHave = false;
					const foundRoles = [];

					for (const id of result.roleRequirement) {
						// eslint-disable-next-line max-depth
						if (!member.roles.cache.has(id)) doesNotHave = true;

						const role = message.guild.roles.cache.get(id);

						// eslint-disable-next-line max-depth
						if (role) foundRoles.push(role);
					}


					const embed = new MessageEmbed()
						.setAuthor(`❌ Entry Denied ❌`, user.avatarURL({ format: 'png', dynamic: true }))
						.setFooter(`| Giveaway System`, client.user.avatarURL({ format: 'png', dynamic: true }));
					if (doesNotHave) {
						await reaction.users.remove(user.id);
						embed.setDescription(`You must have the role(s) ${foundRoles.map(role => `**${role.name}**`).join(', ')} in the server in order to enter [this Giveaway](${message.url}).`);
						return user.send(embed).catch();
					}
				}

				if (result.serverRequirement !== null) {
					const embed = new MessageEmbed()
						.setAuthor(`✅ Entry Approved ✅`, user.avatarURL({ format: 'png', dynamic: true }))
						.setFooter(`| Giveaway System`, client.user.avatarURL({ format: 'png', dynamic: true }));
					const guild = client.guilds.cache.get(result.serverRequirement.id);

					if (!guild) {
						// eslint-disable-next-line max-len
						return message.guild.owner.send(`Hey. The giveaway [LINK](${message.url})'s server requirement server is missing. Either I am not in it. Please end the giveaway to not face any issue.`).catch(err => client.logger.error(err));
					}

					if (!guild.members.cache.has(user.id)) {
						embed.setAuthor(`⚠️ Entry Warning ⚠️`)
						embed.setDescription(`The giveaway host suggests you to be in **${guild.name}** in order to win [this Giveaway](${message.url}).`);
						return user.send(embed).catch();
					}
				}
				
				 const embed = new MessageEmbed()
                    .setAuthor(`✅ Entry has been Approved ✅`, user.avatarURL({ format: 'png', dynamic: true }))
                    .setFooter(`| Giveaway System`, client.user.avatarURL({ format: 'png', dynamic: true }))
                    .setDescription(`Your entry to [this Giveaway](${message.url}) has been approved!`);
                user.send(embed).catch(() => {
})
			}
		}
	}

};