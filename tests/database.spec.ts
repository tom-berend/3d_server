import { JestTestDB } from '../src/database'
import { SqlValue } from '../src/database'


test("SqlValue with static initializer", () => {

    let cb = SqlValue.of('msg', 'Hello World')  // create an SqlValue with helper function

    expect(cb.key).toEqual('msg')
    expect(cb.value).toEqual('Hello World')
    expect(cb.constructor.name).toEqual('SqlValue')
})


test("SQL-Safe sterilizations", () => {
    let cases = [
        ["this is a safe string", "'this is a safe string'"],  // basic case - just adding quotes
        ["this is a don't string", "'this is a don''t string'"],
        ["don't can't won't do multiples", "'don''t can''t won''t do multiples'"],
        ["this is a cr \n string", "'this is a cr \\n string'"],
        ["this is a non-display \x0e string", "'this is a non-display  string'"],
    ]

    let db = new JestTestDB()
    cases.map((value, index) => {
        expect(db.quoteString(value[0])).toEqual(value[1])
    })

    // now write them out and see if they come back cleanly

})

test("insert a student record and read it back", () => {

let cb = SqlValue.of('msg', 'Hello World')  // create an SqlValue with helper function

insertStmt(params: SqlValue[]): string {     // TODO figure how to use maps properly


