import { useState } from "react";
import "./App.css";
import QRCode from "react-qr-code";

let API_URL = "http://localhost:8000/api";

function App() {
  let [data, setData] = useState("");
  let [input, setInput] = useState("");
  let [isURL, setIsURL] = useState(false);
  let [isCopied, setIsCopied] = useState(false);
  const expire_time=1;

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
          value={"http://artthatbarksqr.vercel.app"}
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
    </>
  );
}

export default App;
