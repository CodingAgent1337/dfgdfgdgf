const Command = require('../../Structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "ban",
            category: "Moderation",
            description: "Bans a member with a reason",
            usage: "ban <member> <reason>"
        });
    }
    async run(message, args) {
        if (!message.guild.member(message.author).hasPermission('BAN_MEMBERS')) {
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: "Sorry, you do not have permission to use that command!"
                }
            });
        }

        if (!message.guild.member(this.client.user).hasPermission('BAN_MEMBERS')) {
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: "Sorry, I do not have permission to use that command!"
                }
            });
        }

        if (message.mentions.users.size === 0) {
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: "Sorry, you need to mention a user!"
                }
            });
        }
        let banMember = message.guild.member(message.mentions.users.first());
        if (!banMember) {
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: "That user does not exist in the server. Did he already leave?"
                }
            });
        }

        if (banMember.id === message.author.id)
            return message.reply({ embed: { color: "RED", description: `You cannot ban yourself. Oh boy...` } })

        if (!banMember.bannable) return message.channel.send({ embed: { color: "RED", description: "I cannot ban this user on the server. Did you check if you're roles are higher than his/hers?" } });
        await banMember.send({ embed: { color: "RED", title: "You have been banned from a server.", description: `<a:helpercry:810417398695723059> You have been banned from **${message.guild}** by **${message.author.tag}**.\n\n<a:alarm:811263238251479100> **You cannot join back to __${message.guild}__, unless a staff member unbans you.**` } });

        banMember.ban().then(() => {
            return message.channel.send({ embed: { color: "GREEN", description: `<a:tick_Yes:810218354110758933>  I have successfully banned the user` } });
        }).catch(() => message.channel.send({ embed: { color: "RED", description: "I cannot ban this user." } }))
    }
};