const config = require('../config.json')
const Style = require('../utils/messageStyle')
const Util = require('../utils/utils')

module.exports = async (client, message) => {

    if (message.author.bot) return;
    if (!message.content.startsWith(config.PREFIX)) return
    if (!config.WHITELIST.includes(message.channel.parentId)) return;

    const splitMessage = message.content
        .slice(config.PREFIX.length)
        .trim()
        .split(/ +/)
    let [commandName, args] = [
        splitMessage.shift().toLowerCase(),
        splitMessage.join(' '),
    ]

    if (!client.commands.has(commandName)) return

    const command = client.commands.get(commandName)
    if (args != null && args.length > 0) {
        args = args.split(command.delimiter ? command.delimiter : " ")
    }

    if (Object.prototype.hasOwnProperty.call(command, 'min_args') && command.min_args > args.length) {
        
        let embeddedMessage = Util.embedMessage(
            "",
            message.author,
            '0xffff00',
            Style.bash(
                `El uso correcto del comando es: \n${config.PREFIX}${commandName} ${command.usage}`
            )
        )

        message.channel.send({ content: "¡Eres un tonto, muérete, ¿Que no sabes escribir?!", embeds: [embeddedMessage] })
        return
    }

    try {
        command.execute(message, args)
    } catch (error) {
        console.error(error)
        message.reply('There was an error trying to execute that command!')
    }
}