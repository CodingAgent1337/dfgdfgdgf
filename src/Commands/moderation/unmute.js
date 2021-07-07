const Command = require("../../Structures/Command")
const Discord = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "unmute",
            category: "Moderation",
            description: "Unmutes a mentioned person"
        });
    }

    async run(message, args) {
            let user = message.mentions.users.first();
            let role = message.guild.roles.find(r => r.name === 'Muted');
            if(!user.roles.has(role)) {

            let ifHasRole = message.member.roles.cache.find(role => role.name === 'Muted');
            if(!ifHasRole){
            return message.channel.send({ embed: { color: "RED", description: `${user} is not muted.`}});
            }

            user.removeRole(role).then(message.channel.send({ embed: { author: "ACTION: UNMUTE", color: "RED", description: `${user} is unmuted.`}}));
        
        
    }
}
}
