const Command = require("../../Structures/Command")
const Discord = require("discord.js")


//STATUSES
/////

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "serverinfo",
      description: "Shows information about the server",
      category: "information"
    })
  }

  async run(message, args) {
const members = await message.guild.members.fetch();

const online = members.filter(member => member.presence.status === 'online').size
const offline = members.filter(member => member.presence.status === 'offline').size
const idle = members.filter(member => member.presence.status === 'idle').size
const dnd = members.filter(member => member.presence.status === 'dnd').size
      const serverinformation = new Discord.MessageEmbed()
        .setColor("RED")

        .setTitle("<a:gift:810392159919538216> Server Information")

        .setThumbnail(message.guild.bannerURL)
	
        .addField("<:user:783307524040425473> **Member Count:**", `**${message.guild}** has **${message.guild.memberCount}** members.\n\n[** ${online} **] are on online,\n [** ${idle} **] are on idle,\n [** ${dnd} **] are on Do not Disturb, \n[** ${offline} **] are offline.`)

        .addField("<a:emoji_1:810842323453476864> **Emoji Count:**", `**${message.guild}** has **${message.guild.emojis.cache.size}** emojis.`)

        .addField("<:bypass_role:783635332947247145> **Roles Count:**", `**${message.guild}** has **${message.guild.roles.cache.size}** roles.`)

        .addField("<a:Crown:810843309265125406> **User with Ownership:**", `**${message.guild}** is under control of [ ${message.guild.owner} ]`)

	.addField(`${this.client.getEmoji("announce")} Server ID:`, `**${message.guild.id}**`)

      message.channel.send(serverinformation);
  }
}
