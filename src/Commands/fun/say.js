const { MessageEmbed } = require("discord.js");
const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "say",
            category: "fun",
            noalias: [''],
            description: "It will say your input via the bot",
            usage: "[text]",
            accessableby: "everyone"
    });
}
    async run(bot, message, args) {
        try {
            if (args.length === 0)
                return message.channel.send("**Enter some messages!**")
            message.delete({ timeout: 1000 })

            const embed = new MessageEmbed()
                .setDescription(args.join(" "))
                .setColor("RANDOM");
            message.channel.send(embed)
        } catch (e) {
            throw e;
        };
    }
};
