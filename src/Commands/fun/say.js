const { MessageEmbed } = require("discord.js");
const { greenlight } = require("../../JSON/colours.json")
const Command = require("../../Structures/Command")

module.exports = {
    config: {
        name: "say",
        category: "fun",
        noalias: [''],
        description: "It will say your input via the bot",
        usage: "[text]",
        accessableby: "everyone"
    },
    run: async(bot, message, args) => {
        try {
            if (args.length === 0)
                return message.channel.send("**Enter some messages!**")
            message.delete({ timeout: 1000 })

            const embed = new MessageEmbed()
                .setDescription(args.join(" "))
                .setColor(greenlight);
            message.channel.send(embed)
        } catch (e) {
            throw e;
        };
    }
};