import { useState } from "react"
import ApiKeyScreen from "./components/ApiKeyScreen"
import ProjectsScreen from "./components/ProjectsScreen"
import SearchScreen from "./components/SearchScreen"
import { getApiKey } from "./storage/apiKey"

export default function App() {

  const [apiKey, setApiKey] = useState(getApiKey())
  const [project, setProject] = useState(null)

  // 1. Ingen API-nyckel → visa nyckel-inmatning
  if (!apiKey) {
    return (
      <ApiKeyScreen
        onSaved={setApiKey}
      />
    )
  }

  // 2. API-nyckel finns men inget projekt valt → visa projektlista
  if (!project) {
    return (
      <ProjectsScreen
        apiKey={apiKey}
        onSelectProject={setProject}
      />
    )
  }

  // 3. Projekt valt → visa search-sidan
  return (
    <SearchScreen
      apiKey={apiKey}
      project={project}
      onBack={() => setProject(null)}
    />
  )
}
