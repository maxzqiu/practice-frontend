//Import Express
import fs from "fs";
import cors from "cors";
import Database from "better-sqlite3";
import { hashSync } from "bcryptjs";
import { insertValuesToDatabase, insertValuestoLog, readItems } from "./proxy.ts"


function makeid(length:number) {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i+=1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const pepper="sfkandjlfhewufio";

let salt=makeid(10)
console.log(hashSync("password"));
let password = "password";
password=password+salt+pepper;
console.log(hashSync(password));
let whole_password = [hashSync(password),salt]






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
import express from "express";
//import assert from "assert";
const app = express();
let time=0.5;
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  // fs.writeFileSync("log.txt", new Date().toString() + " " + req.ip);
  //insertValues(log,[(req.ip),(new Date).toString,"New user detected using the server! "])
  //assert(req !== undefined)
  insertValuestoLog({
    
    "ip":req.ip!,
    "time":new Date().toString(),
    "action":"New user detected in the server! "
  })
  

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
  let nums = readItems("shortlink","longlink",null)as number[]
  // shortlink where link!=null
    

  console.log(req.body);
  let short = Math.floor(Math.random() * 10000).toString();
  if (nums.length === 10000) {
    //insertValues(log,[req.ip,new Date().toString(),"No more links available here."])
    insertValuestoLog({
      "ip":req.ip!,
      "date":new Date().toString(),
      "action":"No more links available "
    })
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
      try{
        // db.prepare(`
        //   INSERT INTO database VALUES (?,?)
        //   `).run(req.body.myURL,short,links[short]["expire"])
       //insertValues(db,[req.body.myURL,short,Date.now()+req.body.TTL*60000])
       insertValuesToDatabase({
          "longlink":req.body.myURL,
          "shortlink":short,
          "expire":req.body.TTL*60000,
       })
       res.send("localhost:8000/" + short);
        
 
        //insertValues(log,[req.ip,new Date().toString(),"New link entered into the database"])
        insertValuestoLog({
          "ip":req.ip!,
          "time":new Date().toString(),
          "action":"New link entered into the database"
        })
      } catch {
        res.status(400).send("400 Bad Request");
        //insertValues(log,[req.ip,new Date().toString(),"The request sent by this user has failed"])
        insertValuestoLog({
          "ip":req.ip!,
          "time":new Date().toString(),
          "action":"The request sent by this user has failed. "
        })
      }
       


   
 });
app.get("/:url", (req, res) => {
  let url = req.params.url;
  console.log(url);
  let expiration = readItems("expire","longlink",url)as number[];
  let links = readItems("longlink","longlink",null)as string[]
  if (url in links) {
    if (expiration[0]<Date.now()){
      res.status(410).send("Your link has expired!" )
    } else {
      res.redirect(url);
    }
    
  } else {
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
