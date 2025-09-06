"use strict";
//interface? 
// 
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertValuesToDatabase = insertValuesToDatabase;
exports.insertValuesToPassword = insertValuesToPassword;
exports.insertValuestoLog = insertValuestoLog;
exports.readItems = readItems;
exports.readItemsPasswords = readItemsPasswords;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const db = new better_sqlite3_1.default("./database.db");
const log = new better_sqlite3_1.default("./log.db");
const passwords = new better_sqlite3_1.default("./passwords.db");
db.pragma("journal_mode=WAL");
db.exec(`
    CREATE TABLE IF NOT EXISTS database (
    longlink TEXT NOT NULL,
    shortlink NUMBER,
    expire NUMBER
    )
  `);
log.exec(`
      CREATE TABLE IF NOT EXISTS log (
        ip NUMBER NOT NULL,
        time TEXT NOT NULL,
        action TEXT NOT NULL
        )
    `);
passwords.exec(`
        CREATE TABLE IF NOT EXISTS passwords (
            name TEXT NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `);
function insertValuesToDatabase(data) {
    db.prepare(`
            INSERT INTO db VALUES (?,?,?)
        `).run(data.longlink, data.shortlink, data.expire);
}
function insertValuesToPassword(data) {
    passwords.prepare(`
            INSERT INTO passwords VALUES (?,?,?)
        `).run(data.name, data.username, data.password);
}
function insertValuestoLog(data) {
    log.prepare(`
        INSERT INTO log VALUES(?,?,?)
        `).run(data.ip, data.time, data.action);
}
function readItems(column, variablegoal, goalvalue) {
    return db.prepare(`
        SELECT ? FROM ? WHERE ?=?
      `).all(column, "database", variablegoal, goalvalue);
}
function readItemsPasswords(column, variablegoal, goalvalue) {
    return passwords.prepare(`
        SELECT ? FROM ? WHERE ?=?
      `).all(column, "passwords", variablegoal, goalvalue);
}
