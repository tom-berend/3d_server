
import * as config from '../src/config.json'
//  port, whitelist, discordSecrets, etc

const word = (config as any).name


import express, { Application, Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
// const session = new Session.MemoryStore() // TODO: replace Express default MemoryStore with a stronger version

const API_URL = 'http://api.fixer.io'


export class App {
    public app: Application

    constructor() {
        this.app = express()
        this.setConfig()
        this.app.set('view engine', 'ejs')

        this.app.use(express.static(config.path.join('/')))

        let sess = {
            secret: config.expressSecret,
            cookie: {
                secure: false,
            },
        }

        if (config.expressMode === 'production') {
            app.set('trust proxy', 1) // trust first proxy
            sess.cookie.secure = true // serve secure cookies
        }

        // this.app.use(new Session({
        //     secret: ‘i_love_husky’,
        //     resave: false,
        //     saveUninitialized: true
        // }))

        // this.app.use(Session())

        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({
            extended: false,
        }))
    }

    private setConfig() {
        // This ONLY allows files to come from the /dist directory
        // app.use('/', express.static(__dirname + '/dist'));
        // Allows us to receive requests with data in json format
        this.app.use(bodyParser.json({ limit: '50mb' }))

        // Allows us to receive requests with data in x-www-form-urlencoded format
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

        // Enables cors
        this.app.use(cors())

        this.app.use('', (req: Request, res: Response, next: any) => {
            const ip = req.ip.split(":").slice(3)[0]
            if ( /* whitelist.includes(ip)*/ true) { return next() } else { return res.status(403).render('403') }
        })

    }
}


export default new App().app

