import { useState } from "react"
import { setApiKey } from "../storage/apiKey"

export default function ApiKeyScreen({ onSaved }) {

  const [key, setKey] = useState("")

  function save() {
    setApiKey(key)
    onSaved(key)
  }

  return (
    <div style={{padding:40,fontFamily:"system-ui"}}>

      <h1>Ask ProMind</h1>

      <p>Enter your API key</p>

      <input
        type="text"
        value={key}
        onChange={(e)=>setKey(e.target.value)}
        style={{width:"100%",padding:"10px"}}
      />

      <button
        onClick={save}
        style={{marginTop:"20px",padding:"10px 20px"}}
      >
        Continue
      </button>

    </div>
  )
}
