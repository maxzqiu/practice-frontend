"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const bcryptjs_1 = require("bcryptjs");
const proxy_ts_1 = require("./proxy.ts");
function makeid(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const pepper = "sfkandjlfhewufio";
let salt = makeid(10);
console.log((0, bcryptjs_1.hashSync)("password"));
let password = "password";
password = password + salt + pepper;
console.log((0, bcryptjs_1.hashSync)(password));
let whole_password = [(0, bcryptjs_1.hashSync)(password), salt];
// function insertValues(database:any, items:any){
//   if (database==db){
//     db.prepare(`
//         INSERT INTO database VALUES (?,?,?)
//       `).run(items[0],items[1],items[2])
//   } else if (database===log){
//     db.prepare(`
//       INSERT INTO database VALUES (?,?,?)
//     `).run(items[0],items[1],items[2])
//   }
// }
// const query = db.prepare('SELECT * FROM users');
// query.all();
// console.log(query.all());
//let data=fs.readFileSync("./react/minesweeper/src/App.jsx","utf8");
//console.log(data);
//const express = require("express")
const express_1 = __importDefault(require("express"));
//import assert from "assert";
const app = (0, express_1.default)();
let time = 0.5;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    // fs.writeFileSync("log.txt", new Date().toString() + " " + req.ip);
    //insertValues(log,[(req.ip),(new Date).toString,"New user detected using the server! "])
    //assert(req !== undefined)
    (0, proxy_ts_1.insertValuestoLog)({
        "ip": req.ip,
        "time": new Date().toString(),
        "action": "New user detected in the server! "
    });
    next();
});
// let max={
//     "name":"Max",
//     "face":"ugly",
//     "belly":"fat",
//     "brain":"stupid",
// }
// fs.writeFileSync("max.json",JSON.stringify(max))
// let maxData=fs.readFileSync("max.json","utf8");
// console.log(maxData);
// interface Link{
//     "expire":number,
//     "url":string
// }
// let links: Record<string, Link> = {};
// try {
//   links = JSON.parse(fs.readFileSync("./database.json", "utf8"));
// } catch {
//   console.log("Database Not Found");
// }
// console.log(links);
// number of rows in sqlite database 
app.post("/api", (req, res) => {
    let nums = (0, proxy_ts_1.readItems)("shortlink", "longlink", null);
    // shortlink where link!=null
    console.log(req.body);
    let short = Math.floor(Math.random() * 10000).toString();
    if (nums.length === 10000) {
        //insertValues(log,[req.ip,new Date().toString(),"No more links available here."])
        (0, proxy_ts_1.insertValuestoLog)({
            "ip": req.ip,
            "date": new Date().toString(),
            "action": "No more links available "
        });
        res.status(501).send("No more links! 501");
    }
    while (short in nums) {
        short = Math.floor(Math.random() * 10000).toString();
    }
    // try {
    //   let flag = false;
    //   for () {
    //     if (req.body.myURL === ) {
    //       flag = true;
    //       res.send("localhost:8000/" + short);
    //     }
    //   }
    //   if (flag === false) {
    //     nums.push(short);
    // {short:
    // {time:CURRENTTIME
    // url: myURL}}
    // links[short] = {"expire":Date.now()+req.body.TTL*60000,"url":req.body.myURL};
    try {
        // db.prepare(`
        //   INSERT INTO database VALUES (?,?)
        //   `).run(req.body.myURL,short,links[short]["expire"])
        //insertValues(db,[req.body.myURL,short,Date.now()+req.body.TTL*60000])
        (0, proxy_ts_1.insertValuesToDatabase)({
            "longlink": req.body.myURL,
            "shortlink": short,
            "expire": req.body.TTL * 60000,
        });
        res.send("localhost:8000/" + short);
        //insertValues(log,[req.ip,new Date().toString(),"New link entered into the database"])
        (0, proxy_ts_1.insertValuestoLog)({
            "ip": req.ip,
            "time": new Date().toString(),
            "action": "New link entered into the database"
        });
    }
    catch (_a) {
        res.status(400).send("400 Bad Request");
        //insertValues(log,[req.ip,new Date().toString(),"The request sent by this user has failed"])
        (0, proxy_ts_1.insertValuestoLog)({
            "ip": req.ip,
            "time": new Date().toString(),
            "action": "The request sent by this user has failed. "
        });
    }
});
app.get("/:url", (req, res) => {
    let url = req.params.url;
    console.log(url);
    let expiration = (0, proxy_ts_1.readItems)("expire", "longlink", url);
    let links = (0, proxy_ts_1.readItems)("longlink", "longlink", null);
    if (url in links) {
        if (expiration[0] < Date.now()) {
            res.status(410).send("Your link has expired!");
        }
        else {
            res.redirect(url);
        }
    }
    else {
        res.sendStatus(404);
    }
});
app.get("/", (req, res) => {
    //res.sendStatus(418);
    //res.status(418).json({teapot:"gray"})
    res.download("main.js");
});
app.listen("8000", () => {
    console.log("Connected to port 8000");
});
