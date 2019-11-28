const {
    Client
} = require('discord.js');
const {
    port,
    whitelist,
    discordSecrets
} = require("./config.json");
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const chalk = require('chalk');

function suc() {
    console.log(chalk.green.italic('[SUCCESS]') + " " + chalk.bold(arguments[0]));
};

function info() {
    console.log(chalk.blue.italic('[INFO]') + " " + chalk.bold(arguments[0]));
};

function err() {
    console.log(chalk.red.italic('[ERROR]') + " " + chalk.bold(arguments[0]));
};

global.client = new Client();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


app.use((req, res, next) => {
    const ip = req.ip.split(":").slice(3)[0];

    if ( /* whitelist.includes(ip)*/ true) return next();
    else return res.status(403).render('403');
});

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/channels/:id/send', (req, res) => {
    try {
        if (!req.body.content) {
            err('Send: 400 Bad Request');
            return res.status(400).send({
                success: false,
                message: "Required: content."
            });
        };
        let channel = client.channels.get(`${req.params.id}`);
        let m = channel.send(`${req.body.content}`);
        suc('Send Message: 201 Created');
        return res.status(201).send({
            success: true,
            message: 'The message has been sent.'
        });
    } catch (e) {
        err('Send Message: 500 Internal Server Error');
        err(e);
        return res.status(500).send({
            success: false,
            message: 'The message could not be sent.'
        });
    };
});

app.post('/users/:id/send', (req, res) => {
    try {
        if (!req.body.content) {
            err("DM: 400 Bad Request");
            return res.status(400).send({
                success: false,
                message: 'Required: content.'
            });
        };
        let r = client.users.get(`${req.params.id}`);
        let m = user.send(`${req.body.content}`);
        suc('DM: 201 Created');
        return res.status(201).send({
            success: true,
            message: 'The DM has been sent.'
        });
    } catch (e) {
        err('DM: 500 Internal Server Error');
        err(e);
        return res.status(500).send({
            success: false,
            message: 'The DM could not be sent.'
        });
    }
});

app.get('/guilds', (req, res) => {
    try {
        let guilds = client.guilds;
        suc('Guilds: 200 OK');
        return res.status(200).send({
            success: true,
            message: `I gathered the guilds successfully.`,
            guilds
        });
    } catch (e) {
        err('Guilds: 500 Internal Server Error');
        return res.status(500).send({
            success: true,
            message: 'I could not gather the guilds.'
        });
    }
});

app.get('/channels', (req, res) => {
    try {
        let channels = client.channels;
        suc('Channels: 200 OK');
        return res.status(200).send({
            success: true,
            message: 'I gathered all the channels successfully.',
            channels
        });
    } catch (e) {
        err('Channels: 500 Internal Server Error');
        err(e);
        return res.status(500).send({
            success: false,
            message: 'I could not gather the channels.'
        });
    }
});

app.get('/users', (req, res) => {
    try {
        let users = client.users;
        suc('Users: 200 OK');
        return res.status(200).send({
            success: true,
            message: 'I gathered all the users successfully.',
            users
        });
    } catch (e) {
        err('Users: 500 Internal Server Error');
        err(e);
        return res.status(500).send({
            success: false,
            message: "I could not gather the users."
        });
    }
});

app.get('/emojis', (req, res) => {
    try {
        let emojis = client.emojis;
        suc('Emojis: 200 OK');
        return res.status(200).send({
            success: true,
            message: "I gathered the emojis.",
            emojis
        });
    } catch (e) {
        err("Emojis: 500 Internal Server Error");
        err(e);
        return res.status(500).send({
            success: false,
            message: 'I could not gather the emojis.'
        });
    }
});

