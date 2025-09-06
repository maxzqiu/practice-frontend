//interface? 
// 

import Database from "better-sqlite3"
const db = new Database("./database.db");
const log = new Database("./log.db");
const passwords = new Database("./passwords.db")

db.pragma("journal_mode=WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS database (
    longlink TEXT NOT NULL,
    shortlink NUMBER,
    expire NUMBER
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
            password TEXT NOT NULL
        )
    `)
export function insertValuesToDatabase(data:Record<string,string|number>){
    db.prepare(`
            INSERT INTO db VALUES (?,?,?)
        `).run(data.longlink,data.shortlink,data.expire)
}

export function insertValuesToPassword(data:Record<string,string|number>){
    passwords.prepare(`
            INSERT INTO passwords VALUES (?,?,?)
        `).run(data.name,data.username,data.password)
}

export function insertValuestoLog(data:Record<string,string|number>){
    log.prepare(`
        INSERT INTO log VALUES(?,?,?)
        ` ).run(data.ip,data.time,data.action)
}
export function readItems(column:any,variablegoal:any,goalvalue:any){
    return db.prepare(`
        SELECT ? FROM ? WHERE ?=?
      `).all(column,"database",variablegoal,goalvalue)
    
}

export function readItemsPasswords(column:any,variablegoal:any,goalvalue:any){
    return passwords.prepare(`
        SELECT ? FROM ? WHERE ?=?
      `).all(column,"passwords",variablegoal,goalvalue)
    
}