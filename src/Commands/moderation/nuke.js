const Command = require("../../Structures/Command")
const Discord = require("discord.js")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "nuke",
            category: "Moderation",
            description: "nukes a channel"
        });
    }
    async run(message, args) {
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.channel.send({ embed: { color: "RED", description: "You do not have the right permission to use that command." } })
        }

        const position = message.channel.position;

        await message.channel.clone().then(async channel => {
            channel.setPosition(position)
            const nukeEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Channel Nuked <a:Nuke:810404780769673267>')
                .setDescription(`This channel has been nuked by ${message.author.tag}`)
                .setImage('https://media2.giphy.com/media/oe33xf3B50fsc/giphy.gif')
                .setTimestamp()

            await channel.send(nukeEmbed);

        })
        message.channel.delete()
    }
};