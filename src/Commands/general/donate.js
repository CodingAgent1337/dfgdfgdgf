const Command = require('../../Structures/Command');
const Discord = require("discord.js")

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'donate',
            category: 'General',
            description: 'Sends a donation link for the bot'
        });
    }
    async run(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor("RED")
            .addField("Do you want to support our work?", "You can donate to us by clicking **__[here](https://patreon.com)__**.")
        message.channel.send(embed);
    }
}
