"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Import Express
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
//let data=fs.readFileSync("./react/minesweeper/src/App.jsx","utf8");
//console.log(data);
//const express = require("express")
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    fs_1.default.writeFileSync("log.txt", new Date().toString() + " " + (req.ip));
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
let links = {};
try {
    links = JSON.parse(fs_1.default.readFileSync("./database.json", "utf8"));
}
catch (_a) {
    console.log("Database Not Found");
}
console.log(links);
let nums = Object.keys(links);
function log(text) {
    fs_1.default.appendFileSync("./log.txt", text + new Date() + "\n");
}
app.post("/api", (req, res) => {
    log("New link received! ");
    console.log(req.body);
    let short = Math.floor(Math.random() * 10000).toString();
    if (nums.length === 10000) {
        log("No more links");
        res.status(501)
            .send("No more links! 501");
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
            links[short] = req.body.myURL;
            fs_1.default.writeFileSync("./database.json", JSON.stringify(links));
            log("The link has been saved. ");
            res.send("localhost:8000/" + short);
        }
        fs_1.default.appendFileSync("./log.txt", new Date() + "\n");
    }
    catch (_a) {
        log("Bad Request");
        res.status(400)
            .send("400 Bad Request");
    }
});
app.get("/:url", (req, res) => {
    let url = (req.params.url);
    console.log(url);
    if (url in links) {
        res.redirect(links[url]);
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
