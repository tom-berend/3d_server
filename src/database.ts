import { Database, Statement } from 'sqlite3'
import { logThisFile, success, info, error, status } from './utils'

// logThisFile(__filename)  // logging of sql calls and results


class DataObject {  // encapsulate SQLite with promise-based methods

    ////////////  this is a SINGLETON, open it with 'getInstance()   /////////////
    public static getInstance(): DataObject {                        /////////////
        if (!DataObject.instance) {                                  /////////////
            DataObject.instance = new DataObject()                   /////////////
        }                                                            /////////////
        return DataObject.instance                                   /////////////
    }                                                                /////////////
    private static instance: DataObject                              /////////////
    ////////////  this is a SINGLETON, link it with 'getInstance()   /////////////


    public db: Database  // the SQLite object
    public tableName: string
    public lastID: any
    public dbFilePath = './database.sqlite'


    open(): Promise<Database> {
        info(`open: ${this.dbFilePath} `,__filename)
        // tslint:disable-next-line: no-shadowed-variable
        return new Promise((resolve, reject) => {
            if (this.db !== undefined) {  // already have a database object
                resolve()
            } else {
                this.db = new Database(this.dbFilePath, (err) => {
                    if (err) {
                        error('23 ' + err.message)
                        reject()
                    } else {
                        resolve()
                    }
                })
            }
        })
    }


    close(): Promise<Database> {
        info(`close`,__filename)
        // tslint:disable-next-line: no-shadowed-variable
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    error('39 ' + err.message)
                    reject()
                } else {
                    resolve()
                }
            })
        })
    }

    runPromise(sql: string, params: any[] = []): Promise<Database> {
        info(`${sql} ` + JSON.stringify(params),__filename)
        // tslint:disable-next-line: no-shadowed-variable
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, (err) => {
                if (err) {
                    error('54 ' + err.message)
                    reject(err)
                } else {
                    status('in resolve of runPromise ' + sql,__filename)
                    resolve()
                }
            })
        })
    }

    getPromise(sql: string, params: any[]): Promise<Database> {
        info(`${sql} ` + JSON.stringify(params),__filename)
        // tslint:disable-next-line: no-shadowed-variable
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    error('70 ' + err.message)
                    reject(err)
                } else {
                    status('in resolve of getPromise ' + sql,__filename)
                    resolve(row)
                }
            })
        })
    }
}



/////////////////////////////////////////////////////////////////////
//////////// in the subclasses, use only runPromise, getPromise, etc

export interface ISession {
    sessionID: string,
    jsonSession: string,
}

export class SessionDB {

    public tableName = 'session'
    public bestBefore = 20 * 1000 // seconds to expiry
    public db: DataObject

    constructor() {
        this.db = DataObject.getInstance()   // singleton of the SQLite methods

        let defaultJson = JSON.stringify({})
        const createString =
            `CREATE TABLE IF NOT EXISTS ${this.tableName}(
            sessionID       text PRIMARY KEY NOT NULL,  /* actually rowid */
            jsonSession     text NOT NULL default '${defaultJson}',
            expireDate      integer unsigned
            );`

        this.db.open()  // in case not opened yet

        this.db.runPromise(createString)
    }

    async expireSessions() {
        // tslint:disable-next-line: no-shadowed-variable
        return new Promise((resolve, reject) => {
            let nowTime: number = Date.now()  // current time
            this.db.runPromise(`delete from ${this.tableName} where expireDate < ?`, [nowTime])
                .then(() => {
                    resolve()
                })
                .catch((err) => {
                    error('118 ' + err.message)
                    reject(err)
                })
        })
    }

    async putSession(session: ISession) {
        // tslint:disable-next-line: no-shadowed-variable
        return new Promise((resolve, reject) => {
            let newExpiry = Date.now() + this.bestBefore  // refresh the expiry date
            this.db.runPromise(`update ${this.tableName} set jsonSession = ?, expireDate =  ? where sessionID = ?`, [session.jsonSession, newExpiry, session.sessionID])
                .then(() => {
                    status('in then of putSession',__filename)
                    resolve()
                })
                .catch((err) => {
                    error('131 ' + err.message)
                    reject(err)
                })
        })
    }