app.post('/guilds/:guildid/users/:userid/ban', (req, res) => {
    try {
        let guild = client.guilds.get(`${req.params.guildid}`);
        let member = guild.members.get(`${req.params.userid}`);
        member.ban();
        suc('Ban: 200 OK');
        return res.status(200).send({
            success: true,
            message: 'I banned that member.'
        });
    } catch (e) {
        err('Ban: 500 Internal Server Error');
        err(e);
        return res.status(500).send({
            success: false,
            message: 'I could not ban that member.'
        });
    }
});

app.post('/guilds/:guildid/users/:userid/kick', (req, res) => {
    try {
        let guild = client.guilds.get(`${req.params.guildid}`);
        let member = guild.members.get(`${req.params.userid}`);
        member.kick();
        suc('Kick: 200 OK');
        return res.status(200).send({
            success: true,
            message: 'I kicked that member.'
        });
    } catch (e) {
        err('Kick: 500 Internal Server Error');
        err(e);
        return res.status(500).send({
            success: false,
            message: 'I could not kick that member.'
        });
    }
});

app.get('/users/:id', (req, res) => {
    try {
        let user = client.users.get(`${req.params.id}`);
        suc('User: 200 OK');
        return res.status(200).send({
            success: true,
            message: 'I gathered that user.',
            user
        });
    } catch (e) {
        err('User: 500 Internal Server Error');
        err(e);
        return res.status(500).send({
            success: false,
            message: 'I could not get that user.'
        });
    }
});

app.get(`/channels/:id`, (req, res) => {
    try {
        let channel = client.channels.get(`${req.params.id}`);
        suc('Channel: 200 OK');
        return res.status(200).send({
            success: true,
            message: 'I gathered that channel.',
            channel
        });
    } catch (e) {
        err('Channel: 500 Internal Server Error');
        err(e);
        return res.status(500).send({
            success: false,
            message: 'I could not get that channel.'
        });
    }
});

app.get('/guilds/:id', (req, res) => {
    try {
        let guild = client.guilds.get(`${req.params.id}`);
        suc('Guild: 200 OK');
        return res.status(200).send({
            success: true,
            message: "I gathered that guild.",
            guild
        });
    } catch (e) {
        err('Guild: 500 Internal Server Error');
        err(e);
        return res.status(500).send({
            success: true,
            message: 'I could not gather that guild.'
        });
    }
});

app.get('/emojis/:id', (req, res) => {
    try {
        let emoji = client.emojis.get(`${req.params.id}`);
        suc('Emoji: 200 OK');
        return res.status(200).send({
            success: true,
            message: "I got that emoji.",
            emoji
        });
    } catch (e) {
        err('Emoji: 500 Internal Server Error');
        err(e);
        return res.status(500).send({
            success: false,
            message: 'I could not get that emoji.'
        });
    }
});

app.delete('/channels/:id', (req, res) => {
    try {
        let channel = client.channels.get(`${req.params.id}`);
        channel.delete();
        suc('Channel Delete: 200 OK');
        return res.status(200).send({
            success: true,
            message: 'I deleted the channel.'
        });
    } catch (e) {
        err('Channel Delete: 500 Internal Server Error');
        err(e);
        return res.status(500).send({
            success: false,
            message: 'I could not get that channel.'
        });
    }
});

app.get('*', (req, res) => res.render('404'));

app.listen(port, () => {
    console.log(chalk.bold.underline.green("RESTcord.js") + " by " + chalk.bold("Chiphyr\n"))

    info(`The server is running on port ${port}.\n`);
    info(`Whitelisted IP's:\n${whitelist.join('\n')}\n`);
});

client.login(discordSecrets.botToken).then(() => {
    suc(`Logged into Discord as ${client.user.username}, serving ${client.guilds.size} servers.\n\n`);
});



///////////////////////////////////////////////////

client.on('message', msg => {
    info(` said ${msg.content}`)
    info(JSON.stringify(msg))
    if (msg.content === 'ping') {
        // let reply = "```javascript\nfor (let i=0; i<100; i++){\nconsole.log(i);\n}```"
        let reply = "Batman is really ||Bruce Wayne||"
      msg.reply(reply);
    }
  });