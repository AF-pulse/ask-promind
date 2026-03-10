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
          body:{
            query: query,
            limit: 5
          }
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

    if(mode === "fast"){

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

      return `You are continuing structured reasoning based on persistent knowledge artifacts.

User question:
${query}

Relevant artifacts:

${artifactText}

Instructions:
Use the artifacts above as primary context.
Explain your reasoning clearly.
If artifacts disagree, explain the tension and resolve it.

Answer:
`
    }

    if(mode === "reason"){

      const src =
        (sources || [])
        .map(s=>`- ${s.heading || "artifact"}`)
        .join("\n")

      return `User question:
${query}

ProMind reasoning output:
${answer}

Sources referenced:
${src}

Instructions:
Improve, extend, or critique this reasoning.
Continue the thinking process and produce a clearer final answer.

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

      <button onClick={onBack} style={{marginBottom:20}}>
        ← Back to projects
      </button>

      <h2>{project.label || project.project}</h2>

      {project.description && (
        <p style={{color:"#666"}}>
          {project.description}
        </p>
      )}

      <div style={{marginTop:20}}>

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

      <form onSubmit={runSearch} style={{marginTop:20}}>

        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          placeholder="Search knowledge..."
          style={{
            width:"65%",
            padding:10,
            fontSize:16,
            marginRight:10
          }}
        />

        <button type="submit">
          Ask
        </button>

      </form>

      {loading && (
        <p style={{marginTop:20}}>
          Searching…
        </p>
      )}

      {mode === "reason" && answer && (

        <div style={{
          marginTop:30,
          background:"#f7f7f7",
          padding:20,
          borderRadius:6
        }}>

          <h3>Answer</h3>

          <div style={{
            whiteSpace:"pre-wrap",
            lineHeight:1.6
          }}>
            {answer}
          </div>

        </div>

      )}

      {mode === "fast" && results.length > 0 && (

        <div style={{
          marginTop:30,
          background:"#f7f7f7",
          padding:20,
          borderRadius:6
        }}>

          <h3>Relevant artifacts</h3>

          <ul style={{paddingLeft:20}}>

            {results.map((r,i)=>{

              const preview =
                (r.content || "")
                .replace(/\s+/g," ")
                .slice(0,220)

              return (

                <li key={i} style={{marginBottom:16}}>

                  <div style={{fontWeight:600}}>
                    {r.heading}
                  </div>

                  <div style={{
                    fontSize:13,
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

                </li>

              )

            })}

          </ul>

        </div>

      )}

      {context && (

        <div style={{marginTop:30}}>

          <button
            onClick={copyPrompt}
            style={{
              fontWeight:700,
              padding:"12px 18px",
              fontSize:15
            }}
          >
            📋 COPY PROMPT FOR LLM
          </button>

          <button
            onClick={()=>setShowContext(!showContext)}
            style={{marginLeft:12}}
          >
            {showContext ? "Hide" : "Show"} technical context
          </button>

          {showContext && (

            <pre style={{
              marginTop:15,
              background:"#f0f0f0",
              padding:15,
              overflow:"auto",
              fontSize:12
            }}>
{JSON.stringify(context,null,2)}
            </pre>

          )}

        </div>

      )}

    </div>
  )
}
