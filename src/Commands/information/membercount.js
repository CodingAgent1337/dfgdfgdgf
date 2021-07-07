const Command = require('../../Structures/Command');
const Discord = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'membercount',
            category: 'information',
            description: 'Shows how many members are in the server'
        });
    }
    async run(message, args) {
        const members = await message.guild.members.fetch();

        const online = members.filter(member => member.presence.status === 'online').size
        const offline = members.filter(member => member.presence.status === 'offline').size
        const idle = members.filter(member => member.presence.status === 'idle').size
        const dnd = members.filter(member => member.presence.status === 'dnd').size


        const MemberCount = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("<a:gift:810392159919538216> **__Member Count__**")
            .addField(`**${message.guild}** Includes: `, `<:user:783307524040425473> **${message.guild.memberCount}** members.\n\n[** ${online} **] are online,\n [** ${idle} **] are idle,\n [** ${dnd} **] are Do not Disturb, \n[** ${offline} **] are offline.`)
            .setFooter(`| This action was issued by ${message.author.tag}`)
        message.channel.send(MemberCount);
    }
}