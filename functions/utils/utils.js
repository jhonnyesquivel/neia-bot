const Discord = require('discord.js')

const Utils = {
    embedMessage(title, author, color, description, image) {
        return new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setImage(image)
            .setDescription(description)
            .setFooter(author.username, author.displayAvatarURL())
            .setTimestamp()
    },
}

module.exports = Utils