import { SessionDB, ISession } from '../src/database'
import { SqlValue } from '../src/database'


test("SqlValue with static initializer", () => {

    let cb = SqlValue.of('msg', 'Hello World')  // create an SqlValue with helper function

    expect(cb.key).toEqual('msg')
    expect(cb.value).toEqual('Hello World')
    expect(cb.constructor.name).toEqual('SqlValue')
})


// test("SQL-Safe sterilizations", () => {
//     let cases = [
//         ["this is a safe string", "'this is a safe string'"],  // basic case - just adding quotes
//         ["this is a don't string", "'this is a don''t string'"],
//         ["don't can't won't do multiples", "'don''t can''t won''t do multiples'"],
//         ["this is a cr \n string", "'this is a cr \\n string'"],
//         ["this is a non-display \x0e string", "'this is a non-display  string'"],
//     ]

//     let db = new SessionDB()
//     cases.map((value, index) => {
//         expect(db.quoteString(value[0])).toEqual(value[1])
//     })

//     // now write them out and see if they come back cleanly

// })


// it('sessions, under difference scenarios', () => {
//     let sesDB = new SessionDB()
//     let testID = 'SecretValue2'

//     expect(sesDB.testSession).toBe(true)

    // // CASE 1 - session record doesn't exist and we ask for it
    // sesDB.expireSessions()     // clear the test sessionid.  don't care whether this has any effect or not

    // // ask for the session
    // const data1 = sesDB.getSession(testID)
    // expect(data1.jsonSession).toEqual(JSON.stringify({}))

    // // the session exists now.  let's write something to it
    // sesDB.putSession(testID, JSON.stringify({ hello: 'world' }))

    // // now when we ask, we should get back the value we wrote
    // const data2 = sesDB.getSession(testID)
    // expect(data2.jsonSession).toEqual(JSON.stringify({ hello: 'world' }))

    // // going in the back-door to set the expiry data to a very old value
    // sesDB.run(`update ${sesDB.tableName} set expireDate = ? where session = ?`, [1000, testID])

    // // now when we ask, we should get back the default (empty value)
    // const data3 = sesDB.getSession(testID)
    // expect(data3.jsonSession).toEqual(JSON.stringify({}))


//     const retval: any = await sesDB.get(`select * from ${sesDB.tableName}`)
//     console.log('everything', retval)
//     expect(retval).toEqual(JSON.stringify({ hello: 'world' }))
 })


// it('session works with previous record', async () => {
//     expect.assertions(1)
//     let sesDB = new SessionDB()
//     let testID = 'SecretValue3'

//     // CASE 2 - session record doesn't exist and we write it
//     // clear the test sessionid.  don't care whether this has any effect or not
//     await sesDB.run(`delete from ${sesDB.tableName} where sessionID = ?`, [testID])

//     // write a 'hello world'
//     await sesDB.putSession(testID, JSON.stringify({ hello: 'world' }))

//     // see if we get it back cleanl
//     const data2: ISession = await sesDB.getSession(testID)
//     expect(data2.jsonSession).toEqual(JSON.stringify({ hello: 'world' }))

// })

