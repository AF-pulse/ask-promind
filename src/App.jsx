import { useState } from "react"
import ApiKeyScreen from "./components/ApiKeyScreen"
import { getApiKey } from "./storage/apiKey"

export default function App() {

  const [apiKey,setApiKey] = useState(getApiKey())

  if(!apiKey){
    return <ApiKeyScreen onSaved={setApiKey}/>
  }

  return (
    <div style={{padding:40,fontFamily:"system-ui"}}>
      <h1>Ask ProMind</h1>
      <p>API key configured.</p>
    </div>
  )
}
