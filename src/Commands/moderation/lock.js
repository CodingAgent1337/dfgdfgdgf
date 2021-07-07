const Command = require("../../Structures/Command")
const ms = require("ms")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "lockdown",
            description: "Locks the channel for only `@/everyone`.",
            category: "Moderation"
        })
    }
    async run(message, args, client) {
        if (!message.member.hasPermission('ADMINISTRATOR')) return;

        if (!message.channel.lockit) message.channel.lockit = [];
        const time = args.join(' ');
        const validUnlocks = ['release'];
        if (!time) return message.reply({ embed: { color: "RED", description: 'Sorry, but you must specify a duration for the channel lockdown.' } });
        if (validUnlocks.includes(time)) {
            message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: null }).then(() => {
                message.channel.send({ embed: { color: "GREEN", description: '<a:tick_Yes:810218354110758933> Lockdown on this channel has been succesfully lifted.' } })
                clearTimeout(message.channel.lockit[message.channel.id]);
                delete message.channel.lockit[message.channel.id];
            }).catch(error => {
                console.log(error);
            });

        } else {

            if (ms(time) >= 2147483647) return message.reply({ embed: { color: "RED", description: 'Sorry, specified duration is too long.' } });
            message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false }).then(() => {
                message.channel.send({ embed: { color: "GREEN", description: `<a:tick_Yes:810218354110758933> Channel has been locked down for ${ms(ms(time), { long:true })}. To lift the channel lockdown I suggest running **!lockdown ${validUnlocks[Math.floor(Math.random() * validUnlocks.length)]}**` } }).then(() => {

                    message.channel.lockit[message.channel.id] = setTimeout(() => {
                        message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: null }).then(message.channel.send({ embed: { color: "GREEN", description: 'Lockdown on this channel has been lifted.' } })).catch(console.error);
                        delete message.channel.lockit[message.channel.id];
                    }, ms(time));

                }).catch(error => {
                    console.log(error);
                });
            });
        }
    }
}