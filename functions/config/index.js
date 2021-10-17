const serviceAccount = require("./serviceAccountKey.json");
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    databaseURL: process.env.DATABASE_URL,
    storageBucket: process.env.STORAGE_BUCKET,
    botToken: process.env.BOT_TOKEN,
    prefix: process.env.PREFIX,
    whitelist: process.env.WHITELIST.split(" "),
    serviceAccount: serviceAccount,
};