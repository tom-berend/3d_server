import { Database } from 'sqlite3'
import { objectExpression } from '@babel/types'

export class SqlValue {
    // factory method:  SqlValue.of(k, v) returns an SqlValue
    static of(k: string, v: string | number | boolean): SqlValue {
        return new SqlValue(k, v)
    }

    public key: string
    public value: string | number | boolean

    constructor(k: string, v: string | number | boolean) {
        this.key = k
        this.value = v
    }
}




// interpolate(strings: string[], params: string[]) {
//     let sqls = [strings[0]]

//     for (var i = 1; i < strings.length; ++i) {
//         var param = params[i - 1]

//         if (param instanceof Sql) {
//             sqls[sqls.length - 1] += param.sqls[0]
//             Array.prototype.push.apply(sqls, param.sqls.slice(1))
//             sqls[sqls.length - 1] += strings[i]
//         }
//         else sqls.push(strings[i])
//     }

//     return new Sql(sqls, flatten(params.map(toParams)))
// }


abstract class DataObject {
    public db: Database  // the SQLite object
    public tableName: string
    public lastID: any
    public dbFilePath = './database.sqlite'

    constructor() {
        this.db = new Database(this.dbFilePath, (err) => {
            if (err) {
                console.log('Could not connect to database', err)
            } else {
                console.log('Connected to database')
            }
        })
    }

    insertStmt(params: SqlValue[]): string {     // TODO figure how to use maps properly
        let cFields = `insert into ${this.tableName} ( `
        let cValues = ``
        params.forEach((param) => {

            if (cFields !== '') { // for second and subsequent fields, we need comma separators
                cFields += ", "
                cValues += ", "
            }

            cFields += param.key //  no checks against field names, but we have to be more careful with value fields
            switch (typeof param.value) {
                case "boolean":
                    cValues += param.value ? '1' : '0'
                    break
                case "number":
                    cValues += param.value.toString()
                    break
                case "string":
                    cValues += this.quoteString(this.sqlEscapeString(param.value)) // clean up, prevent injection
                    break
                // case "array":
                //     assertTRUE(false, "don't have an ARRAY handler for inserts of $key ".serialize($aArray));
                //     break;
                // case "object":
                //     assertTRUE(false, "don't have an OBJECT handler for inserts of $key ".serialize($aArray));
                //     break;
                // case "resource":
                //     assertTRUE(false, "don't have a RESOURCE handler for inserts of $key ".serialize($aArray));
                //     break;
                case "undefined":
                    throw (Error(`Undefined value for ${param.key}`))
                    break
                default:
                    throw (Error(`Unexpected type " + typeof value + "for ${param.key}`))
            }
        })

        return `INSERT INTO ${this.tableName} ( ${cFields} ) VALUES ( ${cValues}`
    }


    quoteString(dangerous: string) { // clean up, prevent injection
        let safe = this.sqlEscapeString(dangerous)
        return `'${safe}'`
    }


    sqlEscapeNumber(data: number): number {
        // clean up undefined numbers (returns 0)
        let retval: number = 0
        if (data !== undefined) {
            retval = data
        }
        return retval
    }


