import { useState } from "react"
import { apiFetch } from "../api/client"

export default function SearchScreen({ apiKey, project, onBack }) {

  const [query,setQuery] = useState("")
  const [loading,setLoading] = useState(false)

  const [mode,setMode] = useState("fast")

  const [answer,setAnswer] = useState(null)
  const [sources,setSources] = useState([])
  const [results,setResults] = useState([])

  const [context,setContext] = useState(null)

  const [showArtifacts,setShowArtifacts] = useState(false)
  const [showContext,setShowContext] = useState(false)

  async function runSearch(e){

    e.preventDefault()

    if(!query.trim()) return

    setLoading(true)

    setAnswer(null)
    setSources([])
    setResults([])
    setContext(null)

    const endpoint =
      mode === "reason"
        ? "/search/synthesis/reason"
        : "/search/synthesis"

    try{

      const data = await apiFetch(
        `${endpoint}?project=${encodeURIComponent(project.project)}`,
        apiKey,
        {
          method:"POST",
          body: JSON.stringify({
            query: query,
            limit: 5
          })
        }
      )

      if(mode === "reason"){

        setAnswer(data.answer || "")
        setSources(data.sources || [])

      }else{

        const sorted =
          (data.results || [])
          .sort((a,b)=>b.score-a.score)

        setResults(sorted)

      }

      setContext(data)

    }catch(err){

      console.error(err)
      setAnswer("Search failed.")

    }

    setLoading(false)
  }

  function buildPrompt(){

    const artifactText =
      (results || [])
      .map((r,i)=>{

        const content =
          (r.content || "")
          .replace(/\s+/g," ")
          .slice(0,1200)

        return `Artifact ${i+1}: ${r.heading}

${content}`

      })
      .join("\n\n")

    return `User question:
${query}

Relevant artifacts:

${artifactText}

Instructions:
Use the artifacts above as primary context.
Explain reasoning clearly.

Answer:
`
  }

  function copyPrompt(){

    const prompt = buildPrompt()

    if(!prompt) return

    navigator.clipboard.writeText(prompt)

  }

  return (

    <div style={{
      padding:40,
      fontFamily:"system-ui",
      maxWidth:900,
      margin:"0 auto"
    }}>

      <button onClick={onBack} style={{marginBottom:30}}>
        ← Back to projects
      </button>

      <h1 style={{marginBottom:10}}>
        {project.label || project.project}
      </h1>

      <form onSubmit={runSearch} style={{marginBottom:30}}>

        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          placeholder="Ask your knowledge..."
          style={{
            width:"100%",
            padding:16,
            fontSize:18,
            borderRadius:14,
            border:"1px solid #ddd",
            marginBottom:15
          }}
        />

        <button
          type="submit"
          style={{
            padding:"12px 22px",
            fontSize:16,
            borderRadius:12,
            border:"none",
            background:"#2b6df8",
            color:"white",
            fontWeight:600,
            cursor:"pointer"
          }}
        >
          Search
        </button>

      </form>

      {loading && (
        <p>Searching…</p>
      )}

      {context && (

        <div style={{marginBottom:30}}>

          <button
            onClick={copyPrompt}
            style={{
              padding:"16px 26px",
              fontSize:16,
              borderRadius:16,
              border:"none",
              background:"#111",
              color:"white",
              fontWeight:700,
              cursor:"pointer"
            }}
          >
            📋 COPY PROMPT FOR GPT
          </button>

        </div>

      )}

      {results.length > 0 && (

        <div style={{marginBottom:30}}>

          <button
            onClick={()=>setShowArtifacts(!showArtifacts)}
          >
            {showArtifacts ? "Hide artifacts" : "Show artifacts"}
          </button>

          {showArtifacts && (

            <div style={{
              marginTop:20,
              background:"#f7f7f7",
              padding:20,
              borderRadius:16
            }}>

              {results.map((r,i)=>{

                const preview =
                  (r.content || "")
                  .replace(/\s+/g," ")
                  .slice(0,240)

                return (

                  <div key={i} style={{marginBottom:20}}>

                    <div style={{fontWeight:600}}>
                      {r.heading}
                    </div>

                    <div style={{
                      fontSize:14,
                      color:"#555",
                      marginTop:4
                    }}>
                      {preview}…
                    </div>

                    <div style={{
                      fontSize:11,
                      color:"#999",
                      marginTop:4
                    }}>
                      score {r.score.toFixed(3)}
                    </div>

                  </div>

                )

              })}

            </div>

          )}

        </div>

      )}

      {context && (

        <div>

          <button
            onClick={()=>setShowContext(!showContext)}
          >
            {showContext ? "Hide technical context" : "Show technical context"}
          </button>

          {showContext && (

            <pre style={{
              marginTop:15,
              background:"#f0f0f0",
              padding:15,
              overflow:"auto",
              fontSize:12,
              borderRadius:12
            }}>
{JSON.stringify(context,null,2)}
            </pre>

          )}

        </div>

      )}

    </div>
  )
}
