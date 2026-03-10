import { useState } from "react"
import { apiFetch } from "../api/client"

export default function SearchScreen({ apiKey, project, onBack }) {

  const [query,setQuery] = useState("")
  const [loading,setLoading] = useState(false)
  const [answer,setAnswer] = useState(null)
  const [sources,setSources] = useState([])

  async function runSearch(e){

    e.preventDefault()

    if(!query.trim()) return

    setLoading(true)
    setAnswer(null)
    setSources([])

    try{

      const data = await apiFetch(
        `/search/synthesis/reason?project=${encodeURIComponent(project.project)}`,
        apiKey,
        {
          method:"POST",
          body: JSON.stringify({
            query: query,
            limit: 5
          })
        }
      )

      setAnswer(data.answer || "")
      setSources(data.sources || [])

    }catch(err){
      console.error("Search failed",err)
      setAnswer("Search failed.")
    }

    setLoading(false)
  }

  return (
    <div style={{padding:40,fontFamily:"system-ui"}}>

      <button
        onClick={onBack}
        style={{marginBottom:20}}
      >
        ← Back to projects
      </button>

      <h2>{project.label || project.project}</h2>

      {project.description && (
        <p style={{color:"#666"}}>
          {project.description}
        </p>
      )}

      <form
        onSubmit={runSearch}
        style={{marginTop:30}}
      >

        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          placeholder="Search knowledge..."
          style={{
            width:"70%",
            padding:10,
            fontSize:16,
            marginRight:10
          }}
        />

        <button
          type="submit"
          style={{
            padding:"10px 16px"
          }}
        >
          Ask
        </button>

      </form>

      {loading && (
        <p style={{marginTop:20}}>
          Searching…
        </p>
      )}

      {answer && (
        <div
          style={{
            marginTop:30,
            background:"#f7f7f7",
            padding:20,
            borderRadius:6
          }}
        >
          <h3>Answer</h3>

          <div
            style={{
              whiteSpace:"pre-wrap",
              lineHeight:1.5
            }}
          >
            {answer}
          </div>

          {sources.length > 0 && (
            <div style={{marginTop:20,fontSize:13}}>

              <strong>Sources</strong>

              <ul>
                {sources.map((s,i)=>(
                  <li key={i}>
                    Artifact {s.artifact_id}
                    {s.heading ? ` – ${s.heading}` : ""}
                  </li>
                ))}
              </ul>

            </div>
          )}

        </div>
      )}

    </div>
  )
}
