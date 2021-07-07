const Prefix = require('../../Models/Prefix');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            category: 'admin',
            description: 'Set or reset prefix to default',
            usage: '<prefix|reset>',
            args: true
        });
    }

    async run(message, args) {
        if (args[0].toLowerCase() === 'reset') {
            await Prefix.deleteOne({ id: message.guild.id });

            return message.channel.send({ embed: { color: "GREEN", description: `Resetted prefix to default. <a:tick:856952659651199006>` } });
        }

        const prefix = args.join(' ');

        const result = await Prefix.findOne({ id: message.guild.id }) || new Prefix({
            id: message.guild.id
        });

        result.prefix = prefix;

        await result.save().catch(console.error);

        return message.channel.send({ embed: { color: "GREEN", description: `Changed the prefix to **${prefix}**. <a:tick:856952659651199006>` } });
    }

};