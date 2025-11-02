//interface? 
// 

import Database from "better-sqlite3"
const database = new Database("./database.db");
const log = new Database("./log.db");
const passwords = new Database("./passwords.db")

database.pragma("journal_mode=WAL");

database.exec(`
    CREATE TABLE IF NOT EXISTS database (
    longlink TEXT NOT NULL,
    shortlink NUMBER NOT NULL,
    expire NUMBER NOT NULL,
    username TEXT NOT NULL
    )
  `)
  
log.exec(`
      CREATE TABLE IF NOT EXISTS log (
        ip NUMBER NOT NULL,
        time TEXT NOT NULL,
        action TEXT NOT NULL
        )
    `)

passwords.exec(`
        CREATE TABLE IF NOT EXISTS passwords (
            name TEXT NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            salt TEXT NOT NULL
        )
    `)
export function insertValuesToDatabase(data:Record<string,string|number>){
    console.log(data)
    database.prepare(`
            INSERT INTO database VALUES (?,?,?,?)
        `).run(data.longlink,data.shortlink,data.expire,data.username)
    console.log("done")
}

export function insertValuesToPassword(data:Record<string,string|number>){
    passwords.prepare(`
            INSERT INTO passwords VALUES (?,?,?,?)
        `).run(data.name,data.username,data.password,data.salt)
}

export function insertValuestoLog(data:Record<string,string|number>){
    log.prepare(`
        INSERT INTO log VALUES(?,?,?)
        ` ).run(data.ip,data.time,data.action)
}
export function readItems(specific:boolean,column:any,variablegoal:any,goalvalue:any){
    if (specific===false){
        console.log("function part 1 ran")
        return database.prepare(`
            SELECT ${column} FROM database
            `).all()
    }
    else {
        console.log("function part 2 ran")
        return database.prepare(`
            SELECT ${column} FROM database WHERE ${variablegoal}=${goalvalue}
          `).all()
    }

    
    
}

export function readItemsPasswords(column:any,variablegoal:any,goalvalue:any){
    return passwords.prepare(`
        SELECT ${column} FROM passwords WHERE ${variablegoal}=?
      `).all(goalvalue)
    
}