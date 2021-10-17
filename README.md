# Neia Tsundere Bot
Neia Tsundere bot is a bot created specifically for the game [Mass for the Dead](http://overlord-game.com/) and is implemented in the discord community [Overlord Español](https://discord.gg/EzDxu95h5r)

The main idea in this repo is running a discord bot using a firebase function as a host, the function is scheduled each x minutes, what means that the bot never will be offline
0
## Features
- Allow fetch a card with the specs for an specific Overlord character
- Shows a list of the all characterers listed in the bot


## Installation
```bash
git clone https://github.com/jhonnyesquivel/neia-bot.git
npm install
```

### Environment vars
To get the var values you have to explore in your firebase project settings.
```
https://console.firebase.google.com/u/0/project/{your project}/settings/general
```

Create a .env file inside the */functions/* folder
```
DATABASE_URL=
STORAGE_BUCKET=
BOT_TOKEN= <discord bot token>
PREFIX=* <prefix to use the bot in the discord channels>
WHITELIST= <channels id where will be used the bot>
```
### Google Service Account

Create a file serviceAccountKey.json in *function/config/* folder with the specific configuration for your firebase account.
You can download the file directly from your project configuration
```
https://console.firebase.google.com/u/0/project/{your-project}/settings/serviceaccounts/adminsdk
```

```json
{
    "type": "",
    "project_id": "",
    "private_key_id": "",
    "private_key": "",
    "client_email": "",
    "client_id": "",
    "auth_uri": "",
    "token_uri": "",
    "auth_provider_x509_cert_url": "",
    "client_x509_cert_url": ""
}
```

### Run local

```bash
> cd /functions/
> node index.js
```

### Deploy
You can deploy using the default configuration or if yoy need an special configuration, just folow the firebase instructions
https://firebase.google.com/docs/functions/get-started
```node
npm run deploy
```


