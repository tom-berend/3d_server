// server.ts
// this RUNS the server, but it is set up in 'app.ts'


import app from "./app"
import { Request, Response } from 'express'
import chalk from 'chalk'
import * as config from '../src/config.json'


// set up the discord client
import { Client, DMChannel, Message, Channel, TextChannel } from 'discord.js'
let client = new Client()


// console helpers
function suc(msg: string) { console.log(chalk.green.italic('[SUCCESS]') + " " + chalk.bold(msg)) }
function info(msg: string) { console.log(chalk.blue.italic('[INFO]') + " " + chalk.bold(msg)) }
function err(msg: string) { console.log(chalk.red.italic('[ERROR]') + " " + chalk.bold(msg)) }

import { StudentsDB } from "./database"
let appDao = new StudentsDB()



app.get('/', (req: Request, res: Response) => {
    res.render('home')
})


// app.post('/channels/:id/send', (req: Request, res: Response) => {
//     try {
//         if (!req.body.content) {
//             err('Send: 400 Bad Request')
//             return res.status(400).send({
//                 success: false,
//                 message: "Required: content.",
//             })
//         }
//         let channel = client.channels.get(`${req.params.id}`)
//         let m = channel.send(`${req.body.content}`)
//         suc('Send Message: 201 Created')
//         return res.status(201).send({
//             success: true,
//             message: 'The message has been sent.',
//         })
//     } catch (e) {
//         err('Send Message: 500 Internal Server Error')
//         err(e)
//         return res.status(500).send({
//             success: false,
//             message: 'The message could not be sent.',
//         })
//     }
// })

// app.post('/users/:id/send', (req: Request, res: Response) => {
//     try {
//         if (!req.body.content) {
//             err("DM: 400 Bad Request")
//             return res.status(400).send({
//                 success: false,
//                 message: 'Required: content.',
//             })
//         }
//         let r = client.users.get(`${req.params.id}`)
//         let m = user.send(`${req.body.content}`)
//         suc('DM: 201 Created')
//         return res.status(201).send({
//             success: true,
//             message: 'The DM has been sent.',
//         })
//     } catch (e) {
//         err('DM: 500 Internal Server Error')
//         err(e)
//         return res.status(500).send({
//             success: false,
//             message: 'The DM could not be sent.',
//         })
//     }
// })

// app.get('/guilds', (req: Request, res: Response) => {
//     try {
//         let guilds = client.guilds
//         suc('Guilds: 200 OK')
//         return res.status(200).send({
//             success: true,
//             message: `I gathered the guilds successfully.`,
//             guilds,
//         })
//     } catch (e) {
//         err('Guilds: 500 Internal Server Error')
//         return res.status(500).send({
//             success: true,
//             message: 'I could not gather the guilds.',
//         })
//     }
// })

// app.get('/channels', (req: Request, res: Response) => {
//     try {
//         let channels = client.channels
//         suc('Channels: 200 OK')
//         return res.status(200).send({
//             success: true,
//             message: 'I gathered all the channels successfully.',
//             channels,
//         })
//     } catch (e) {
//         err('Channels: 500 Internal Server Error')
//         err(e)
//         return res.status(500).send({
//             success: false,
//             message: 'I could not gather the channels.',
//         })
//     }
// })


// app.get('/emojis', (req: Request, res: Response) => {
//     try {
//         let emojis = client.emojis
//         suc('Emojis: 200 OK')
//         return res.status(200).send({
//             success: true,
//             message: "I gathered the emojis.",
//             emojis,
//         })
//     } catch (e) {
//         err("Emojis: 500 Internal Server Error")
//         err(e)
//         return res.status(500).send({
//             success: false,
//             message: 'I could not gather the emojis.',
//         })
//     }
// })

// app.post('/guilds/:guildid/users/:userid/ban', (req: Request, res: Response) => {
//     try {
//         let guild = client.guilds.get(`${req.params.guildid}`)
//         let member = guild.members.get(`${req.params.userid}`)
//         member.ban()
//         suc('Ban: 200 OK')
//         return res.status(200).send({
//             success: true,
//             message: 'I banned that member.',
//         })
//     } catch (e) {
//         err('Ban: 500 Internal Server Error')
//         err(e)
//         return res.status(500).send({
//             success: false,
//             message: 'I could not ban that member.',
//         })
//     }
// })

