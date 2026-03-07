import { useEffect, useState } from "react"
import { fetchProjects } from "../api/projects"

export default function ProjectsScreen({ apiKey }) {

  const [projects,setProjects] = useState(null)

  useEffect(()=>{
    fetchProjects(apiKey)
      .then(setProjects)
      .catch(console.error)
  },[])

  if(!projects){
    return <p>Loading projects...</p>
  }

  return (
    <div style={{padding:40,fontFamily:"system-ui"}}>

      <h2>Select Project</h2>

      {projects.map(p => (
        <div key={p.project} style={{padding:"10px 0"}}>
          {p.project}
        </div>
      ))}

    </div>
  )
}
