const { MessageEmbed } = require('discord.js');
const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "setnickname",
            description: "Sets a nickname",
            usage: "setnickname @CodingAgent#9999 nickname",
            category: "Moderation"
        });
    }
    async run(bot, message, args) {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send({ embed: { color: "RED", description: "**You dont have `MANAGE_GUILD` permission to change nickname!" } });

        if (!message.guild.me.hasPermission("CHANGE_NICKNAME")) return message.channel.send({ embed: { color: "RED", description: "**I dont have `CHANGE_NICKNAME` Permission to change nickname!**" } });

        if (!args[0]) return message.channel.send({ embed: { color: "RED", description: "**Please send a member!**" } })

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase()) || message.member;
        if (!member) return message.channel.send({ embed: { color: "RED", description: "**Please send a username!**" } });

        if (member.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send('**Cannot Set or Change Nickname Of This User!**')

        if (!args[1]) return message.channel.send({ embed: { color: "RED", description: "**Please enter the nickname.**" } });

        let nick = args.slice(1).join(' ');

        try {
            member.setNickname(nick)
            const embed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`**Changed nickname from ${member.displayName} to ${nick}**.`)
                .setAuthor(message.guild.name, message.guild.iconURL())
            message.channel.send(embed)
        } catch {
            return message.channel.send({ embed: { color: "RED", description: "**Missing `CHANGE_NICKNAME` permission." } })
        }
    }
}
