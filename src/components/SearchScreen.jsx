import { useState } from "react"

export default function SearchScreen({ apiKey, project, onBack }) {

  const [query,setQuery] = useState("")
  const [loading,setLoading] = useState(false)

  const [mode,setMode] = useState("fast")

  const [answer,setAnswer] = useState(null)
  const [sources,setSources] = useState([])
  const [results,setResults] = useState([])

  const [context,setContext] = useState(null)
  const [showContext,setShowContext] = useState(false)

  async function runSearch(e){

    e.preventDefault()

    if(!query.trim()) return

    setLoading(true)
    setAnswer(null)
    setSources([])
    setResults([])

    const endpoint =
      mode === "reason"
        ? "/api/search/synthesis/reason"
        : "/api/search/synthesis"

    try{

      const res = await fetch(
        `${endpoint}?project=${encodeURIComponent(project.project)}`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "X-API-Key": apiKey
          },
          body: JSON.stringify({
            query: query,
            limit: 5
          })
        }
      )

      if(!res.ok){
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()

      if(mode === "reason"){
        setAnswer(data.answer || "")
        setSources(data.sources || [])
      }else{
        setResults(data.results || [])
      }

      setContext(data)

    }catch(err){
      console.error("Search failed",err)
      setAnswer("Search failed.")
    }

    setLoading(false)
  }

  function copyContext(){
    if(!context) return
    navigator.clipboard.writeText(
      JSON.stringify(context,null,2)
    )
  }

  return (
    <div style={{padding:40,fontFamily:"system-ui"}}>

      <button onClick={onBack}>
        ← Back to projects
      </button>

      <h2>{project.label || project.project}</h2>

      <form onSubmit={runSearch} style={{marginTop:30}}>

        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          placeholder="Search knowledge..."
          style={{
            width:"60%",
            padding:10,
            fontSize:16,
            marginRight:10
          }}
        />

        <button type="submit">
          Ask
        </button>

      </form>

      <div style={{marginTop:15}}>

        <label>
          <input
            type="radio"
            checked={mode==="fast"}
            onChange={()=>setMode("fast")}
          />
          Fast search
        </label>

        <label style={{marginLeft:20}}>
          <input
            type="radio"
            checked={mode==="reason"}
            onChange={()=>setMode("reason")}
          />
          Reasoning
        </label>

      </div>

      {loading && (
        <p style={{marginTop:20}}>Searching…</p>
      )}

      {mode === "reason" && answer && (
        <div style={{marginTop:30}}>
          <h3>Answer</h3>
          <div style={{whiteSpace:"pre-wrap"}}>
            {answer}
          </div>
        </div>
      )}

      {mode === "fast" && results.length > 0 && (
        <div style={{marginTop:30}}>
          <h3>Artifacts</h3>
          <ul>
            {results.map((r,i)=>(
              <li key={i}>
                {r.heading} (score {r.score.toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
      )}

      {context && (
        <div style={{marginTop:30}}>

          <button onClick={copyContext}>
            📋 COPY PROMPT + CONTEXT
          </button>

          <button
            onClick={()=>setShowContext(!showContext)}
            style={{marginLeft:10}}
          >
            {showContext ? "Hide" : "Show"} technical context
          </button>

          {showContext && (
            <pre
              style={{
                marginTop:15,
                background:"#f7f7f7",
                padding:15,
                overflow:"auto"
              }}
            >
{JSON.stringify(context,null,2)}
            </pre>
          )}

        </div>
      )}

    </div>
  )
}
