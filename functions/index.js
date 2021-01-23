const firebase = require("./firebase");
const whitelist = require("./whitelist.json");
const { Client, MessageEmbed } = require('discord.js');
const config = require("./config.json");
let memoize = require("memoizee");
global.XMLHttpRequest = require("xhr2");
let { Storage, Functions } = firebase.firebaseTools;

const runBot = () => {

  const client = new Client();
  const prefix = "*";

  client.login(config.BOT_TOKEN);

  client.once("ready", () => {
    console.log("Bot is up... ");
  });

  client.on("message", function (message) {
    console.log("Message from Bot " + message);
    console.log("channel", message.channel.parentID)
    if(!whitelist.includes(message.channel.parentID)) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.replace(/\[/gi, "").replace(/\]/gi, "").toLowerCase().split(" ");
    const command = args.shift().toLowerCase();

    if (command === "mass" && args.length > 0) {
      console.log("parametros buscados: " + args);
      let founds = [];

      memoized(args[0])
        .then((personajesjp) => {

          personajesjp.forEach(unitUrl => {
            const unitName = urlUnitName(decodeURI(unitUrl).replace(/%2F/g, "/"));
            const nameTokens = unitName
              .replace(/\[/g, " ")
              .replace(/\]/g, " ")
              .replace(/  /g, " ")
              .toLowerCase()
              .split(" ");

            console.log(nameTokens);

            const found = arrayContainsArray(nameTokens, args);
            if (found) {
              founds.push({
                nameTokens,
                unitName,
                url: unitUrl
              });
            }
          });

          founds.sort(function(a, b){            
            return b.length - a.length;
          });

          if (founds.length == 1 || (args.length > 1 && founds.length > 1)) {

            const Discord = require('discord.js');
            // inside a command, event listener, etc.
            const exampleEmbed = new Discord.MessageEmbed()
              .setColor('#5d0e1b')
              .setImage(founds[0].url)
            message.channel.send(`Aquí tienes ${message.author.toString()} onichan \n`, exampleEmbed);

            //message.channel.send(`Aquí tienes ${message.author.toString()} onichan \n ${founds[0]}`);
          }
          else if (args.length == 1 && founds.length > 1) {
            let unitsFounded = "\`\`\`\n- " + founds.map(x => x.unitName).join("\n- ") + "\`\`\`";
            message.channel.send(`¡${message.author.toString()} eres desesperante! Te perdono pero solo por esta vez, escoge solo una baaaka :triumph: ` + unitsFounded);
          }
          else {
            message.channel.send(`No encontré nada, escribe bien baka ${message.author.toString()} onichan :triumph: `);
          }
        })
        .catch(error => console.error(error));
    }
  });
}

runBot();

const fetchUnits = async (unitName) => {
  var pesonajes = [];
  let storageRefGL = Storage.ref("PERSONAJES/UNIDADES/" + unitName.toPascalCase());
  var res = await storageRefGL.listAll();
  for (const itemRef of res.items) {
    var url = await itemRef.getDownloadURL();
    pesonajes.push(url);
  }
  return pesonajes;
}
memoized = memoize(fetchUnits, { promise: true });


const arrayContainsArray = (a_array, b_array) => {

  let contains = a_array.filter((elem) => {
    return b_array.indexOf(elem) > -1;
  }).length == b_array.length
  return contains;
}

const urlUnitName = (url) => {
  url = url.split("?")
  url = url[0];
  // Get the last path:
  url = url.split("/");
  const page = url[url.length - 1].split(".")[0];
  return page;
}



String.prototype.toPascalCase = function () {
  return this
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w+)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(new RegExp(/\s/, 'g'), '')
    .replace(new RegExp(/\w/), s => s.toUpperCase());
};

exports.scheduledFunction = Functions.pubsub.schedule('every 5 minutes').onRun((context) => {
  console.log('Wakeup neia');
  return null;
});