// app.post('/guilds/:guildid/users/:userid/kick', (req: Request, res: Response) => {
//     try {
//         let guild = client.guilds.get(`${req.params.guildid}`)
//         let member = guild.members.get(`${req.params.userid}`)
//         member.kick()
//         suc('Kick: 200 OK')
//         return res.status(200).send({
//             success: true,
//             message: 'I kicked that member.',
//         })
//     } catch (e) {
//         err('Kick: 500 Internal Server Error')
//         err(e)
//         return res.status(500).send({
//             success: false,
//             message: 'I could not kick that member.',
//         })
//     }
// })

// app.get('/users/:id', (req: Request, res: Response) => {
//     try {
//         let user = client.users.get(`${req.params.id}`)
//         suc('User: 200 OK')
//         return res.status(200).send({
//             success: true,
//             message: 'I gathered that user.',
//             user,
//         })
//     } catch (e) {
//         err('User: 500 Internal Server Error')
//         err(e)
//         return res.status(500).send({
//             success: false,
//             message: 'I could not get that user.',
//         })
//     }
// })


// app.get('/emojis/:id', (req: Request, res: Response) => {
//     try {
//         let emoji = client.emojis.get(`${req.params.id}`)
//         suc('Emoji: 200 OK')
//         return res.status(200).send({
//             success: true,
//             message: "I got that emoji.",
//             emoji,
//         })
//     } catch (e) {
//         err('Emoji: 500 Internal Server Error')
//         err(e)
//         return res.status(500).send({
//             success: false,
//             message: 'I could not get that emoji.',
//         })
//     }
// })

// app.delete('/channels/:id', (req: Request, res: Response) => {
//     try {
//         let channel = client.channels.get(`${req.params.id}`)
//         channel.delete()
//         suc('Channel Delete: 200 OK')
//         return res.status(200).send({
//             success: true,
//             message: 'I deleted the channel.',
//         })
//     } catch (e) {
//         err('Channel Delete: 500 Internal Server Error')
//         err(e)
//         return res.status(500).send({
//             success: false,
//             message: 'I could not get that channel.',
//         })
//     }
// })


app.get('/guilds/:id', (req: Request, res: Response) => {
    try {
        let guild = client.guilds.get(`${req.params.id}`)
        suc('Guild: 200 OK')
        return res.status(200).send({
            success: true,
            message: "I gathered that guild.",
            guild,
        })
    } catch (e) {
        err('Guild: 500 Internal Server Error')
        err(e)
        return res.status(500).send({
            success: true,
            message: 'I could not gather that guild.',
        })
    }
})


app.get(`/channels/:id`, (req: Request, res: Response) => {
    try {
        let channel = client.channels.get(`${req.params.id}`)
        suc('Channel: 200 OK')
        return res.status(200).send({
            success: true,
            message: 'I gathered that channel.',
            channel,
        })
    } catch (e) {
        err('Channel: 500 Internal Server Error')
        err(e)
        return res.status(500).send({
            success: false,
            message: 'I could not get that channel.',
        })
    }
})


app.get('/users', (req: Request, res: Response) => {
    try {
        let users = client.users
        console.log('users', users)
        suc('Users: 200 OK')
        return res.status(200).send({
            success: true,
            message: 'I gathered all the users successfully.',
            users,
        })
    } catch (e) {
        err('Users: 500 Internal Server Error')
        err(e)
        return res.status(500).send({
            success: false,
            message: "I could not gather the users.",
        })
    }
})

app.get('/guilds', (req: Request, res: Response) => {
    try {
        let guilds = client.guilds
        console.log('guilds', guilds)
        suc('Guilds: 200 OK')
        return res.status(200).send({
            success: true,
            message: 'I gathered all the guilds successfully.',
            guilds,
        })
    } catch (e) {
        err('Users: 500 Internal Server Error')
        err(e)
        return res.status(500).send({
            success: false,
            message: "I could not gather the guilds.",
        })
    }
})


