/* eslint-disable consistent-return */
/* eslint-disable prefer-const */
/* eslint-disable valid-jsdoc */
const { Client, Collection, Permissions } = require('discord.js');
const Util = require('./Util.js');
const GiveawayManager = require('./GiveawayManager');

module.exports = class Ghost extends Client {

    constructor(options = {}) {
        super({
            disableMentions: 'everyone',
            partials: ['REACTION', 'MESSAGE', 'CHANNEL']
        });
        this.validate(options);

        this.commands = new Collection();

        this.aliases = new Collection();

        this.events = new Collection();

        this.snipe = new Collection();

        this.giveawayManager = new GiveawayManager(this);

        this.utils = new Util(this);

        this.owners = options.owners;
    }

    validate(options) {
        if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

        if (!options.token) throw new Error('You must pass the token for the client.');
        this.token = options.token;

        if (!options.prefix) throw new Error('You must pass a prefix for the client.');
        if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
        this.prefix = options.prefix;

        if (!options.defaultPerms) throw new Error('You must pass default perm(s) for the Client.');
        this.defaultPerms = new Permissions(options.defaultPerms).freeze();
    }

    async start(token = this.token) {
        this.utils.loadCommands();
        this.utils.loadEvents();

        await super.login(token);
    }

    /**
     *
     * @param {array} Array The array to shuffle;
     * @returns Shuffled Array
     */
    shuffle(arr) {
            for (let i = arr.length; i; i--) {
                const j = Math.floor(Math.random() * i);
                [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
            }
            return arr;
        }
        /**
         *
         * @param {array} Array The Array to choose one random from;
         * @returns random chosen one;
         */
    draw(list) {
        const shuffled = this.shuffle(list);
        return shuffled[Math.floor(Math.random() * shuffled.length)];
    }

    /**
     * Parse ms and returns a string
     * @param {number} milliseconds The amount of milliseconds
     * @returns The parsed milliseconds
     */

    convertMs(milliseconds) {
        const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
        let days = roundTowardsZero(milliseconds / 86400000),
            hours = roundTowardsZero(milliseconds / 3600000) % 24,
            minutes = roundTowardsZero(milliseconds / 60000) % 60,
            seconds = roundTowardsZero(milliseconds / 1000) % 60;
        if (seconds === 0) {
            seconds++;
        }
        const isDays = days > 0,
            isHours = hours > 0,
            isMinutes = minutes > 0;
        const pattern =
            `${(!isDays ? '' : isMinutes || isHours ? '**{days}** days, ' : '**{days}** days and ') +
		(!isHours ? '' : isMinutes ? '**{hours}** hours, ' : '**{hours}** hours and ') +
		(!isMinutes ? '' : '**{minutes}** minutes and ')
		}**{seconds}** seconds`;
        const sentence = pattern
            .replace('{duration}', pattern)
            .replace('{days}', days)
            .replace('{hours}', hours)
            .replace('{minutes}', minutes)
            .replace('{seconds}', seconds);
        return sentence;
    }

    getEmoji(rawName = '') {
        let name = (rawName || '').toLowerCase();

        if (name === 'gift') return '<a:tada_animated:840631173930811422>';
        if (name === "announce") return "<a:YOOO:850372351236374528>"
        if (name === 'clock') return '🕐';
        if (name === 'medal') return '<a:WhiteCrown:841735391446695967> ';
        if (name === 'link') return '<:Link:841332740769972265>';
        if (name === 'giveaway') return '<a:giveaway:848900892073394206>';
        if (name === 'dot') return '<:purpledot:848192247370350623>';

        return '';
    }

    delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    /**
     *
     * @param {string} search
     * @param {import('discord.js').Guild} guild
     */
    async resolveRole(search, guild) {
        let role = null;
        if (!search || typeof search !== 'string') return;
        // Try ID search
        if (search.match(/^<@&!?(\d+)>$/)) {
            const id = search.match(/^<@&!?(\d+)>$/)[1];
            role = guild.roles.cache.get(id);
            if (role) return role;
        }
        // Try name search
        // eslint-disable-next-line id-length
        role = guild.roles.cache.find((r) => search === r.name);
        if (role) return role;
        role = guild.roles.cache.get(search);
        return role;
    }

};