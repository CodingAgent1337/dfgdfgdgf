const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "purge",
            description: "Purges messages",
            usage: "purge <number 1-100>",
            category: "Moderation"
        });
    }
    async run(message, args) {
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
            return message.channel.send({ embed: { color: "RED", description: "You cannot use this command, because you're missing `MANAGE_MESSAGES` permission" } });
        if (!isNaN(message.content.split(' ')[1])) {
            let amount = 0;
            if (message.content.split(' ')[1] === '1' || message.content.split(' ')[1] === '0') {
                amount = 1;
            } else {
                amount = message.content.split(' ')[1];
                if (amount > 100) {
                    amount = 100;
                }
            }

            const messagesToDelete = await message.channel.messages.fetch({ before: message.id, limit: amount });

            await message.channel.bulkDelete(messagesToDelete, true).then((_message) => {
                message.channel.send({ embed: { color: "GREEN", description: `I have purged \`${_message.size}\` messages.` } }).then((sent) => {
                    setTimeout(function() {
                        sent.delete();
                    }, 38500);
                });
            });
        }
    }
}