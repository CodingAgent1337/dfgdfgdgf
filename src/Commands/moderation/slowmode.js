const Command = require("../../Structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "slowmode",
            category: "Moderation",
            userPermissions: ['ADMINISTRATOR'],
            argsType: 'multiple',
            description: "Set or change the slowmode duration (between 0s and 6h). Members will be restricted to sending one message per this interval, unless they have Manage Channel or Manage Messages permissions."
        })
    }
    async run(message, args) {
        const { channel } = message

        if (args.length < 2) {
          message.channel.send({embed: { color: "RED", description: 'Please provide a duration and a reason'}})
          return
        }
    
        let duration = args.shift().toLowerCase()
        if (duration === 'off') {
          duration = 0
        }
    
        if (isNaN(duration)) {
          message.channel.send({embed: { color: "RED", description: 'Please provide either a number of seconds or the word "off"'}})
          return
        }
    
        channel.setRateLimitPerUser(duration, args.join(' '))
        message.channel.send({embed: { color: "GREEN", description: `The slowmode for this channel has been set to ${duration}`}})
    }
}
