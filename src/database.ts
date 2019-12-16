import { Database, Statement } from 'sqlite3'
import chalk from 'chalk'
import { serialize } from 'v8'

// console helpers
function success(msg: string) { console.log(chalk.green.italic('[SUCCESS]') + " " + chalk.bold(msg)) }
function info(msg: string) { console.log(chalk.blue.italic('[INFO]') + " " + chalk.bold(msg)) }
function error(msg: string) { console.log(chalk.red.italic('[ERROR]') + " " + chalk.bold(msg)) }


abstract class DataObject {
    public db: Database  // the SQLite object
    public tableName: string
    public lastID: any
    public dbFilePath = './database.sqlite'




    async open(dbFilePath: string): Promise<Database> {
        info(`open: ${dbFilePath}`)
        return new Promise((resolve, reject) => {
            this.db = new Database(dbFilePath, (err) => {
                if (err) {
                    error(err.message)
                    reject()
                } else {
                    resolve()
                }
            })
        })
    }


    async close(): Promise<Database> {
        info(`close`)
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    error(err.message)
                    reject()
                } else {
                    resolve()
                }
            })
        })
    }

    async runPromise(sql: string, params: any[]): Promise<Database> {
        info(`runPromise ${sql}`)
        return await new Promise((resolve, reject) => {
            this.db.run(sql, params, (err) => {
                if (err) {
                    error(err.message)
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    async getPromise(sql: string, params: any[]): Promise<Database> {
        info(`getPromise ${sql}`)
        return await new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    error(err.message)
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }

}



export class SessionDB extends DataObject {
    public tableName = 'session'
    public bestBefore = 20 * 1000 // seconds to expiry

    constructor() {
        super()

        let defaultJson = JSON.stringify({})
        const createString =
            `CREATE TABLE IF NOT EXISTS ${this.tableName}(
            sessionid       text PRIMARY KEY NOT NULL,  /* actually rowid */
            jsonSession     text NOT NULL default '${defaultJson}',
            expireDate      integer unsigned
            );`

        this.open(this.dbFilePath)
        //     .then((result) => {
        //         this.db.serialize(() => {
        //             this.runPromise(createString, [])
        //                 .then(() => {
        //                     // nothing
        //                 })
        //                 .catch((err) => {
        //                     // nothing
        //                 })
        //         })
        //     })
    }

    getSession(sessionID: string) {
        this.db.serialize(() => {
            this.db.each(`SELECT jsonSession
                     FROM ${this.tableName} where sessionid = ?`, [sessionID], (err: Error, row: any) => {
                if (err) {
                    console.error(err.message)
                }
                console.log(row.id + "\t" + row.name)
            })
        })
    }


    async testSession2() {
        let testID = 'Secret'
        let retval

        return await new Promise((resolve, reject) => {
            this.db.serialize(() => {
            this.runPromise(`insert into ${this.tableName} (sessionid,jsonSession) values (?,?)`, ['secret5""\n', 'nothing'])
                .then(() => {
                    success('tried to write a record')
                })
                .catch((err) => {
                    // nothing
                })

            this.getPromise(`SELECT * FROM ${this.tableName} where sessionid = ?`, ['secret5""\n'])
                .then((row) => {
                    success('select ' + JSON.stringify(row))
                    resolve(row)    // this is the final return
                })
                .catch((err) => {
                    // nothing
                })
        })
    }

}
