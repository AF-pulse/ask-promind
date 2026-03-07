import { useEffect, useState } from "react"
import { fetchProjects } from "../api/projects"

export default function ProjectsScreen({ apiKey, onSelectProject }) {

  const [projects,setProjects] = useState(null)

  useEffect(()=>{
    fetchProjects(apiKey)
      .then(data => {

        const sorted = [...data].sort(
          (a,b) => (b.chat_count || 0) - (a.chat_count || 0)
        )

        setProjects(sorted)

      })
      .catch(console.error)
  },[])

  if(!projects){
    return <p>Loading projects...</p>
  }

  return (
    <div style={{padding:40,fontFamily:"system-ui"}}>

      <h2>Select Project</h2>

      {projects.map(p => (

        <div
          key={`${p.owner}-${p.project}`}
          onClick={() => onSelectProject(p)}
          style={{
            padding:"12px 0",
            borderBottom:"1px solid #eee",
            cursor:"pointer"
          }}
        >

          <div style={{fontWeight:600}}>
            {p.label || p.project}
          </div>

          {p.description && (
            <div style={{color:"#666",fontSize:14}}>
              {p.description}
            </div>
          )}

          <div style={{fontSize:12,color:"#999",marginTop:4}}>
            {p.chat_count || 0} chats
            {p.readOnly && " · read only"}
          </div>

        </div>

      ))}

    </div>
  )
}
