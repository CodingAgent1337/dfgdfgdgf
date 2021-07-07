const Command = require(`../../Structures/Command`)

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "unban",
            category: "Moderation",
            description: "Unbans a member",
            usage: "unban <id>"
        });
    }
    async run(message, args) {
        if (!args[0]) return message.channel.send({ embed: { color: "RED", description: "You need to provide User ID!" } })

        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return msg.channel.send({ embed: { color: "RED", description: " You do not have permission to unban a member. Please ask staff to give you permissions." } })
        }

        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return msg.channel.send({ embed: { color: "RED", description: " I do not have permission to unban a member. Please set me BAN_MEMBERS Permission." } })
        }

        let userID = args[0]
        message.guild.fetchBans().then(bans => {
            if (bans.size == 0) return
            message.channel.send({ embed: { color: "RED", description: "The user was already unbanned!" } })
            let bUser = bans.find(b => b.user.id == userID)
            if (!bUser) return
            message.channel.send({ embed: { color: "GREEN", description: "<a:tick_Yes:810218354110758933> I have succesfully unbanned the user." } })
            message.guild.members.unban(bUser.user)
        })
    }
}