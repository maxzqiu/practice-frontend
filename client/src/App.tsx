import { useState } from "react";
import "./App.css";
import QRCode from "react-qr-code";

let API_URL = "http://localhost:8000/api";
let password_check="http://localhost:8000/password"

function App() {
  let [data, setData] = useState("");
  let [input, setInput] = useState("");
  let [isURL, setIsURL] = useState(false);
  let [isCopied, setIsCopied] = useState(false);
  let [password,setPassword]=useState("")
  let [username,setUsername]=useState("")
  let [name,setName]=useState("")
  let [isSuccessful,setIsSuccessful]=useState("");
  let [created,setCreated]=useState("")
  const expire_time=1;

  async function checkPassword(){
    let payload={
      "username":username,
      "password":password,
    }
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    let res:any = await fetch(password_check, options);
    let response=await res.json()
    if (response.isSuccessful){
      setIsSuccessful("Successful");
    } else {
      setIsSuccessful("unsuccessful");
    }
  }

  async function createAccount(){
    let payload={
      "username":username,
      "password":password,
      "name":name
    }
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    };
    let res = await fetch("http://localhost:8000/createaccount", options);
    let response=await res.json()
    if (response.isSuccessful){
      setCreated("successful");
    } else {
      setCreated("unsuccessful");
    }
  }
  async function fetchAPI() {
    try {
      new URL(input);
      setIsURL(true);
      let payload = {
        myURL: input,
        TTL:expire_time
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };

      let res = await fetch(API_URL, options);

      if (res.ok) {
        let info = await res.text();
        setData(info);
      } else {
        switch (res.status) {
          case 400:
            throw new Error("The request you sent was invalid. ");
          case 404:
            throw new Error("The link could not be found. ");
          case 501:
            throw new Error("Our database has run out of links. ");
          default:
            throw new Error(
              "An error has occurred and we don't know what it is. Tough luck! The code is " +
                res.status,
            );
        }
      }
    } catch (error: any) {
      setData(error.message);
    }
  }

  

  return (
    <>
      <h2>THE ULTIMATE LINK SHORTENER</h2>
      <p>The shortened link will show up here: {data}</p>
      <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "20%", width: "20%" }}
          value={data}
          viewBox={"0 0 256 256"}
        ></QRCode>
      {isURL ? (
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "20%", width: "20%" }}
          value={data}
          viewBox={"0 0 256 256"}
        ></QRCode>
      ) : (
        <></>
      )}
      <br></br>
      <label htmlFor="input">Enter your link here: </label>
      <input id="input" onChange={(e) => setInput(e.target.value)}></input>

      <button
        onClick={() => {
          fetchAPI();
        }}
      >
        Send!
      </button>
      {isURL ? (
        <button
          onClick={() => {
            navigator.clipboard.writeText(data);
            setIsCopied(true);
          }}
        >
          Copy to clipboard!{" "}
        </button>
      ) : (
        <></>
      )}

      {isCopied ? <p>Copied to Clipboard!</p> : <></>}
    <p>Enter your user name and passcode here: </p> 
    <input onChange={(e)=>setUsername(e.target.value)}></input>
    <input onChange={(e)=>setPassword(e.target.value)}></input>
    <button onClick={()=>checkPassword()}>Check Password! </button>

    <p>Create a new account here: </p> 
    <input onChange={(e)=>setName(e.target.value)}></input>
    <input onChange={(e)=>setUsername(e.target.value)}></input>
    <input onChange={(e)=>setPassword(e.target.value)}></input>
    <button onClick={()=>createAccount()}>Create Account </button>
    <p>{created}</p>
    <p>{isSuccessful}</p>
    
    </>
  );
}

export default App;
