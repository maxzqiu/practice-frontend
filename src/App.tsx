import { useState,useEffect } from 'react'
import './App.css'

let URL="http://localhost:8000/api"

function App() {
  let [data,setData]=useState("");
  let [input,setInput]=useState("");

    
    async function fetchAPI(){
      if (input.substring(0,4)!=="www."){
        setData("Not a valid link")
      } else {
        let payload={
          "myURL":input
        }
        const options={
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(payload),
        }
        let res:any=await fetch(URL,options)
        let info=await res.text();
        setData(info);
      }
      
    }


  return (
    <>
      <p>Hi</p>
      <p>{data}</p>
      <input onChange={(e)=>setInput(e.target.value)}></input>
      <button onClick={()=>{
        fetchAPI();
      }}>Send!</button>
    </>
    
  )
}

export default App
