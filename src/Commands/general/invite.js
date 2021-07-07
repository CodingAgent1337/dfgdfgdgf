const Command = require('../../Structures/Command');
const Discord = require("discord.js")

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'invite',
            category: 'General',
            description: 'Sends an invite for the bot'
        });
    }
    async run(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor("RED")
            .addField("This is a private bot for Limitless Designs.", "To invite the original bot click **__[here](https://discord.com/oauth2/authorize?client_id=810145829133221959&permissions=8&scope=bot)__**.")
        message.channel.send(embed);
    }
}