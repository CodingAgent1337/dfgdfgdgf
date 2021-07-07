const Command = require('../../Structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'greroll',
            category: 'giveaway',
            cooldown: 30,
            usage: '<messageID>',
            description: 'Reroll a giveaway',
            botPerms: ['EMBED_LINKS', 'ADD_REACTIONS', 'MANAGE_MESSAGES']
        });
    }
    async run(message, args) {
        return this.client.giveawayManager.rerollGiveaway(args[0], message.guild).then(resultType => {
            if (resultType === 'NO_MSG_ID') {
                return message.reply({ embed: { color: "RED", description: `Please provide a Message **ID**` } }).then(msg => {
                    msg.delete({ timeout: 10000 })
                });
            }

            if (resultType === 'NO_GIVEAWAY_FOUND') {
                return message.reply({ embed: { color: "RED", description: `No giveaway has been found with the ID \`${args[0]}\`....` } }).then(msg => {
                    msg.delete({ timeout: 10000 })
                });
            }

            if (resultType === 'SUCCESSFUL_END') {
                return message.reply({ embed: { color: "GREEN", description: `<a:gift:810392159919538216> Successfully rerolled the giveaway! \`${args[0]}\`....` } }).then(msg => {
                    msg.delete({ timeout: 10000 })
                });
            }

            return '';
        });
    }

};