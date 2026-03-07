import { useState } from "react"

export default function SearchScreen({ apiKey, project, onBack }) {

  const [query,setQuery] = useState("")
  const [loading,setLoading] = useState(false)
  const [answer,setAnswer] = useState(null)
  const [results,setResults] = useState(null)

  async function handleSearch(){

    if(!query.trim()) return

    setLoading(true)
    setAnswer(null)

    try{

      const res = await fetch(
        `/api/search/synthesis?project=${encodeURIComponent(project.project)}`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "X-API-Key": apiKey
          },
          body: JSON.stringify({
            query,
            limit: 10
          })
        }
      )

      if(!res.ok){
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()

      setResults(data.results || [])

    }catch(err){
      console.error("Search failed",err)
      setResults([])
    }

    setLoading(false)
  }

  async function handleReason(){

    if(!query.trim()) return

    setLoading(true)
    setResults(null)

    try{

      const res = await fetch(
        `/api/search/synthesis/reason?project=${encodeURIComponent(project.project)}`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "X-API-Key": apiKey
          },
          body: JSON.stringify({
            query,
            limit: 5
          })
        }
      )

      if(!res.ok){
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()

      setAnswer(data)

    }catch(err){
      console.error("Reasoning failed",err)
      setAnswer(null)
    }

    setLoading(false)
  }

  function clear(){
    setQuery("")
    setResults(null)
    setAnswer(null)
  }

  return (
    <div style={{padding:40,fontFamily:"system-ui",maxWidth:900}}>

      <button onClick={onBack} style={{marginBottom:20}}>
        ← Back to projects
      </button>

      <h2>{project.label || project.project}</h2>

      {project.description && (
        <p style={{color:"#666"}}>
          {project.description}
        </p>
      )}

      <div style={{marginTop:30}}>

        <input
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder="Ställ en fråga om projektets artefakter…"
          style={{
            padding:"8px 10px",
            width:"60%",
            marginRight:8
          }}
        />

        <button onClick={handleSearch}>
          🔎 Sök
        </button>

        <button onClick={handleReason} style={{marginLeft:6}}>
          💡 Resonera
        </button>

        {(results || answer) && (
          <button onClick={clear} style={{marginLeft:12}}>
            Rensa
          </button>
        )}

      </div>

      {loading && <p style={{marginTop:20}}>⏳ Söker…</p>}

      {/* Reasoning answer */}

      {answer && answer.answer && (
        <div
          style={{
            background:"#f9fafb",
            padding:"1rem",
            borderRadius:6,
            marginTop:"1rem"
          }}
        >
          <h4>Resonerande svar</h4>
          <div style={{whiteSpace:"pre-wrap"}}>
            {answer.answer}
          </div>

          {answer.sources?.length > 0 && (
            <div style={{marginTop:"1rem",fontSize:13}}>
              <strong>Källor:</strong>
              <ul>
                {answer.sources.map((s,idx)=>(
                  <li key={idx}>
                    Artefakt {s.artifact_id}
                    {s.heading ? ` – ${s.heading}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

      {/* Search results */}

      {results && (
        <ul style={{paddingLeft:0,marginTop:20}}>

          {results.length === 0 && <p>Inga träffar.</p>}

          {results.map((r)=>{

            const preview =
              r.content && r.content.length > 160
                ? r.content.slice(0,160)+"…"
                : r.content

            return (
              <li
                key={r.id}
                style={{
                  listStyle:"none",
                  padding:"0.75rem 0",
                  borderBottom:"1px solid #eee"
                }}
              >

                <div style={{fontWeight:600}}>
                  {r.heading || "Sektion utan rubrik"}
                </div>

                {preview && (
                  <div
                    style={{
                      fontSize:13,
                      color:"#444",
                      marginTop:6
                    }}
                  >
                    {preview}
                  </div>
                )}

              </li>
            )
          })}

        </ul>
      )}

    </div>
  )
}