    async newSession(session: ISession) {   // almost identical to putSession(), but may change later...
        // tslint:disable-next-line: no-shadowed-variable
        return new Promise((resolve, reject) => {
            let newExpiry = Date.now() + this.bestBefore  // refresh the expiry date
            this.db.runPromise(`INSERT INTO ${this.tableName} (sessionID, jsonSession,expireDate) values (?,?,?)`, [session.sessionID, session.jsonSession, newExpiry])
                .then(() => {
                    status('in then of newSession',__filename)
                    resolve()
                })
                .catch((err) => {
                    error('131 ' + err.message)
                    reject(err)
                })
        })
    }

    async getSession(sessionID: string): Promise<ISession> {
        // tslint:disable-next-line: no-shadowed-variable
        return new Promise((resolve, reject) => {
            this.expireSessions()
                .then(() => {
                    let session: ISession
                    let promise = this.expireSessions()
                        .then(() => {
                            this.db.getPromise(`SELECT * FROM ${this.tableName} where sessionid = ?`, [sessionID])
                                .then(async (row) => {
                                    status('in getSession, row is ' + JSON.stringify(row),__filename)
                                    // row may be undefined if session doesn't exist
                                    if (row === undefined) {
                                        status('row is undefined, we will insert an empty',__filename)
                                        session = { sessionID, jsonSession: JSON.stringify({}) }
                                        await this.newSession(session)
                                    } else {
                                        status('row is ' + JSON.stringify(row),__filename)
                                        session = row as unknown as ISession   // can return db row as ISession
                                    }
                                    status('converted to ' + JSON.stringify(session),__filename)
                                    resolve(session)
                                })

                        })
                })
        })
    }




    // this is the test function written using promises

    async testSession(sessionID: string) {    // wasted two days trying to get testing with JEST working - it hides all the errors

        // our test sessionIDs are 'secret1', 'secret2', 'secret3', etc.

        // clear out the session manually,
        // then ask for a session (get empty)
        // then insert data to that session
        // then ask for that session back (verify data)
        // then force expire manually
        // then ask for that session back (verify empty)

        this.db.runPromise(`delete from ${this.tableName} where sessionID = ?`, [sessionID])  // wipe the sessions if they exist
            .then(() => {
                this.getSession(sessionID)
                    .then((session) => {
                        console.assert(session.jsonSession === JSON.stringify({}), 'expected empty session #1')
                        session.jsonSession = JSON.stringify({ hello: 'World ' + sessionID })
                        this.putSession(session)   // update the session
                            .then(() => {
                                this.getSession(sessionID)  // read it back in again
                                    .then((oldSession) => {
                                        console.assert(oldSession.jsonSession === JSON.stringify({ hello: 'World ' + sessionID }), 'expected something in the session, got ' + JSON.stringify(oldSession))
                                        // stick a really old (expired) expiry date into the table, then ask for it again
                                        this.db.runPromise(`update ${this.tableName} set expireDate = ? where sessionID = ?`, [10, sessionID])
                                            .then(() => {
                                                // read it back again, should be empty now
                                                this.getSession(sessionID)  // read it back in again, should be empty
                                                    .then((newSession) => {
                                                        console.assert(newSession.jsonSession === JSON.stringify({}), 'expected empty session #2, got ' + JSON.stringify(newSession))
                                                    })
                                            })
                                    })
                            })
                    })
            })
    }

    // exactly the same function using async / await
    async testSession2(sessionID: string) {    // wasted two days trying to get testing with JEST working - it hides all the errors

        await this.db.runPromise(`delete from ${this.tableName} where sessionID = ?`, [sessionID])  // wipe the sessions if they exist
        let session = await this.getSession(sessionID)
        console.assert(session.jsonSession === JSON.stringify({}), 'expected empty session #1')

        session.jsonSession = JSON.stringify({ hello: 'World ' + sessionID })
        await this.putSession(session)   // update the session

        let oldSession = await this.getSession(sessionID)  // read it back in again
        console.assert(oldSession.jsonSession === JSON.stringify({ hello: 'World ' + sessionID }), 'expected something in the session, got ' + JSON.stringify(oldSession))

        // stick a really old (expired) expiry date into the table, then ask for it again
        await this.db.runPromise(`update ${this.tableName} set expireDate = ? where sessionID = ?`, [10, sessionID])

        // read it back again, should be empty now
        let newSession = await this.getSession(sessionID)  // read it back in again, should be empty
        console.assert(newSession.jsonSession === JSON.stringify({}), 'expected empty session #2, got ' + JSON.stringify(newSession))
    }

}

