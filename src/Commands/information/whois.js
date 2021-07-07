const Command = require('../../Structures/Command');
const Discord = require("discord.js")
const moment = require('moment');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'whois',
            category: 'information',
            description: 'Shows information about the user mentioned.'
        });
    }
    async run(message, args) {
        args[0] = message.mentions.users.first();
        let member = message.mentions.members.first() || message.member;
        const { user } = member;
        const time = ((Date.now() - user.createdTimestamp)) / 8.64e+7 <= 14;

        const joinDiscord = moment(user.createdAt).format('llll');
        const joinServer = moment(user.joinedAt).format('llll');

        if (!user) return message.channel.send({ embed: { color: "RED", description: "Awwhh make sure you mentioned someone." } })

        let embed = new Discord.MessageEmbed()
            .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL)
            .setColor(`RED`)
            .setThumbnail(`${user.displayAvatarURL()}`)
            .addField("Created at:", joinDiscord, true)
            .addField('Joined at:', joinServer, true)
            .addField('Current Roles:', member.roles.cache.filter(role => role.id !== message.guild.roles.everyone.id).map(r => `${r}`).join(' | ') || 'None')
            .addField('Status:', user.presence.status)
            .addField("Alt Account?", time ? 'Yes' : 'No')
            .addField(`User ID:`, `${user.id}`)
            .setTimestamp();
        message.channel.send({ embed: embed });
        return;
    }
}