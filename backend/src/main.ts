//Import Express
import fs from "fs";
import cors from "cors";
//let data=fs.readFileSync("./react/minesweeper/src/App.jsx","utf8");

//console.log(data);

//const express = require("express")
import express from "express";
const app = express();
let time=0.5;
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  fs.writeFileSync("log.txt", new Date().toString() + " " + req.ip);
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

interface Link{
    "expire":number,
    "url":string

}

let links: Record<string, Link> = {};
try {
  links = JSON.parse(fs.readFileSync("./database.json", "utf8"));
} catch {
  console.log("Database Not Found");
}
console.log(links);
let nums = Object.keys(links);

function log(text: string) {
  fs.appendFileSync("./log.txt", text + new Date() + "\n");
}
app.post("/api", (req, res) => {
  log("New link received! ");
  console.log(req.body);
  let short = Math.floor(Math.random() * 10000).toString();
  if (nums.length === 10000) {
    log("No more links");
    res.status(501).send("No more links! 501");
  }
  while (short in nums) {
    short = Math.floor(Math.random() * 10000).toString();
  }
  try {
    let flag = false;

    for (let short in links) {
      if (req.body.myURL === links[short]) {
        flag = true;
        log("The link is already here! ");
        res.send("localhost:8000/" + short);
      }
    }
    if (flag === false) {
      nums.push(short);
      // {short:
          // {time:CURRENTTIME
          // url: myURL}}
      links[short] = {"expire":Date.now()+req.body.TTL*60000,"url":req.body.myURL};
      fs.writeFileSync("./database.json", JSON.stringify(links));
      log("The link has been saved. ");
      res.send("localhost:8000/" + short);
    }

    fs.appendFileSync("./log.txt", new Date() + "\n");
  } catch {
    log("Bad Request");
    res.status(400).send("400 Bad Request");
  }
});
app.get("/:url", (req, res) => {
  let url = req.params.url;
  console.log(url);
  if (url in links) {
    if (links[url].expire<Date.now()){
      res.status(410).send("Your link has expired!" )
    } else {
      res.redirect(links[url].url);
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
