import { useState } from "react"
import ApiKeyScreen from "./components/ApiKeyScreen"
import ProjectsScreen from "./components/ProjectsScreen"
import { getApiKey } from "./storage/apiKey"

export default function App() {

  const [apiKey,setApiKey] = useState(getApiKey())

  if(!apiKey){
    return <ApiKeyScreen onSaved={setApiKey}/>
  }

  return <ProjectsScreen apiKey={apiKey}/>
}