app.get('/sendMsg', (req: Request, res: Response) => {
    //     let commReading = client.guilds.get(config.discordSecrets.CommReadingChannel)
    //     // let tomChannel = client.channels.get(config.discordSecrets.TomID) // Replace with known channel ID
    //     let tomChannel = commReading.channels.get(config.discordSecrets.TomToBotChannel) //.send('hey!')
    //     client.guilds

    // Get the log channel

    info('about to get the guild')
    const guild = client.guilds.get(config.discordSecrets.CommReadingGuild)
    suc('guild is ' + JSON.stringify(guild))
    if (guild === undefined) {
        return res.status(500).send({
            success: false,
            message: "I could not gather the guilds.",
        })
    }

    // info('about to get the channels')
    // const channels = guild.channels.get(config.discordSecrets.CommReadingGuild)
    // suc('channels are ' + JSON.stringify(channels))



    // info('about to get the member')
    // const member = guild.members.get(config.discordSecrets.TomID)
    // suc('member is ' + JSON.stringify(member))

    // const logChannel = member.guild.channels.find(channel => channel.id == 123456);

    info('about to get the channel')
    // let channel = client.channels.find((chan) => chan.id === config.discordSecrets.CommReadingGuildGeneral)
    let channel = client.channels.find((chan) => chan.id === config.discordSecrets.TomToBotChannel)

    suc('channel is ' + JSON.stringify(channel))

    if (!channel) {
        return res.status(500).send({
            success: false,
            message: "I could not gather the channel.",
        })
    }

    info('channel type is ' + JSON.stringify(channel.type))

    // Using a type guard to narrow down the correct type
    if (!((logChannel): logChannel is TextChannel => logChannel.type === 'text' || logChannel.type === 'dm')(channel)) {
        // don't do anything
    } else {

        info('about to send my message to the channel')
        channel.send(`Hello there! memberX joined the server.`)
    }
    // let channel = client.guilds.get('your-guild-id').channels.find((chan) => chan.id === config.discordSecrets.CommReadingChannel)
    // if (!channel) { return }
    // channel.send("it worked");


    // ///////////////////////////


    // try {
    //     let channel = client.channels.get(`${req.params.id}`)
    //     suc('Channel: 200 OK')



    //     return res.status(200).send({
    //         success: true,
    //         message: 'I gathered that channel.',
    //         channel,
    //     })
    // } catch (e) {
    //     err('Channel: 500 Internal Server Error')
    //     err(e)
    //     return res.status(500).send({
    //         success: false,
    //         message: 'I could not get that channel.',
    //     })
    // }

    // if we got here, then trouble
    return res.status(500).send({
        success: false,
        message: "I could not figure how to handle the message.",
    })

})


// info('asking for user list')
// try {
//     let users = client.users
//     console.log('sendMsg', users)
//     suc('Users: 200 OK')

//     try {
//         const tomUser = users.get(config.discordSecrets.TomID)
//             .finally
//     }
//     catch (e) {

//     }
// }
// // let myUser = users.find((user) => { user.id === config.discordSecrets.TomID })
// // // ok, we have a list of users
// // if (null !== users.find((user) => { user.id === config.discordSecrets.TomID })) {


// // try {
// //     client.us
// // }


// return res.status(200).send({
//     success: true,
//     message: 'I gathered all the users successfully.',
//     users,
// })
// } catch (e) {
//     err('Users: 500 Internal Server Error')
//     err(e)
//     return res.status(500).send({
//         success: false,
//         message: "I could not gather the users.",
//     })
// }
// })



// THIS GOES LAST - could not find what you were looking for
app.get('*', (req: Request, res: Response) => {
    info('unknown resource ' + JSON.stringify(req.originalUrl))
    res.render('404')
})







app.listen(config.port, () => {
    console.log(chalk.bold.underline.green("RESTcord.js") + " by " + chalk.bold("Chiphyr\n"))

    // info(`The server is running on port ${config.port}.\n`)
    // info(`Whitelisted IP's:\n${config.whitelist.join('\n')}\n`)


    // uncomment this to log into discord...

    // client.login(config.discordSecrets.botToken).then(() => {
    //     suc(`Logged into Discord as ${client.user.username}, serving ${client.guilds.size} servers.\n\n`)
    // })



    // ///////////////////////////////////////////////////

    client.on('message', (msg) => {
        info(` said ${msg.content}`)
        info(JSON.stringify(msg))
        if (msg.content === 'ping') {
            // console.log('channel', msg.channel)
            // let reply = "```javascript\nfor (let i=0; i<100; i++){\nconsole.log(i);\n}```"
            let reply = "Batman is really ||Bruce Wayne||"
            msg.reply(reply)
        }
    })
})
