import{a as f,A as g,s as E}from"./index-Bs4kLmpj.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const x="demo@seeddown.com",b="seeddown2026",m=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function C(){const e=document.getElementById("screenContainer");e.innerHTML=`
        <div class="screen active" id="loginScreen" style="
            background: linear-gradient(160deg, #f0fdf4 0%, #eff6ff 100%);
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
                            background:white; border:2px solid #2563eb;
                            border-radius:14px; padding:14px 12px; cursor:pointer;
                            box-shadow:0 2px 12px rgba(37,99,235,0.12);
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
                        " onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e2e8f0'">
                    </div>

                    <div style="margin-bottom:8px; position:relative;">
                        <label style="font-size:0.7rem; font-weight:700; color:#374151; display:block; margin-bottom:6px;">Password</label>
                        <input type="password" id="loginPassword" placeholder="••••••••" style="
                            width:100%; padding:11px 40px 11px 14px; border-radius:10px;
                            border:1.5px solid #e2e8f0; font-size:0.85rem;
                            outline:none; font-family:inherit; color:#1a2b3c;
                            box-sizing:border-box; transition:border-color 0.15s;
                        " onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e2e8f0'">
                        <button id="togglePw" style="
                            position:absolute; right:12px; bottom:11px;
                            background:none; border:none; cursor:pointer;
                            font-size:0.85rem; color:#94a3b8;
                        ">👁</button>
                    </div>

                    <div id="forgotRow" style="text-align:right; margin-bottom:16px;">
                        <button id="forgotBtn" style="
                            background:none; border:none; font-size:0.7rem;
                            color:#2563eb; cursor:pointer; font-weight:600;
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
                            " onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e2e8f0'">
                        </div>
                        
                        <div style="display:flex; align-items:flex-start; gap:8px; margin-top:14px; padding:8px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                            <input type="checkbox" id="tncCheckbox" style="margin-top:2px; accent-color:#2563eb; cursor:pointer;">
                            <label for="tncCheckbox" style="font-size:0.7rem; color:#475569; line-height:1.4; cursor:pointer;">
                                I agree to the <span style="color:#2563eb; font-weight:600; text-decoration:underline;">Terms & Conditions</span> and <span style="color:#2563eb; font-weight:600; text-decoration:underline;">Privacy Policy</span>. I consent to the collection and use of my farm data for AI analysis.
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
                        background:linear-gradient(135deg, #2563eb, #1d4ed8);
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
    `,k()}function k(){let e="beginner",t=!1;const i=document.getElementById("modeBeginner"),d=document.getElementById("modeCommercial");i.addEventListener("click",()=>{e="beginner",i.style.borderColor="#2563eb",i.style.boxShadow="0 2px 12px rgba(37,99,235,0.12)",d.style.borderColor="#e2e8f0",d.style.boxShadow="none"}),d.addEventListener("click",()=>{e="commercial",d.style.borderColor="#2563eb",d.style.boxShadow="0 2px 12px rgba(37,99,235,0.12)",i.style.borderColor="#e2e8f0",i.style.boxShadow="none"}),document.getElementById("tabLogin").addEventListener("click",()=>{t=!1,document.getElementById("tabLogin").style.background="white",document.getElementById("tabLogin").style.color="#1a2b3c",document.getElementById("tabLogin").style.boxShadow="0 1px 4px rgba(0,0,0,0.08)",document.getElementById("tabRegister").style.background="transparent",document.getElementById("tabRegister").style.color="#64748b",document.getElementById("tabRegister").style.boxShadow="none",document.getElementById("loginBtn").textContent="Sign In →",document.getElementById("forgotRow").style.display="block",document.getElementById("confirmRow").style.display="none",u()}),document.getElementById("tabRegister").addEventListener("click",()=>{t=!0,document.getElementById("tabRegister").style.background="white",document.getElementById("tabRegister").style.color="#1a2b3c",document.getElementById("tabRegister").style.boxShadow="0 1px 4px rgba(0,0,0,0.08)",document.getElementById("tabLogin").style.background="transparent",document.getElementById("tabLogin").style.color="#64748b",document.getElementById("tabLogin").style.boxShadow="none",document.getElementById("loginBtn").textContent="Create Account →",document.getElementById("forgotRow").style.display="none",document.getElementById("confirmRow").style.display="block",u()}),document.getElementById("togglePw").addEventListener("click",()=>{const n=document.getElementById("loginPassword");n.type=n.type==="password"?"text":"password"}),document.getElementById("forgotBtn").addEventListener("click",async()=>{const n=document.getElementById("loginEmail").value.trim();if(!n){s("Enter your email first.");return}try{const o=await fetch(`${m}/api/auth/forgot-password`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n})});f("success","📧 Reset link request processed. Check your inbox if registered.")}catch{s("Unable to send reset request.")}}),document.getElementById("loginBtn").addEventListener("click",async()=>{var l,h;const n=document.getElementById("loginEmail").value.trim(),o=document.getElementById("loginPassword").value,r=(l=document.getElementById("loginConfirm"))==null?void 0:l.value,p=(h=document.getElementById("tncCheckbox"))==null?void 0:h.checked;if(!n||!o){s("Please fill in all fields.");return}if(t){if(o!==r){s("Passwords do not match.");return}if(o.length<6){s("Password must be at least 6 characters.");return}if(!p){s("You must agree to the Terms & Conditions.");return}}y(!0),u();try{if(t){const c=await fetch(`${m}/api/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:o,mode:e})}),a=await c.json();if(!c.ok||a.ok===!1)throw new Error(a.error||"Registration failed");f("success","🎉 Account created! Please sign in."),document.getElementById("tabLogin").click()}else{const c=await fetch(`${m}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:o})}),a=await c.json();if(!c.ok||a.ok===!1)throw new Error(a.error||"Invalid email or password");localStorage.setItem("token",a.token);const v={uid:a.user.email,email:a.user.email};await w(a.user.mode,v,!1)}}catch(c){s(c.message||"Something went wrong. Please try again.")}finally{y(!1)}}),document.getElementById("guestBtn").addEventListener("click",async()=>{u();const n=prompt("Enter Demo Access Code to continue as Guest:");if(n!==null){if(n!==b){s("Incorrect Demo Access Code.");return}y(!0);try{let o=await fetch(`${m}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:x,password:b})}),r=await o.json();if(!o.ok&&r.error==="User not found"){if(console.log("[LoginPage] Demo account missing. Auto-creating..."),!(await fetch(`${m}/api/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:x,password:b,mode:e})})).ok)throw new Error("Failed to auto-create demo account");o=await fetch(`${m}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:x,password:b})}),r=await o.json()}if(!o.ok||r.ok===!1)throw new Error(r.error||"Guest login failed");localStorage.setItem("token",r.token);const p={uid:r.user.email,email:r.user.email};await w(e,p,!0)}catch(o){f("error","Demo mode unavailable. Please sign in or register."),console.warn("[LoginPage] Guest login error:",o)}finally{y(!1)}}})}async function w(e,t,i){var n,o;localStorage.removeItem("user_farms"),localStorage.removeItem("farm_profile"),g.mode=e,g.isGuest=i,g.uid=t.uid,g.userEmail=t.email||"",g.userName=i?"Guest":t.displayName||((n=t.email)==null?void 0:n.split("@")[0])||"Farmer",localStorage.setItem("seeddown_mode",e);try{const r=localStorage.getItem("token"),l=await(await fetch(`${m}/api/farms`,{method:"GET",headers:{Authorization:`Bearer ${r}`}})).json();l.ok&&((o=l.farms)!=null&&o.length)?localStorage.setItem("user_farms",JSON.stringify(l.farms)):localStorage.setItem("user_farms",JSON.stringify([]))}catch(r){console.warn("[LoginPage] Could not load backend data, fallback to empty:",r),localStorage.setItem("user_farms",JSON.stringify([]))}const d=i?"👀 Welcome, Guest!":`👋 Welcome, ${g.userName}!`;f("success",d),E("farmlist")}function y(e){const t=document.getElementById("loginBtn"),i=document.getElementById("guestBtn");t&&(t.disabled=e,i.disabled=e,t.style.opacity=e?"0.6":"1",i.style.opacity=e?"0.4":"1",e&&(t.textContent="Please wait…"))}function s(e){const t=document.getElementById("loginError");t&&(t.textContent=e,t.style.display="block")}function u(){const e=document.getElementById("loginError");e&&(e.style.display="none")}export{C as render};
