const c="12.12.0",u=`https://www.gstatic.com/firebasejs/${c}/firebase-app.js`,p=`https://www.gstatic.com/firebasejs/${c}/firebase-ai.js`;let r=null;async function y({image:n,mediaType:e,targetPlant:t}){var o;if(!d())return null;const i=await(await f()).generateContent([{inlineData:{data:n,mimeType:e||"image/jpeg"}},{text:m(t)}]),s=typeof((o=i.response)==null?void 0:o.text)=="function"?i.response.text():h(i.response);return g(s)}function d(){return!1}async function f(){return r||(r=(async()=>{const[{initializeApp:n,getApps:e},{getAI:t,getGenerativeModel:a,GoogleAIBackend:i}]=await Promise.all([import(u),import(p)]),s={apiKey:void 0,authDomain:void 0,projectId:void 0,appId:void 0,storageBucket:void 0,messagingSenderId:void 0},o=e().length?e()[0]:n(s),l=t(o,{backend:new i});return a(l,{model:"gemini-2.0-flash",generationConfig:{temperature:.2,maxOutputTokens:900,responseMimeType:"application/json"}})})(),r)}function m(n){return`
You are a vertical farm expert. Analyse this indoor/vertical farm photo.${n?`
User says the intended plant is: ${n}. Use this as a hint, but only return it if it matches the photo or the photo is unclear.`:""}

Identify every plant species you can see and estimate how many slots/pots each occupies.

Return ONLY valid JSON, no markdown fences, no preamble:

{
  "plants": [
    {
      "name": "Common Name",
      "emoji": "🥬",
      "species": "species_slug",
      "confidence": 0.92,
      "slots": 4
    }
  ]
}

Rules:
- confidence: 0.0-1.0
- slots: integer, estimated pot/slot count for this species visible
- species: lowercase, underscores for spaces
- use realistic vegetable / herb emojis
- if photo is unclear but the target plant hint is useful, return one plant using the hint with lower confidence
- if no plants are visible and no hint is useful, return {"plants":[]}
- do NOT wrap in markdown
- return raw JSON only
`}function h(n){var e,t,a,i;return((i=(a=(t=(e=n==null?void 0:n.candidates)==null?void 0:e[0])==null?void 0:t.content)==null?void 0:a.parts)==null?void 0:i.map(s=>s.text||"").join(`
`))||'{"plants":[]}'}function g(n){const e=String(n||'{"plants":[]}').replace(/```json/g,"").replace(/```/g,"").trim(),t=e.indexOf("{"),a=e.lastIndexOf("}"),i=t>=0&&a>=t?e.slice(t,a+1):'{"plants":[]}',s=JSON.parse(i);return s.plants=w(s.plants||[]),s}function w(n){return n.map(e=>({name:e.name||"Unknown Plant",emoji:e.emoji||b(e.name),species:(e.species||e.name||"unknown").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,""),confidence:Math.min(1,Math.max(0,parseFloat(e.confidence)||0)),slots:Math.max(1,Math.min(50,parseInt(e.slots,10)||3))}))}function b(n=""){const e=String(n).toLowerCase();return e.includes("lettuce")||e.includes("cabbage")||e.includes("kale")?"🥬":e.includes("tomato")?"🍅":e.includes("chili")||e.includes("pepper")?"🌶️":e.includes("strawberry")?"🍓":e.includes("cucumber")?"🥒":e.includes("carrot")?"🥕":e.includes("bean")?"🫘":e.includes("pea")?"🟢":e.includes("basil")||e.includes("mint")||e.includes("spinach")||e.includes("cilantro")||e.includes("parsley")?"🌿":"🌱"}export{y as s};
