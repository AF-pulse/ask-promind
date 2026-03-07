import { useState } from "react"
import { apiFetch } from "../api/apiFetch"

export default function SearchScreen({ apiKey, project, onBack }) {

  const [query,setQuery] = useState("")
  const [results,setResults] = useState(null)
  const [loading,setLoading] = useState(false)

  async function runSearch(e){

    e.preventDefault()

    if(!query.trim()) return

    setLoading(true)

    try{

      const res = await apiFetch("/search",{
        method:"POST",
        body:{
          owner: project.owner,
          project: project.project,
          query
        }
      })

      setResults(res)

    }catch(err){
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <div style={{padding:40,fontFamily:"system-ui",maxWidth:900}}>

      <button
        onClick={onBack}
        style={{marginBottom:20}}
      >
        ← Back to projects
      </button>

      <h2>
        {project.label || project.project}
      </h2>

      {project.description && (
        <p style={{color:"#666"}}>
          {project.description}
        </p>
      )}

      <form onSubmit={runSearch} style={{marginTop:30}}>

        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          placeholder="Search knowledge..."
          style={{
            width:"100%",
            padding:12,
            fontSize:16,
            border:"1px solid #ccc",
            borderRadius:6
          }}
        />

      </form>

      {loading && (
        <p style={{marginTop:20}}>Searching…</p>
      )}

      {results && (
        <div style={{marginTop:30}}>

          {results.results?.map((r,i)=>(
            <div
              key={i}
              style={{
                padding:"12px 0",
                borderBottom:"1px solid #eee"
              }}
            >

              <div style={{fontWeight:600}}>
                {r.heading || "Result"}
              </div>

              <div style={{color:"#666",fontSize:14}}>
                {r.content}
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}
