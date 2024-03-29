const firebase = require("../firebase");
const Util = require('../utils/utils.js')

let memoize = require("memoizee");
let { Bucket } = firebase.firebaseTools;

module.exports = {
  name: 'mass',
  min_args: 1,
  usage: '<unidad> [prop1 prop2 ...propX] ',
  description: 'Busca la informacion de una unidad del juego',
  execute: async (message, args) => {

    console.log("executed");

    let [unitName] = args;
    let { channel } = message
    let founds = [];
    unitName = unitName.toLowerCase();

    if (unitName == "clear" && args.length == 1) {
      memoized.clear();
      return;
    }

    let unit = await memoized(unitName);


    unit.forEach(unitUrl => {
      const urlUnit = urlUnitName(decodeURI(unitUrl).replace(/%2F/g, "/"));
      const nameTokens = urlUnit
        .replace(/\[/g, " ")
        .replace(/\]/g, " ")
        .replace(/\]/g, " ")
        .replace(/-/g, " ")
        .toLowerCase()
        .split(" ")
        .filter(x => x.length > 0);

      const found = arrayContainsArray(nameTokens, [...unitName.split("-"), ...args.slice(1)]);

      if (found) {
        founds.push({
          nameTokens,
          unitName: urlUnit,
          url: unitUrl
        });
      }
    });

    founds.sort((a, b) => {
      return a.nameTokens.length - b.nameTokens.length;
    });

    if (founds.length == 1 || (args.length > 1 && founds.length > 1)) {

      const [unit] = founds;
      const { url, unitName } = unit;

      let embeddedMessage = Util.embedMessage(
        unitName,
        message.author,
        '5d0e1b',
        "",
        url
      );

      channel.send({ content: `Aquí tienes ${message.author.toString()} onichan. ¡No te confundas! no lo hice por ti, es solo que... \n`, embeds: [embeddedMessage] });
    }
    else if (args.length == 1 && founds.length > 1) {
      let unitsFounded = "\`\`\`\n- " + founds.map(x => x.unitName).join("\n- ") + "\`\`\`";
      channel.send({ content: `¡${message.author.toString()} eres desesperante! Te perdono pero solo por esta vez, escoge solo una baaaka :triumph: ` + unitsFounded });
    }
    else {
      channel.send({ content: `No encontré nada, escribe bien baka ${message.author.toString()} onichan :triumph: ` });
    }
  },
}


const fetchUnitsFromBucket = async (unitName) => {
  let pesonajes = [];
  let response = await Bucket.getFiles({ prefix: "PERSONAJES/UNIDADES/" + unitName.split("-").map(x => toPascalCase(x)).join("-") });
  const [units] = response;
  units.forEach((unit) => {
    let downloadToken = unit.metadata.metadata.firebaseStorageDownloadTokens;
    let bucketName = unit.bucket.name;
    let filePath = unit.id;
    let url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${filePath}?alt=media&token=${downloadToken}`;
    pesonajes.push(url);
  });
  return pesonajes;
}

const arrayContainsArray = (a_array, b_array) => {
  let contains = a_array.filter((elem) => {
    return b_array.indexOf(elem) > -1;
  }).length == b_array.length
  return contains;
}

const urlUnitName = (url) => {
  url = url.split("?")
  url = url[0];
  url = url.split("/");
  const page = url[url.length - 1].split(".")[0];
  return page;
}

const toPascalCase = (text) => {
  return text
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w+)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(new RegExp(/\s/, 'g'), '')
    .replace(new RegExp(/\w/), s => s.toUpperCase());
};

memoized = memoize(fetchUnitsFromBucket, { promise: true });