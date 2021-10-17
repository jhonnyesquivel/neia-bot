const firebase = require("./firebase");
const config = require("./config");
const { Client, Collection, Intents } = require('discord.js');
const { Functions } = firebase.firebaseTools;
const fs = require("fs")
const path = require('path')



const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})
client.aliases = new Collection()
client.commands = new Collection();

client.categories = fs.readdirSync(path.resolve(__dirname, './commands/'));
['command'].forEach((handler) => {
  require(`./handlers/${handler}`)(client)
})

const files = fs.readdirSync(path.join(__dirname, './events'))
files.forEach((fileName) => {
  if (fileName.endsWith('.js')) {

    const event = require(`./events/${fileName}`)
    const eventName = fileName.split('.')[0] // Get the event name of the file.

    console.log(`Successfully loaded the ${eventName} event.`)
    client.on(eventName, event.bind(null, client))
  }
})

console.log(config.botToken)
client.login(config.botToken)

exports.neiaTsundereBot = Functions.pubsub.schedule('every 5 minutes').onRun((context) => {
  console.log('Wakeup neia');
  return null;
});

