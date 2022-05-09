const { Client, Intents } = require("discord.js");
const { prefix, token } = require("./config.json");
const Discord = require("discord.js");
const fs = require("fs");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./handlers").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./handlers/${file}`);
    client.commands.set(command.name, command);
}

client.once("ready", () => {
    console.log("Ready!");
});

client.once("reconnecting", () => {
    console.log("Reconnecting!");
});

client.once("disconnect", () => {
    console.log("Disconnect!");
});
client.on('uncaughtException', function (err) {
    console.log(err);
})
client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    //Music related commands
    if (command === "play") {
        client.commands.get('musicHandler').execute(message, args);
    } else if (command === "skip") {
        client.commands.get('musicHandler').skip();
    } else if (command === "pause") {
        client.commands.get('musicHandler').pause();
    } else if (command === "resume") {
        client.commands.get('musicHandler').resume();
    } else if (command === "leave") {
        client.commands.get('musicHandler').leave(message);
    }
});

client.login(token);