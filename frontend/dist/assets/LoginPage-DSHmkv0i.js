import{a as u,A as c,s as k}from"./index-DdEhl5tx.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const x="demo@seeddown.com",h="seeddown2026",p=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function P(){const t=document.getElementById("screenContainer");t.innerHTML=`
        <div class="screen active" id="loginScreen" style="
            background: linear-gradient(160deg, #ecfeff 0%, #f8fffe 100%);
            display:flex; flex-direction:column; justify-content:center;
            min-height:100vh; padding:0;
        ">
            <div style="flex:1; padding:36px 24px; display:flex; flex-direction:column; justify-content:center; max-width:420px; margin:0 auto; width:100%;">

                <div style="text-align:center; margin-bottom:36px;">
                    <div style="font-size:3rem; margin-bottom:8px;">🌿</div>
                    <div style="font-size:1.6rem; font-weight:800; color:#1a2b3c; letter-spacing:-0.5px;">SeedDown</div>
                    <div style="font-size:0.75rem; color:#64748b; margin-top:4px; letter-spacing:0.05em;">SMART FARM MANAGEMENT</div>
                </div>

                <div style="margin-bottom:24px;">
                    <div style="font-size:0.65rem; font-weight:700; color:#64748b; letter-spacing:0.1em; margin-bottom:10px;">SELECT FARMING MODE</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div id="modeBeginner" style="
                            background:white; border:2px solid #0f766e;
                            border-radius:14px; padding:14px 12px; cursor:pointer;
                            box-shadow:0 2px 12px rgba(15,118,110,0.12);
                            transition:all 0.2s;
                        ">
                            <span style="font-size:24px;">🌱</span>
                            <div style="font-weight:700; font-size:0.85rem; margin-top:6px; color:#1a2b3c;">Beginner</div>
                            <div style="font-size:0.65rem; color:#64748b; margin-top:2px;">Guided experience</div>
                        </div>
                        <div id="modeCommercial" style="
                            background:white; border:2px solid #e2e8f0;
                            border-radius:14px; padding:14px 12px; cursor:pointer;
                            transition:all 0.2s;
                        ">
                            <span style="font-size:24px;">🏭</span>
                            <div style="font-weight:700; font-size:0.85rem; margin-top:6px; color:#1a2b3c;">Commercial</div>
                            <div style="font-size:0.65rem; color:#64748b; margin-top:2px;">Pro data dashboard</div>
                        </div>
                    </div>
                </div>

                <div style="background:white; border-radius:20px; padding:24px; box-shadow:0 4px 24px rgba(0,0,0,0.07); border:1px solid #e2e8f0;">

                    <div style="display:flex; background:#f1f5f9; border-radius:10px; padding:3px; margin-bottom:20px;">
                        <button id="tabLogin" style="
                            flex:1; padding:8px; border:none; border-radius:8px;
                            background:white; font-weight:700; font-size:0.8rem;
                            color:#1a2b3c; cursor:pointer;
                            box-shadow:0 1px 4px rgba(0,0,0,0.08); transition:all 0.2s;
                        ">Sign In</button>
                        <button id="tabRegister" style="
                            flex:1; padding:8px; border:none; border-radius:8px;
                            background:transparent; font-weight:600; font-size:0.8rem;
                            color:#64748b; cursor:pointer; transition:all 0.2s;
                        ">Register</button>
                    </div>

                    <div style="margin-bottom:12px;">
                        <label style="font-size:0.7rem; font-weight:700; color:#374151; display:block; margin-bottom:6px;">Email</label>
                        <input type="email" id="loginEmail" placeholder="farmer@email.com" style="
                            width:100%; padding:11px 14px; border-radius:10px;
                            border:1.5px solid #e2e8f0; font-size:0.85rem;
                            outline:none; font-family:inherit; color:#1a2b3c;
                            box-sizing:border-box; transition:border-color 0.15s;
                        " onfocus="this.style.borderColor='#0f766e'" onblur="this.style.borderColor='#e2e8f0'">
                    </div>

                    <div style="margin-bottom:8px; position:relative;">
                        <label style="font-size:0.7rem; font-weight:700; color:#374151; display:block; margin-bottom:6px;">Password</label>
                        <input type="password" id="loginPassword" placeholder="••••••••" style="
                            width:100%; padding:11px 40px 11px 14px; border-radius:10px;
                            border:1.5px solid #e2e8f0; font-size:0.85rem;
                            outline:none; font-family:inherit; color:#1a2b3c;
                            box-sizing:border-box; transition:border-color 0.15s;
                        " onfocus="this.style.borderColor='#0f766e'" onblur="this.style.borderColor='#e2e8f0'">
                        <button id="togglePw" style="
                            position:absolute; right:12px; bottom:11px;
                            background:none; border:none; cursor:pointer;
                            font-size:0.85rem; color:#94a3b8;
                        ">👁</button>
                    </div>

                    <div id="forgotRow" style="text-align:right; margin-bottom:16px;">
                        <button id="forgotBtn" style="
                            background:none; border:none; font-size:0.7rem;
                            color:#0f766e; cursor:pointer; font-weight:600;
                        ">Forgot password?</button>
                    </div>

                    <div id="confirmRow" style="display:none; margin-bottom:16px;">
                        <div style="margin-bottom:12px;">
                            <label style="font-size:0.7rem; font-weight:700; color:#374151; display:block; margin-bottom:6px;">Confirm Password</label>
                            <input type="password" id="loginConfirm" placeholder="••••••••" style="
                                width:100%; padding:11px 14px; border-radius:10px;
                                border:1.5px solid #e2e8f0; font-size:0.85rem;
                                outline:none; font-family:inherit; color:#1a2b3c;
                                box-sizing:border-box; transition:border-color 0.15s;
                            " onfocus="this.style.borderColor='#0f766e'" onblur="this.style.borderColor='#e2e8f0'">
                        </div>
                        
                        <div style="display:flex; align-items:flex-start; gap:8px; margin-top:14px; padding:8px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                            <input type="checkbox" id="tncCheckbox" style="margin-top:2px; accent-color:#0f766e; cursor:pointer;">
                            <label for="tncCheckbox" style="font-size:0.7rem; color:#475569; line-height:1.4; cursor:pointer;">
                                I agree to the <span id="termsLink" role="button" tabindex="0" style="color:#0f766e; font-weight:600; text-decoration:underline;">Terms & Conditions</span> and <span id="privacyLink" role="button" tabindex="0" style="color:#0f766e; font-weight:600; text-decoration:underline;">Privacy Policy</span>. I consent to the collection and use of my farm data for AI analysis.
                            </label>
                        </div>
                    </div>

                    <div id="loginError" style="
                        display:none; background:#fef2f2; border:1px solid #fecaca;
                        border-radius:8px; padding:10px 12px; margin-bottom:12px;
                        font-size:0.75rem; color:#dc2626;
                    "></div>

                    <button id="loginBtn" style="
                        width:100%; padding:13px; border:none; border-radius:12px;
                        background:linear-gradient(135deg, #0f766e, #14b8a6);
                        color:white; font-weight:700; font-size:0.9rem; cursor:pointer;
                        box-shadow:0 4px 12px rgba(37,99,235,0.3);
                        transition:opacity 0.2s; margin-bottom:12px;
                    ">Sign In →</button>

                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                        <div style="flex:1; height:1px; background:#e2e8f0;"></div>
                        <span style="font-size:0.7rem; color:#94a3b8;">or</span>
                        <div style="flex:1; height:1px; background:#e2e8f0;"></div>
                    </div>

                    <button id="guestBtn" style="
                        width:100%; padding:11px; border:1.5px dashed #cbd5e1;
                        border-radius:12px; background:transparent; cursor:pointer;
                        font-weight:600; font-size:0.82rem; color:#64748b;
                        transition:all 0.2s;
                    ">👀 View as Guest (Demo)</button>

                </div>

                <div style="text-align:center; margin-top:20px; font-size:0.65rem; color:#94a3b8;">
                    Powered by PERSAKA <span style="color:#ef4444;">UTM</span>
                </div>
            </div>
        </div>
    `,I()}function I(){let t="beginner",o=!1;const i=document.getElementById("modeBeginner"),r=document.getElementById("modeCommercial");i.addEventListener("click",()=>{t="beginner",i.style.borderColor="#0f766e",i.style.boxShadow="0 2px 12px rgba(15,118,110,0.12)",r.style.borderColor="#e2e8f0",r.style.boxShadow="none"}),r.addEventListener("click",()=>{t="commercial",r.style.borderColor="#0f766e",r.style.boxShadow="0 2px 12px rgba(15,118,110,0.12)",i.style.borderColor="#e2e8f0",i.style.boxShadow="none"}),document.getElementById("tabLogin").addEventListener("click",()=>{o=!1,document.getElementById("tabLogin").style.background="white",document.getElementById("tabLogin").style.color="#1a2b3c",document.getElementById("tabLogin").style.boxShadow="0 1px 4px rgba(0,0,0,0.08)",document.getElementById("tabRegister").style.background="transparent",document.getElementById("tabRegister").style.color="#64748b",document.getElementById("tabRegister").style.boxShadow="none",document.getElementById("loginBtn").textContent="Sign In →",document.getElementById("forgotRow").style.display="block",document.getElementById("confirmRow").style.display="none",b()}),document.getElementById("tabRegister").addEventListener("click",()=>{o=!0,document.getElementById("tabRegister").style.background="white",document.getElementById("tabRegister").style.color="#1a2b3c",document.getElementById("tabRegister").style.boxShadow="0 1px 4px rgba(0,0,0,0.08)",document.getElementById("tabLogin").style.background="transparent",document.getElementById("tabLogin").style.color="#64748b",document.getElementById("tabLogin").style.boxShadow="none",document.getElementById("loginBtn").textContent="Create Account →",document.getElementById("forgotRow").style.display="none",document.getElementById("confirmRow").style.display="block",b()}),document.getElementById("togglePw").addEventListener("click",()=>{const e=document.getElementById("loginPassword");e.type=e.type==="password"?"text":"password"}),v("termsLink","terms"),v("privacyLink","privacy"),document.getElementById("forgotBtn").addEventListener("click",async()=>{const e=document.getElementById("loginEmail").value.trim();if(!e){m("Enter your email first.");return}try{const n=await fetch(`${p}/api/auth/forgot-password`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})});u("success","📧 Reset link request processed. Check your inbox if registered.")}catch{m("Unable to send reset request.")}}),document.getElementById("loginBtn").addEventListener("click",async()=>{var s,f;const e=document.getElementById("loginEmail").value.trim(),n=document.getElementById("loginPassword").value,a=(s=document.getElementById("loginConfirm"))==null?void 0:s.value,g=(f=document.getElementById("tncCheckbox"))==null?void 0:f.checked;if(!e||!n){m("Please fill in all fields.");return}if(o){if(n!==a){m("Passwords do not match.");return}if(n.length<6){m("Password must be at least 6 characters.");return}if(!g){m("You must agree to the Terms & Conditions.");return}}y(!0),b();try{if(o){const l=await fetch(`${p}/api/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:n,mode:t})}),d=await l.json();if(!l.ok||d.ok===!1)throw new Error(d.error||"Registration failed");u("success","🎉 Account created! Please sign in."),document.getElementById("tabLogin").click()}else{const l=await fetch(`${p}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:n})}),d=await l.json();if(!l.ok||d.ok===!1)throw new Error(d.error||"Invalid email or password");localStorage.setItem("token",d.token);const E={uid:d.user.email,email:d.user.email};await w(d.user.mode,E,!1)}}catch(l){m(l.message||"Something went wrong. Please try again.")}finally{y(!1)}}),document.getElementById("guestBtn").addEventListener("click",async()=>{b(),y(!0);try{let e=await fetch(`${p}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:x,password:h})}),n=await e.json();if(!e.ok&&n.error==="User not found"){if(console.log("[LoginPage] Demo account missing. Auto-creating..."),!(await fetch(`${p}/api/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:x,password:h,mode:t})})).ok)throw new Error("Failed to auto-create demo account");e=await fetch(`${p}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:x,password:h})}),n=await e.json()}if(!e.ok||n.ok===!1)throw new Error(n.error||"Guest login failed");localStorage.setItem("token",n.token);const a={uid:n.user.email,email:n.user.email};await w(t,a,!0)}catch(e){u("error","Demo mode unavailable. Please sign in or register."),console.warn("[LoginPage] Guest login error:",e)}finally{y(!1)}})}async function w(t,o,i){var e,n;localStorage.removeItem("user_farms"),localStorage.removeItem("farm_profile"),c.mode=t,c.isGuest=i,c.uid=o.uid,c.userEmail=o.email||"",c.userName=i?"Guest":o.displayName||((e=o.email)==null?void 0:e.split("@")[0])||"Farmer",localStorage.setItem("seeddown_mode",t);try{const a=localStorage.getItem("token"),s=await(await fetch(`${p}/api/farms`,{method:"GET",headers:{Authorization:`Bearer ${a}`}})).json();s.ok&&((n=s.farms)!=null&&n.length)?localStorage.setItem("user_farms",JSON.stringify(s.farms)):localStorage.setItem("user_farms",JSON.stringify([]))}catch(a){console.warn("[LoginPage] Could not load backend data, fallback to empty:",a),localStorage.setItem("user_farms",JSON.stringify([]))}const r=i?"👀 Welcome, Guest!":`👋 Welcome, ${c.userName}!`;u("success",r),c.notify(),k("farmlist")}function y(t){const o=document.getElementById("loginBtn"),i=document.getElementById("guestBtn");o&&(o.disabled=t,i.disabled=t,o.style.opacity=t?"0.6":"1",i.style.opacity=t?"0.4":"1",t&&(o.textContent="Please wait…"))}function m(t){const o=document.getElementById("loginError");o&&(o.textContent=t,o.style.display="block")}function b(){const t=document.getElementById("loginError");t&&(t.style.display="none")}function v(t,o){const i=document.getElementById(t);if(!i)return;const r=e=>{e.preventDefault(),e.stopPropagation(),B(o)};i.addEventListener("click",r),i.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&r(e)})}function B(t){var a,g,s;(a=document.getElementById("policyOverlay"))==null||a.remove();const o=t==="terms",i=o?"SeedDown Terms & Conditions":"SeedDown Privacy Policy",r=o?["SeedDown is a learning and farm-management demo tool for monitoring crops, sensors, alerts and AI recommendations.","IoT commands such as WATER_ON, FAN_ON and BUZZER_ON should be reviewed by the user before relying on them for real equipment.","Disease and What-If results are advisory diagnosis/planning outputs, not professional agronomy, medical, legal or safety advice.","You are responsible for keeping your account, device QR codes, WiFi details and farm hardware safe."]:["SeedDown may store your email, selected mode, farm layouts, device assignments, sensor readings, threshold settings and camera snapshots.","Farm and sensor data may be used to generate AI analysis, alerts, ESG estimates and disease diagnosis within the app.","If AI is unavailable, SeedDown may show labelled benchmark estimates so the feature does not become blank.","Demo data is intended for presentation/testing. You can clear local demo data from the browser storage or delete saved farms in the app."],e=document.createElement("div");e.id="policyOverlay",e.style.cssText="position:fixed;inset:0;z-index:120;background:rgba(15,23,42,.42);display:flex;align-items:center;justify-content:center;padding:18px;",e.innerHTML=`
        <div style="width:min(460px,100%);background:#fff;border:1px solid #ccfbf1;border-radius:20px;box-shadow:0 24px 70px rgba(15,23,42,.22);padding:18px;">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px;">
                <div>
                    <div style="font-size:10px;font-weight:900;color:#0f766e;text-transform:uppercase;letter-spacing:.08em;">SeedDown account</div>
                    <strong style="display:block;margin-top:3px;font-size:18px;color:#12312f;">${i}</strong>
                </div>
                <button id="policyClose" type="button" style="width:34px;height:34px;border:none;border-radius:12px;background:#f1f5f9;color:#12312f;font-size:18px;font-weight:900;cursor:pointer;">×</button>
            </div>
            <div style="display:flex;flex-direction:column;gap:9px;">
                ${r.map(f=>`<div style="background:#f8fffd;border:1px solid #ccfbf1;border-radius:12px;padding:10px 12px;color:#475569;font-size:12px;line-height:1.45;">${S(f)}</div>`).join("")}
            </div>
            <button id="policyOk" type="button" style="width:100%;margin-top:14px;padding:12px;border:none;border-radius:14px;background:#0f766e;color:white;font-weight:850;cursor:pointer;">I understand</button>
        </div>
    `,document.body.appendChild(e);const n=()=>e.remove();(g=document.getElementById("policyClose"))==null||g.addEventListener("click",n),(s=document.getElementById("policyOk"))==null||s.addEventListener("click",n),e.addEventListener("click",f=>{f.target===e&&n()})}function S(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{P as render};
