const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "say",
            category: "fun",
            description: "Says something via the bot"
        });
    }

    async run(message, args) {
        const ch = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

        const channel = this.client.snipe.get(ch.id);
        if (!channel) return message.channel.send({ embed: { color: "RED", description: `<a:deny:810218259797245963> No message was deleted, try again later!` } });
        const user = this.client.users.cache.get(channel.sender);
        const embed = new MessageEmbed()
            .setDescription(channel.content)
            .setTimestamp(channel.timestamp)
            .setFooter(`Sent At`, this.client.user.avatarURL({ format: 'png', dynamic: true }))
            .setColor('GREEN');

        if (user) {
            embed.setAuthor(user.tag, user.avatarURL({ format: 'png', dynamic: true }));
        } else {
            embed.setAuthor(`Unknown`);
        }

        return message.channel.send(embed);
    }

};