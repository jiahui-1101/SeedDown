import{a as f,A as l,s as E}from"./index-BtjAULjs.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const u="demo@seeddown.com",x="seeddown2026",m=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function C(){const e=document.getElementById("screenContainer");e.innerHTML=`
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
                                I agree to the <span style="color:#0f766e; font-weight:600; text-decoration:underline;">Terms & Conditions</span> and <span style="color:#0f766e; font-weight:600; text-decoration:underline;">Privacy Policy</span>. I consent to the collection and use of my farm data for AI analysis.
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
    `,k()}function k(){let e="beginner",o=!1;const r=document.getElementById("modeBeginner"),a=document.getElementById("modeCommercial");r.addEventListener("click",()=>{e="beginner",r.style.borderColor="#0f766e",r.style.boxShadow="0 2px 12px rgba(15,118,110,0.12)",a.style.borderColor="#e2e8f0",a.style.boxShadow="none"}),a.addEventListener("click",()=>{e="commercial",a.style.borderColor="#0f766e",a.style.boxShadow="0 2px 12px rgba(15,118,110,0.12)",r.style.borderColor="#e2e8f0",r.style.boxShadow="none"}),document.getElementById("tabLogin").addEventListener("click",()=>{o=!1,document.getElementById("tabLogin").style.background="white",document.getElementById("tabLogin").style.color="#1a2b3c",document.getElementById("tabLogin").style.boxShadow="0 1px 4px rgba(0,0,0,0.08)",document.getElementById("tabRegister").style.background="transparent",document.getElementById("tabRegister").style.color="#64748b",document.getElementById("tabRegister").style.boxShadow="none",document.getElementById("loginBtn").textContent="Sign In →",document.getElementById("forgotRow").style.display="block",document.getElementById("confirmRow").style.display="none",b()}),document.getElementById("tabRegister").addEventListener("click",()=>{o=!0,document.getElementById("tabRegister").style.background="white",document.getElementById("tabRegister").style.color="#1a2b3c",document.getElementById("tabRegister").style.boxShadow="0 1px 4px rgba(0,0,0,0.08)",document.getElementById("tabLogin").style.background="transparent",document.getElementById("tabLogin").style.color="#64748b",document.getElementById("tabLogin").style.boxShadow="none",document.getElementById("loginBtn").textContent="Create Account →",document.getElementById("forgotRow").style.display="none",document.getElementById("confirmRow").style.display="block",b()}),document.getElementById("togglePw").addEventListener("click",()=>{const t=document.getElementById("loginPassword");t.type=t.type==="password"?"text":"password"}),document.getElementById("forgotBtn").addEventListener("click",async()=>{const t=document.getElementById("loginEmail").value.trim();if(!t){c("Enter your email first.");return}try{const n=await fetch(`${m}/api/auth/forgot-password`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})});f("success","📧 Reset link request processed. Check your inbox if registered.")}catch{c("Unable to send reset request.")}}),document.getElementById("loginBtn").addEventListener("click",async()=>{var g,h;const t=document.getElementById("loginEmail").value.trim(),n=document.getElementById("loginPassword").value,s=(g=document.getElementById("loginConfirm"))==null?void 0:g.value,y=(h=document.getElementById("tncCheckbox"))==null?void 0:h.checked;if(!t||!n){c("Please fill in all fields.");return}if(o){if(n!==s){c("Passwords do not match.");return}if(n.length<6){c("Password must be at least 6 characters.");return}if(!y){c("You must agree to the Terms & Conditions.");return}}p(!0),b();try{if(o){const d=await fetch(`${m}/api/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:n,mode:e})}),i=await d.json();if(!d.ok||i.ok===!1)throw new Error(i.error||"Registration failed");f("success","🎉 Account created! Please sign in."),document.getElementById("tabLogin").click()}else{const d=await fetch(`${m}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:n})}),i=await d.json();if(!d.ok||i.ok===!1)throw new Error(i.error||"Invalid email or password");localStorage.setItem("token",i.token);const v={uid:i.user.email,email:i.user.email};await w(i.user.mode,v,!1)}}catch(d){c(d.message||"Something went wrong. Please try again.")}finally{p(!1)}}),document.getElementById("guestBtn").addEventListener("click",async()=>{b(),p(!0);try{let t=await fetch(`${m}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:u,password:x})}),n=await t.json();if(!t.ok&&n.error==="User not found"){if(console.log("[LoginPage] Demo account missing. Auto-creating..."),!(await fetch(`${m}/api/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:u,password:x,mode:e})})).ok)throw new Error("Failed to auto-create demo account");t=await fetch(`${m}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:u,password:x})}),n=await t.json()}if(!t.ok||n.ok===!1)throw new Error(n.error||"Guest login failed");localStorage.setItem("token",n.token);const s={uid:n.user.email,email:n.user.email};await w(e,s,!0)}catch(t){f("error","Demo mode unavailable. Please sign in or register."),console.warn("[LoginPage] Guest login error:",t)}finally{p(!1)}})}async function w(e,o,r){var t,n;localStorage.removeItem("user_farms"),localStorage.removeItem("farm_profile"),l.mode=e,l.isGuest=r,l.uid=o.uid,l.userEmail=o.email||"",l.userName=r?"Guest":o.displayName||((t=o.email)==null?void 0:t.split("@")[0])||"Farmer",localStorage.setItem("seeddown_mode",e);try{const s=localStorage.getItem("token"),g=await(await fetch(`${m}/api/farms`,{method:"GET",headers:{Authorization:`Bearer ${s}`}})).json();g.ok&&((n=g.farms)!=null&&n.length)?localStorage.setItem("user_farms",JSON.stringify(g.farms)):localStorage.setItem("user_farms",JSON.stringify([]))}catch(s){console.warn("[LoginPage] Could not load backend data, fallback to empty:",s),localStorage.setItem("user_farms",JSON.stringify([]))}const a=r?"👀 Welcome, Guest!":`👋 Welcome, ${l.userName}!`;f("success",a),l.notify(),E("farmlist")}function p(e){const o=document.getElementById("loginBtn"),r=document.getElementById("guestBtn");o&&(o.disabled=e,r.disabled=e,o.style.opacity=e?"0.6":"1",r.style.opacity=e?"0.4":"1",e&&(o.textContent="Please wait…"))}function c(e){const o=document.getElementById("loginError");o&&(o.textContent=e,o.style.display="block")}function b(){const e=document.getElementById("loginError");e&&(e.style.display="none")}export{C as render};
