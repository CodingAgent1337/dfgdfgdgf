const Command = require('../../Structures/Command');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "kick",
            category: "Moderation",
            description: "kicks a member with a reason",
            usage: "kick <member> <reason>"
        });
    }
    async run(message, args) {
        if (!message.guild.member(message.author).hasPermission('KICK_MEMBERS')) {
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: " Sorry, you do not have permission to use that command!"
                }
            });
        }

        if (!message.guild.member(this.client.user).hasPermission('KICK_MEMBERS')) {
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: " Sorry, I do not have permission to use that command!"
                }
            });
        }

        if (message.mentions.users.size === 0) {
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: " Sorry, you need to mention a user!"
                }
            });
        }

        let kickMember = message.guild.member(message.mentions.users.first());
        if (!kickMember) {
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: " That user does not exist in the server. Did he already leave?"
                }
            });
        }

        if (!kickMember.id === message.author.id)
            return message.reply({ embed: { color: "RED", description: `You cannot kick yourself. Dummy...` } })

        if (!kickMember.bannable) return message.channel.send({ embed: { color: "RED", description: "I cannot kick this user on the server." } });
        await kickMember.send({ embed: { color: "RED", title: "You have been kicked from a server.", description: `<a:helpercry:810417398695723059> You have been kicked from **${message.guild}** by **${message.author.tag}**.\n\n<a:alarm:811263238251479100> You can join back to **${message.guild}** normally. But be careful not to get banned. <a:PP_tick:810096949545402399>` } });

        kickMember.kick().then(() => {
            return message.channel.send({ embed: { color: "GREEN", description: `<a:tick_Yes:810218354110758933>  I have succesfully kicked the user` } });
        }).catch(() => message.channel.send({ embed: { color: "RED", description: " I cannot kick this user." } }))
    }
};