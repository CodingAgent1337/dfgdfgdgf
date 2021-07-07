const Command = require('../../Structures/Command');
const ms = require('ms');

module.exports = class extends Command {

    constructor(...args) {
            super(...args, {
                name: 'gstart',
                category: 'giveaway',
                cooldown: 30,
                usage: '<time> <winners> <prize> --server [invite] --role [id/rolemention] --channel [#channel/channelid]',
                description: 'Start a giveaway!',
                botPerms: ['EMBED_LINKS', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],
                args: true
            });
        }
        // eslint-disable-next-line complexity
    async run(message, args) {
        if (!args[0] || !ms(args[0])) {
            return message.reply({ embed: { color: "RED", description: "Invalid time provided..." } }).then(msg => {
                msg.delete({ timeout: 10000 })
            });
        }

        const time = ms(args[0]);

        if (isNaN(args[1]) || parseInt(args[1] > 6)) {
            return message.reply({ embed: { color: "RED", description: "Invalid winner provided... Make sure it's not more than 6 winners." } }).then(msg => {
                msg.delete({ timeout: 10000 })
            });
        }

        const winners = parseInt(args[1]);

        if (!args[2]) {
            return message.reply({ embed: { color: "RED", description: "You did not specify the prize." } }).then(msg => {
                msg.delete({ timeout: 10000 })
            });
        }
        const prize = args.slice(2);

        let server = null,
            role = null,
            { channel } = message;

        if (prize.includes('--server')) {
            const indexofServer = prize.indexOf('--server');

            if (indexofServer !== -1) {
                const serverInvite = prize[indexofServer + 1];

                prize.splice(indexofServer, 2);
                try {
                    server = await this.client.fetchInvite(serverInvite);
                } catch (_e) {
                    // .
                }

                if (!serverInvite || !server || !this.client.guilds.cache.has(server.guild.id)) {
                    return message.reply({ embed: { color: "RED", description: "I am not in the server for server requirement..." } }).then(msg => {
                        msg.delete({ timeout: 10000 })
                    });
                }
            } else {
                return message.reply({ embed: { color: "RED", description: "You didn't post a server invite. To skip server requirements do not type `--server`, `--role` or `--channel`" } }).then(msg => {
                    msg.delete({ timeout: 10000 })
                });
            }
        }

        if (prize.includes('--role')) {
            const indexofRole = prize.indexOf('--role');

            if (indexofRole !== -1) {
                const roleIndex = prize[indexofRole + 1];

                prize.splice(indexofRole, 2);

                role = await this.client.resolveRole(roleIndex, message.guild);

                if (!role) {
                    return message.reply({ embed: { color: "RED", description: "You did not send role id or the role doesn't exist. To skip server requirements do not type `--server`, `--role` or `--channel`" } }).then(msg => {
                        msg.delete({ timeout: 10000 })
                    });
                }
            }
        }

        if (prize.includes('--channel')) {
            const indexofChannel = prize.indexOf('--channel');

            if (indexofChannel !== -1) {
                let channelIndex = prize[indexofChannel + 1];

                prize.splice(indexofChannel, 2);

                if (channelIndex.startsWith('<#') && channelIndex.endsWith('>')) {
                    channelIndex = channelIndex.slice(2, -1);


                    channel = this.client.channels.cache.get(channelIndex);
                } else {
                    channel = this.client.channels.cache.get(channelIndex);
                }

                if (!channel) {
                    return message.reply({ embed: { color: "RED", description: "You did not send the channel where i should put the giveaway. To skip server requirements do not type `--server`, `--role` or `--channel`" } }).then(msg => {
                        msg.delete({ timeout: 10000 })
                    });
                }
            }
        }

        const msg = await message.channel.send(`Starting the Giveaway please wait...`);

        return this.client.giveawayManager.create(prize.join(' '),
                winners,
                server,
                role ? [role] : [], time, message.guild, message.author, channel)
            .then(() => msg.edit('Started Giveaway! <a:gift:810392159919538216>')).then(msg => {
                msg.delete({ timeout: 10000 })
            });
    }

};