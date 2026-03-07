import { useState } from "react"
import ApiKeyScreen from "./components/ApiKeyScreen"
import ProjectsScreen from "./components/ProjectsScreen"
import { getApiKey } from "./storage/apiKey"

export default function App() {

  const [apiKey,setApiKey] = useState(getApiKey())
  const [project,setProject] = useState(null)

  if(!apiKey){
    return <ApiKeyScreen onSaved={setApiKey}/>
  }

  if(!project){
    return (
      <ProjectsScreen
        apiKey={apiKey}
        onSelectProject={setProject}
      />
    )
  }

  return (
    <div>
      <p>Selected project: {project.label || project.project}</p>
    </div>
  )
}
