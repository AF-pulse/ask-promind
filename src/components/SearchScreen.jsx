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
    setContext(null)

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

  function buildPrompt(){

    if(mode === "fast"){

      const artifactText = (results || [])
        .map((r,i)=>{

          const content = (r.content || "").slice(0,1200)

          return `Artifact ${i+1}: ${r.heading}

${content}`

        })
        .join("\n\n")

      return `You are continuing structured reasoning based on persistent knowledge artifacts.

User question:
${query}

Relevant artifacts:

${artifactText}

Instructions:
Use the artifacts above as primary context.
Explain your reasoning clearly.
If the artifacts conflict, explain the tension.

Answer:
`
    }

    if(mode === "reason"){

      const src = (sources || [])
        .map(s=>`- ${s.heading || "artifact"}`)
        .join("\n")

      return `User question:
${query}

ProMind reasoning output:
${answer}

Sources used:
${src}

Instructions:
Expand, critique, or improve this reasoning.
Continue the thinking process.

Response:
`
    }

    return ""
  }

  function copyPrompt(){

    const prompt = buildPrompt()

    if(!prompt) return

    navigator.clipboard.writeText(prompt)

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
            width:"60%",
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
        <p style={{marginTop:20}}>
          Searching…
        </p>
      )}

      {mode === "reason" && answer && (

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

      {mode === "fast" && results.length > 0 && (

        <div
          style={{
            marginTop:30,
            background:"#f7f7f7",
            padding:20,
            borderRadius:6
          }}
        >

          <h3>Artifacts</h3>

          <ul>

            {results.map((r,i)=>(

              <li key={i} style={{marginBottom:10}}>

                <strong>{r.heading}</strong>

                {r.content && (
                  <div style={{fontSize:13,color:"#555"}}>
                    {r.content.slice(0,200)}...
                  </div>
                )}

              </li>

            ))}

          </ul>

        </div>

      )}

      {context && (

        <div style={{marginTop:30}}>

          <button
            onClick={copyPrompt}
            style={{
              fontWeight:600,
              padding:"10px 16px"
            }}
          >
            📋 COPY PROMPT FOR LLM
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
                background:"#f0f0f0",
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