    sqlEscapeString(data: string): string {

        // nasty boundary cases
        if (data === undefined || data.length === 0) { return '' }

        // clean out non-displayables.  sorry, if you can't see it, we won't store it.
        const nonDisplayables: RegExp[] = [
            /%0[0-8bcef]/g,            // url encoded 00-08, 11, 12, 14, 15
            /%1[0-9a-f]/g,             // url encoded 16-31
            /[\x00-\x08]/g,            // 00-08
            /\x0b/g,                   // 11
            /\x0c/g,                   // 12
            /[\x0e-\x1f]/g,            // 14-31
        ]
        nonDisplayables.forEach((regex) => {
            data = data.replace(regex, '')
        })
        // attack the characters that need to be excaped
        data = data.replace(/\'/g, "''") // single quotes need to be repeated  (don't => don''t)
        data = data.replace(/\n/g, "\\n")   // standard mysql escape stuff
        data = data.replace(/\r/g, "\\r")
        data = data.replace(/\0/g, "\\0")
        data = data.replace(/"/g, `'"`)
        data = data.replace(/\x1a/g, "\\Z")
        return (data)
    }


    // public function insertArray($aArray)
    //     { // $aArray is a set of field-value pairs

    //         $cFields = "";
    //         $cValues = "";

    //         foreach ($aArray as $key => $value) {
    //             if ("" != $cFields) { // for second and subsequent fields, we need comma separators
    //                 $cFields += ", ";
    //                 $cValues += ", ";
    //             }

    //             $cFields += $key; //  no checks against field names, but we have to be more careful with value fields

    //             switch (gettype($value)) {
    //                 case "boolean":
    //                     $cValues += $value ? '1' : '0';
    //                     break;
    //                 case "integer":
    //                     $cValues += strval($value);
    //                     break;
    //                 case "double":
    //                     assertTRUE(false, "don't have a DOUBLE handler for insert " . serialize($aArray));
    //                     break;
    //                 case "string":
    //                     $cValues += $this->quote_string($value); // clean up, prevent injection
    //                     break;
    //                 case "array":
    //                     assertTRUE(false, "don't have an ARRAY handler for inserts of $key " . serialize($aArray));
    //                     break;
    //                 case "object":
    //                     assertTRUE(false, "don't have an OBJECT handler for inserts of $key " . serialize($aArray));
    //                     break;
    //                 case "resource":
    //                     assertTRUE(false, "don't have a RESOURCE handler for inserts of $key " . serialize($aArray));
    //                     break;
    //                 case "NULL":
    //                     // we decided to try to convert to empty string, because we don't have a schema
    //                     $cValues += $this->quote_string('');
    //                     break;
    //                 default:
    //                     assertTRUE(false, "Did not expect a type " . gettype($value) . " in INSERT() on field $key " . serialize($aArray));
    //             }
    //         }
    //         $insertString = "INSERT INTO " . $this->tableName . " (" . $cFields . ") VALUES (" . $cValues . ")";
    //         return ($this->statement($insertString));
    //     }



    async run(sql: string, params: string[] = []) {
        const promise = new Promise((resolve, reject) => {
            this.db.run(sql, params, (err: Error) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ id: this.lastID })
                }
            })
        })
        promise.then((res) => {
            console.log(`promise.then got called for ${sql}`)
        })
        promise.catch((err) => {
            console.log(`promise.catch got called for ${sql}`, err.message)
        })
    }

    async get(sql: string, params: string[] = []) {
        const promise = new Promise((resolve, reject) => {
            this.db.run(sql, params, (err: Error) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ id: this.lastID })
                }
            })
        })
        promise.then((res) => {
            console.log(`promise.then got called for ${sql}`)
        })
        promise.catch((err) => {
            console.log(`promise.catch got called for ${sql}`, err.message)
        })
    }


}


export class JestTestDB extends DataObject {   // just used for Jest Tests
    constructor() {
        super()
    }
}


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
// php version ////////////////////////////////////////////////

// class dbconnect extends UnitTestCase
// {

//     public $db;

//     public function __construct()
//     {

//         //assertTrue(!empty(SQLite3::version()),'Expected a SQLLite Version');

//         if ($GLOBALS['debugMode']) {
//             $file = "{$GLOBALS['path']}/KWE-TEST.SQLite3";
//         } else {
//             $file = "{$GLOBALS['path']}/KWE.SQLite3";
//         }
//         // Create (connect to) SQLite database in file
//         $this->db = new SQLite3($file);
//         assertTrue(file_exists($file));
//     }

//     public function testbasics()
//     {

//         $this->statement("DROP TABLE IF EXISTS `crudtable`;");
//         assertTrue(!$this->tableExists('crudtable'), "Don't expect crudtable to exist");

//         $this->statement("CREATE TABLE IF NOT EXISTS `crudtable` (
//             `column_1` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ON CONFLICT REPLACE,
//             `column_2` INTEGER,
//             `column_3` text,
//             `column_4` DATETIME default 0
//         )");

//         assertTrue($this->tableExists('crudtable'), "Expect this table");

//         $this->statement("INSERT INTO crudtable (column_1, column_2, column_3)
//                       VALUES (7, 5, 'Hello World');");

//         $this->query("SELECT * FROM crudTable;");
//     }

//     public function open($filename)
//     {
//         //$this->db = new SQLite3($filename);
//         $SQLite3->open($filename);
//         assertTrue($this->db->lastErrorCode() == 0, $this->db->lastErrorMsg());
//     }

//     public function tableExists($name)
//     {
//         $result = $this->query("SELECT name FROM sqlite_master WHERE type='table' AND name='$name'");
//         return (count($result) > 0);
//     }

//     public function statement($query)
//     {
//         // echo "<br>$query<br>";
//         //file_put_contents('statements.txt', $query."\n\n", FILE_APPEND );
//         $results = $this->db->query($query);
//     }

//     public function query($query)
//     {
//         // echo "<br>$query<br>";
//         $return = array();
//         $results = $this->db->query($query);
//         while ($row = $results->fetchArray()) {
//             $return[] = $row;
//             //printNice($row);
//         }
//         //assertTrue($this->db->lastErrorCode()==0, $this->db->lastErrorMsg());
//         return ($return);
//     }

//     public function insertArray($aArray)
//     { // $aArray is a set of field-value pairs

//         $cFields = "";
//         $cValues = "";

//         foreach ($aArray as $key => $value) {
//             if ("" != $cFields) { // for second and subsequent fields, we need comma separators
//                 $cFields += ", ";
//                 $cValues += ", ";
//             }

//             $cFields += $key; //  no checks against field names, but we have to be more careful with value fields

//             switch (gettype($value)) {
//                 case "boolean":
//                     $cValues += $value ? '1' : '0';
//                     break;
//                 case "integer":
//                     $cValues += strval($value);
//                     break;
//                 case "double":
//                     assertTRUE(false, "don't have a DOUBLE handler for insert " . serialize($aArray));
//                     break;
//                 case "string":
//                     $cValues += $this->quote_string($value); // clean up, prevent injection
//                     break;
//                 case "array":
//                     assertTRUE(false, "don't have an ARRAY handler for inserts of $key " . serialize($aArray));
//                     break;
//                 case "object":
//                     assertTRUE(false, "don't have an OBJECT handler for inserts of $key " . serialize($aArray));
//                     break;
//                 case "resource":
//                     assertTRUE(false, "don't have a RESOURCE handler for inserts of $key " . serialize($aArray));
//                     break;
//                 case "NULL":
//                     // we decided to try to convert to empty string, because we don't have a schema
//                     $cValues += $this->quote_string('');
//                     break;
//                 default:
//                     assertTRUE(false, "Did not expect a type " . gettype($value) . " in INSERT() on field $key " . serialize($aArray));
//             }
//         }
//         $insertString = "INSERT INTO " . $this->tableName . " (" . $cFields . ") VALUES (" . $cValues . ")";
//         return ($this->statement($insertString));
//     }

//     public function updateArray($aArray, $where)
//     {
//         $updates = '';

//         foreach ($aArray as $key => $value) {
//             if ("" != $updates) { // for second and subsequent fields, we need comma separators
//                 $updates += ",";
//             }

//             $updates += $key; //  no checks against field names, but we have to be more careful with value fields
//             $updates += '=';

//             switch (gettype($value)) {
//                 case "boolean":
//                     $updates += $value ? '1' : '0';
//                     break;
//                 case "integer":
//                     $updates += strval($value);
//                     break;
//                 case "double":
//                     break;
//                 case "string":
//                     $updates += $this->quote_string($value); // never put a raw string in a query...
//                     break;
//                 case "array":
//                     break;
//                 case "object":
//                     break;
//                 case "resource":
//                     break;
//                 case "NULL":
//                     $updates += ''; // treat NuLL as an empty string
//                     break;
//             }
//         }

//         $UpdateString = "Update $this->tableName set $updates where $where";
//         $this->statement($UpdateString);

//         //  printNice($UpdateString);
//     }

//     public function quote_string($dangerous)
//     { // clean up, prevent injection
//         $safe = $this->mysql_escape_mimic($dangerous);
//         return ("'" . $safe . "'");
//     }

//     public function mysql_escape_mimic($inp)
//     {
//         assertTrue(is_string($inp), "expected string, got " . serialize($inp));

//         if (!empty($inp)) {
//             // sqlite  replace single quote with 2x
//             $bkslash = chr(92);
//             $ret = str_replace(array($bkslash, '\\\\', "\0", "\n", "\r", "'", '"', "\x1a"), array('\\', '\\\\', '\\0', '\\n', '\\r', "''", '"', '\\Z'), $inp);
//         } else {
//             $ret = $inp;
//         }

//         // printNice("$inp  ==>>  $ret <br>");
//         return $ret;
//     }

//     public function show()
//     {
//         printNice($this->query("select * from {$this->tableName};"));
//     }
// }



export class StudentsDB extends DataObject {
    constructor() {
        super()

        /////////// discord sample user
        //     "id": "80351110224678912",
        //     "username": "Nelly",
        //     "discriminator": "1337",
        //     "avatar": "8342729096ea3675442027381ff50dfe",
        //     "verified": true,
        //     "email": "nelly@discordapp.com",
        //     "flags": 64,
        //     "premium_type": 1

        this.tableName = 'students'

        const create =
            `CREATE TABLE IF NOT EXISTS students(
            userid        text PRIMARY KEY NOT NULL,  /* actually rowid */
            username      text NOT NULL,
            discriminator integer NOT NULL,

            guildid       text NOT NULL,
            guildname     text NOT NULL,

            currLesson    text,
            history	      text,   /* only important stuff, details in SCORM */
            nextNagDate   integer  unsigned default 0,
            nagDateHuman  text );`

        this.run(create)

        const index1 =
            `CREATE INDEX IF NOT EXISTS idx1_${this.tableName} ON ${this.tableName} (guildID); `
        this.run(index1)
    }


    addStudent(nameID: string, name: string, guild: string, guildID: string) {

    }
}


