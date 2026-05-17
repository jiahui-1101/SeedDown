const p="12.12.0",g=`https://www.gstatic.com/firebasejs/${p}/firebase-app.js`,w=`https://www.gstatic.com/firebasejs/${p}/firebase-ai.js`;let l=null;async function j({image:n,mediaType:e,targetPlant:t}){var i;if(!d())return null;const o=await(await f()).generateContent([{inlineData:{data:n,mimeType:e||"image/jpeg"}},{text:b(t)}]),a=typeof((i=o.response)==null?void 0:i.text)=="function"?o.response.text():m(o.response);return v(a)}async function S({image:n,mediaType:e,plantName:t,plantSpecies:s,farmContext:o={},answers:a={}}){var u;if(!d())return null;const r=await(await f()).generateContent([{inlineData:{data:n,mimeType:e||"image/jpeg"}},{text:y({plantName:t,plantSpecies:s,farmContext:o,answers:a})}]),h=typeof((u=r.response)==null?void 0:u.text)=="function"?r.response.text():m(r.response);return x(h,t)}function d(){return!1}async function f(){return l||(l=(async()=>{const[{initializeApp:n,getApps:e},{getAI:t,getGenerativeModel:s,GoogleAIBackend:o}]=await Promise.all([import(g),import(w)]),a={apiKey:void 0,authDomain:void 0,projectId:void 0,appId:void 0,storageBucket:void 0,messagingSenderId:void 0},i=e().length?e()[0]:n(a),r=t(i,{backend:new o});return s(r,{model:"gemini-2.0-flash",generationConfig:{temperature:.2,maxOutputTokens:900,responseMimeType:"application/json"}})})(),l)}function y({plantName:n,plantSpecies:e,farmContext:t,answers:s}){return["You are SeedDown's commercial vertical farming plant health analyst.","Analyse the uploaded plant photo using the known plant context below.","","Known context:",JSON.stringify({plantName:n,plantSpecies:e,farmContext:t,answers:s},null,2),"","Return ONLY valid JSON, no markdown fences, no preamble:","","{",'  "plant": "Plant name",','  "condition": "Most likely disease or stress condition",','  "severity": "low | medium | high | unknown",','  "confidence": 0.78,','  "confidenceExplanation": "Short explanation of why this confidence was selected",','  "evidence": ["visible symptom or contextual clue"],','  "likelyCauses": ["cause 1", "cause 2"],','  "solutions": ["specific action 1", "specific action 2", "specific action 3"],','  "prevention": ["future prevention step 1", "future prevention step 2"],','  "needsMoreInfo": false,','  "followUpQuestions": []',"}","","Rules:","- Use the known plant species strongly, because recognition happened earlier.","- If the photo is unclear, symptoms are not visible, or multiple diseases look similar, set confidence below 0.55, needsMoreInfo true, and ask 3 concise follow-up questions.","- If it looks like environmental stress instead of infection, say so clearly.","- Do not claim certainty. Keep recommendations practical for indoor vertical farming.","- confidence must be from 0.0 to 1.0.","- return raw JSON only."].join(`
`)}function b(n){return`
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
`}function m(n){var e,t,s,o;return((o=(s=(t=(e=n==null?void 0:n.candidates)==null?void 0:e[0])==null?void 0:t.content)==null?void 0:s.parts)==null?void 0:o.map(a=>a.text||"").join(`
`))||'{"plants":[]}'}function x(n,e="Plant"){const t=String(n||"{}").replace(/```json/g,"").replace(/```/g,"").trim(),s=t.indexOf("{"),o=t.lastIndexOf("}"),a=s>=0&&o>=s?t.slice(s,o+1):"{}",i=JSON.parse(a),r=Math.min(1,Math.max(0,parseFloat(i.confidence)||0));return{plant:i.plant||e||"Plant",condition:i.condition||"Unable to confirm plant disease from this image",severity:["low","medium","high","unknown"].includes(i.severity)?i.severity:"unknown",confidence:r,confidenceExplanation:i.confidenceExplanation||"Confidence is based on image clarity, visible symptoms, and match with the known plant profile.",evidence:c(i.evidence),likelyCauses:c(i.likelyCauses),solutions:c(i.solutions),prevention:c(i.prevention),needsMoreInfo:!!i.needsMoreInfo||r<.55,followUpQuestions:c(i.followUpQuestions).slice(0,4)}}function c(n){return Array.isArray(n)?n.map(e=>String(e||"").trim()).filter(Boolean).slice(0,6):[]}function v(n){const e=String(n||'{"plants":[]}').replace(/```json/g,"").replace(/```/g,"").trim(),t=e.indexOf("{"),s=e.lastIndexOf("}"),o=t>=0&&s>=t?e.slice(t,s+1):'{"plants":[]}',a=JSON.parse(o);return a.plants=k(a.plants||[]),a}function k(n){return n.map(e=>({name:e.name||"Unknown Plant",emoji:e.emoji||I(e.name),species:(e.species||e.name||"unknown").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,""),confidence:Math.min(1,Math.max(0,parseFloat(e.confidence)||0)),slots:Math.max(1,Math.min(50,parseInt(e.slots,10)||3))}))}function I(n=""){const e=String(n).toLowerCase();return e.includes("lettuce")||e.includes("cabbage")||e.includes("kale")?"🥬":e.includes("tomato")?"🍅":e.includes("chili")||e.includes("pepper")?"🌶️":e.includes("strawberry")?"🍓":e.includes("cucumber")?"🥒":e.includes("carrot")?"🥕":e.includes("bean")?"🫘":e.includes("pea")?"🟢":e.includes("basil")||e.includes("mint")||e.includes("spinach")||e.includes("cilantro")||e.includes("parsley")?"🌿":"🌱"}export{S as a,j as s};
