const Command = require('../../Structures/Command');
const Discord = require("discord.js")

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'support',
            category: 'General',
            description: 'Sends support server for the bot'
        });
    }
    async run(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor("RED")
            .addField("Do you need help?", "We are active 24/7... Join our Discord Server by clicking **__[here](https://discord.gg/AkameDiscord)__**.")
        message.channel.send(embed);
    }
}