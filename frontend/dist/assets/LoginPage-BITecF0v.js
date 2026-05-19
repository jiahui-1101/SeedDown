import{a as g,A as c,_ as v,s as E}from"./index-G-Ja4GjB.js";import{initFirebase as I,getAuth as B}from"./firebase-BieXTIEc.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const h="demo@seeddown.com",f="seeddown2026";async function u(){return await I(),B()}function L(){const e=document.getElementById("screenContainer");e.innerHTML=`
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
    `,k()}function k(){let e="beginner",t=!1;const r=document.getElementById("modeBeginner"),d=document.getElementById("modeCommercial");r.addEventListener("click",()=>{e="beginner",r.style.borderColor="#2563eb",r.style.boxShadow="0 2px 12px rgba(37,99,235,0.12)",d.style.borderColor="#e2e8f0",d.style.boxShadow="none"}),d.addEventListener("click",()=>{e="commercial",d.style.borderColor="#2563eb",d.style.boxShadow="0 2px 12px rgba(37,99,235,0.12)",r.style.borderColor="#e2e8f0",r.style.boxShadow="none"}),document.getElementById("tabLogin").addEventListener("click",()=>{t=!1,document.getElementById("tabLogin").style.background="white",document.getElementById("tabLogin").style.color="#1a2b3c",document.getElementById("tabLogin").style.boxShadow="0 1px 4px rgba(0,0,0,0.08)",document.getElementById("tabRegister").style.background="transparent",document.getElementById("tabRegister").style.color="#64748b",document.getElementById("tabRegister").style.boxShadow="none",document.getElementById("loginBtn").textContent="Sign In →",document.getElementById("forgotRow").style.display="block",document.getElementById("confirmRow").style.display="none",y()}),document.getElementById("tabRegister").addEventListener("click",()=>{t=!0,document.getElementById("tabRegister").style.background="white",document.getElementById("tabRegister").style.color="#1a2b3c",document.getElementById("tabRegister").style.boxShadow="0 1px 4px rgba(0,0,0,0.08)",document.getElementById("tabLogin").style.background="transparent",document.getElementById("tabLogin").style.color="#64748b",document.getElementById("tabLogin").style.boxShadow="none",document.getElementById("loginBtn").textContent="Create Account →",document.getElementById("forgotRow").style.display="none",document.getElementById("confirmRow").style.display="block",y()}),document.getElementById("togglePw").addEventListener("click",()=>{const n=document.getElementById("loginPassword");n.type=n.type==="password"?"text":"password"}),document.getElementById("forgotBtn").addEventListener("click",async()=>{const n=document.getElementById("loginEmail").value.trim();if(!n){s("Enter your email first.");return}try{await(await u()).sendPasswordResetEmail(n),g("success","📧 Reset email sent! Check your inbox.")}catch(o){s(w(o.code))}}),document.getElementById("loginBtn").addEventListener("click",async()=>{var l,p;const n=document.getElementById("loginEmail").value.trim(),o=document.getElementById("loginPassword").value,i=(l=document.getElementById("loginConfirm"))==null?void 0:l.value,a=(p=document.getElementById("tncCheckbox"))==null?void 0:p.checked;if(!n||!o){s("Please fill in all fields.");return}if(t){if(o!==i){s("Passwords do not match.");return}if(o.length<6){s("Password must be at least 6 characters.");return}if(!a){s("You must agree to the Terms & Conditions.");return}}b(!0),y();try{const m=await u();t?(await m.createUserWithEmailAndPassword(n,o),g("success","🎉 Account created!")):await m.signInWithEmailAndPassword(n,o),await x(e,m.currentUser,!1)}catch(m){s(w(m.code))}finally{b(!1)}}),document.getElementById("guestBtn").addEventListener("click",async()=>{y();const n=prompt("Enter Demo Access Code to continue as Guest:");if(n!==null){if(n!==f){s("Incorrect Demo Access Code.");return}b(!0);try{const o=await u();await o.signInWithEmailAndPassword(h,f),await x(e,o.currentUser,!0)}catch(o){if(o.code==="auth/user-not-found"||o.code==="auth/invalid-credential")try{const i=await u();await i.createUserWithEmailAndPassword(h,f),await x(e,i.currentUser,!0)}catch(i){console.warn("[LoginPage] Guest account creation failed:",i),g("error","Demo mode unavailable. Please sign in.")}else g("error","Could not load demo. Please try again."),console.warn("[LoginPage] Guest login error:",o)}finally{b(!1)}}})}async function x(e,t,r){var n,o;c.mode=e,c.isGuest=r,c.uid=t.uid,c.userEmail=t.email||"",c.userName=r?"Guest":t.displayName||((n=t.email)==null?void 0:n.split("@")[0])||"Farmer",localStorage.setItem("seeddown_mode",e);try{const{loadUserData:i}=await v(async()=>{const{loadUserData:l}=await import("./firebase-BieXTIEc.js");return{loadUserData:l}},[]),a=await i(t.uid);a&&((o=a.farms)!=null&&o.length&&localStorage.setItem("user_farms",JSON.stringify(a.farms)),a.globalProfile&&localStorage.setItem("farm_profile",JSON.stringify(a.globalProfile)),a.farmProfiles&&Object.entries(a.farmProfiles).forEach(([l,p])=>{localStorage.setItem(`farm_profile_${l}`,JSON.stringify(p))}))}catch(i){console.warn("[LoginPage] Could not load Firestore data:",i)}const d=r?"👀 Welcome, Guest!":`👋 Welcome, ${c.userName}!`;g("success",d),E("farmlist")}function b(e){const t=document.getElementById("loginBtn"),r=document.getElementById("guestBtn");t&&(t.disabled=e,r.disabled=e,t.style.opacity=e?"0.6":"1",r.style.opacity=e?"0.4":"1",e&&(t.textContent="Please wait…"))}function s(e){const t=document.getElementById("loginError");t&&(t.textContent=e,t.style.display="block")}function y(){const e=document.getElementById("loginError");e&&(e.style.display="none")}function w(e){return{"auth/user-not-found":"No account found with this email.","auth/wrong-password":"Incorrect password. Try again.","auth/email-already-in-use":"This email is already registered.","auth/invalid-email":"Please enter a valid email address.","auth/weak-password":"Password must be at least 6 characters.","auth/too-many-requests":"Too many attempts. Please try again later.","auth/network-request-failed":"Network error. Check your connection.","auth/invalid-credential":"Invalid email or password."}[e]||"Something went wrong. Please try again."}export{L as render};
