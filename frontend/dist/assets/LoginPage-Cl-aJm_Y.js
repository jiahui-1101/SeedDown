import{a as l,A as r,s as y}from"./index-JYAZ7EKD.js";import{i as f,g as x,l as w}from"./firebase-CFo32-pk.js";import"https://esm.sh/three@0.160.0";async function b(){return await f(),x()}function k(){const e=document.getElementById("screenContainer");e.innerHTML=`
        <div class="screen active" id="loginScreen" style="
            background: linear-gradient(160deg, #f0fdf4 0%, #eff6ff 100%);
            display:flex; flex-direction:column; justify-content:center;
            min-height:100vh; padding:0;
        ">
            <div style="flex:1; padding:36px 24px; display:flex; flex-direction:column; justify-content:center; max-width:420px; margin:0 auto; width:100%;">

                <!-- LOGO -->
                <div style="text-align:center; margin-bottom:36px;">
                    <div style="font-size:3rem; margin-bottom:8px;">🌿</div>
                    <div style="font-size:1.6rem; font-weight:800; color:#1a2b3c; letter-spacing:-0.5px;">SeedDown</div>
                    <div style="font-size:0.75rem; color:#64748b; margin-top:4px; letter-spacing:0.05em;">SMART FARM MANAGEMENT</div>
                </div>

                <!-- MODE SELECTOR -->
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

                <!-- LOGIN CARD -->
                <div style="background:white; border-radius:20px; padding:24px; box-shadow:0 4px 24px rgba(0,0,0,0.07); border:1px solid #e2e8f0;">

                    <!-- TAB -->
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

                    <!-- EMAIL -->
                    <div style="margin-bottom:12px;">
                        <label style="font-size:0.7rem; font-weight:700; color:#374151; display:block; margin-bottom:6px;">Email</label>
                        <input type="email" id="loginEmail" placeholder="farmer@email.com" style="
                            width:100%; padding:11px 14px; border-radius:10px;
                            border:1.5px solid #e2e8f0; font-size:0.85rem;
                            outline:none; font-family:inherit; color:#1a2b3c;
                            box-sizing:border-box; transition:border-color 0.15s;
                        " onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e2e8f0'">
                    </div>

                    <!-- PASSWORD -->
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

                    <!-- FORGOT (sign in only) -->
                    <div id="forgotRow" style="text-align:right; margin-bottom:16px;">
                        <button id="forgotBtn" style="
                            background:none; border:none; font-size:0.7rem;
                            color:#2563eb; cursor:pointer; font-weight:600;
                        ">Forgot password?</button>
                    </div>

                    <!-- CONFIRM PASSWORD (register only) -->
                    <div id="confirmRow" style="display:none; margin-bottom:16px;">
                        <label style="font-size:0.7rem; font-weight:700; color:#374151; display:block; margin-bottom:6px;">Confirm Password</label>
                        <input type="password" id="loginConfirm" placeholder="••••••••" style="
                            width:100%; padding:11px 14px; border-radius:10px;
                            border:1.5px solid #e2e8f0; font-size:0.85rem;
                            outline:none; font-family:inherit; color:#1a2b3c;
                            box-sizing:border-box; transition:border-color 0.15s;
                        " onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e2e8f0'">
                    </div>

                    <!-- ERROR -->
                    <div id="loginError" style="
                        display:none; background:#fef2f2; border:1px solid #fecaca;
                        border-radius:8px; padding:10px 12px; margin-bottom:12px;
                        font-size:0.75rem; color:#dc2626;
                    "></div>

                    <!-- MAIN BUTTON -->
                    <button id="loginBtn" style="
                        width:100%; padding:13px; border:none; border-radius:12px;
                        background:linear-gradient(135deg, #2563eb, #1d4ed8);
                        color:white; font-weight:700; font-size:0.9rem; cursor:pointer;
                        box-shadow:0 4px 12px rgba(37,99,235,0.3);
                        transition:opacity 0.2s; margin-bottom:12px;
                    ">Sign In →</button>

                    <!-- GUEST BUTTON -->
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
    `,h()}function h(){let e="beginner",t=!1;const n=document.getElementById("modeBeginner"),a=document.getElementById("modeCommercial");n.addEventListener("click",()=>{e="beginner",n.style.borderColor="#2563eb",n.style.boxShadow="0 2px 12px rgba(37,99,235,0.12)",a.style.borderColor="#e2e8f0",a.style.boxShadow="none"}),a.addEventListener("click",()=>{e="commercial",a.style.borderColor="#2563eb",a.style.boxShadow="0 2px 12px rgba(37,99,235,0.12)",n.style.borderColor="#e2e8f0",n.style.boxShadow="none"}),document.getElementById("tabLogin").addEventListener("click",()=>{t=!1,document.getElementById("tabLogin").style.background="white",document.getElementById("tabLogin").style.color="#1a2b3c",document.getElementById("tabLogin").style.boxShadow="0 1px 4px rgba(0,0,0,0.08)",document.getElementById("tabRegister").style.background="transparent",document.getElementById("tabRegister").style.color="#64748b",document.getElementById("tabRegister").style.boxShadow="none",document.getElementById("loginBtn").textContent="Sign In →",document.getElementById("forgotRow").style.display="block",document.getElementById("confirmRow").style.display="none",m()}),document.getElementById("tabRegister").addEventListener("click",()=>{t=!0,document.getElementById("tabRegister").style.background="white",document.getElementById("tabRegister").style.color="#1a2b3c",document.getElementById("tabRegister").style.boxShadow="0 1px 4px rgba(0,0,0,0.08)",document.getElementById("tabLogin").style.background="transparent",document.getElementById("tabLogin").style.color="#64748b",document.getElementById("tabLogin").style.boxShadow="none",document.getElementById("loginBtn").textContent="Create Account →",document.getElementById("forgotRow").style.display="none",document.getElementById("confirmRow").style.display="block",m()}),document.getElementById("togglePw").addEventListener("click",()=>{const o=document.getElementById("loginPassword");o.type=o.type==="password"?"text":"password"}),document.getElementById("forgotBtn").addEventListener("click",async()=>{const o=document.getElementById("loginEmail").value.trim();if(!o){d("Enter your email first.");return}try{await(await b()).sendPasswordResetEmail(o),l("success","📧 Reset email sent! Check your inbox.")}catch(i){d(u(i.code))}}),document.getElementById("loginBtn").addEventListener("click",async()=>{var g;const o=document.getElementById("loginEmail").value.trim(),i=document.getElementById("loginPassword").value,c=(g=document.getElementById("loginConfirm"))==null?void 0:g.value;if(!o||!i){d("Please fill in all fields.");return}if(t&&i!==c){d("Passwords do not match.");return}if(i.length<6){d("Password must be at least 6 characters.");return}p(!0),m();try{const s=await b();t?(await s.createUserWithEmailAndPassword(o,i),l("success","🎉 Account created!")):await s.signInWithEmailAndPassword(o,i),await E(e,s.currentUser)}catch(s){d(u(s.code))}finally{p(!1)}}),document.getElementById("guestBtn").addEventListener("click",()=>{r.mode=e,r.userEmail="guest@demo.com",r.userName="Guest",r.isGuest=!0,r.uid=null,l("info","👀 Viewing as Guest — data is simulated"),y("farmlist")})}async function E(e,t){var n,a;r.mode=e,r.isGuest=!1,r.uid=t.uid,r.userEmail=t.email||"",r.userName=t.displayName||((n=t.email)==null?void 0:n.split("@")[0])||"Farmer";try{const o=await w(t.uid);o&&((a=o.farms)!=null&&a.length&&localStorage.setItem("user_farms",JSON.stringify(o.farms)),o.globalProfile&&localStorage.setItem("farm_profile",JSON.stringify(o.globalProfile)),o.farmProfiles&&Object.entries(o.farmProfiles).forEach(([i,c])=>{localStorage.setItem(`farm_profile_${i}`,JSON.stringify(c))}))}catch(o){console.warn("[LoginPage] Could not load Firestore data:",o)}l("success",`👋 Welcome, ${r.userName}!`),y("farmlist")}function p(e){const t=document.getElementById("loginBtn"),n=document.getElementById("guestBtn");t&&(t.disabled=e,n.disabled=e,t.style.opacity=e?"0.6":"1",n.style.opacity=e?"0.4":"1",e&&(t.textContent="Please wait…"))}function d(e){const t=document.getElementById("loginError");t&&(t.textContent=e,t.style.display="block")}function m(){const e=document.getElementById("loginError");e&&(e.style.display="none")}function u(e){return{"auth/user-not-found":"No account found with this email.","auth/wrong-password":"Incorrect password. Try again.","auth/email-already-in-use":"This email is already registered.","auth/invalid-email":"Please enter a valid email address.","auth/weak-password":"Password must be at least 6 characters.","auth/too-many-requests":"Too many attempts. Please try again later.","auth/network-request-failed":"Network error. Check your connection.","auth/invalid-credential":"Invalid email or password."}[e]||"Something went wrong. Please try again."}export{k as render};
