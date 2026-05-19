/* ============================================================
   firebase.js — shared Firebase init+ Firestore helper
   ============================================================ */

  const firebaseConfig = {
    apiKey: "AIzaSyBZzPlnCEvgSx-NEiza0Pcomb9UFhCOtos",
    authDomain: "nextlevelfarm.firebaseapp.com",
    projectId: "nextlevelfarm",
    storageBucket: "nextlevelfarm.firebasestorage.app",
    messagingSenderId: "326454162545",
    appId: "1:326454162545:web:0da9418c738f04986f97d0",
    measurementId: "G-26HSXPSK3H"
  };

function _loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

export async function initFirebase() {
    if (window._firebaseReady) return;
    await _loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
    await _loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js');
    await _loadScript('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js');
    const firebaseApp = window.firebase;
    if (!firebaseApp) throw new Error('Firebase SDK failed to load');
    if (!firebaseApp.apps.length) firebaseApp.initializeApp(firebaseConfig);
    window._firebaseReady = true;
}

export function getAuth() {
    if (!window.firebase) throw new Error('Firebase is not initialized. Call initFirebase() first.');
    return window.firebase.auth();
}
export function getDb() {
    if (!window.firebase) throw new Error('Firebase is not initialized. Call initFirebase() first.');
    return window.firebase.firestore();
}

/* ── USER DOC REF ── */
export async function userDocRef(uid) {
    await initFirebase();
    return getDb().collection('users').doc(uid);
}

/* ── LOAD ALL USER DATA FROM FIRESTORE ── */
export async function loadUserData(uid) {
    try {
        const ref = await userDocRef(uid);
        const doc = await ref.get();
        if (doc.exists) return doc.data();
        return null;
    } catch (e) {
        console.warn('[Firebase] loadUserData error:', e);
        return null;
    }
}

/* ── SAVE FARMS ARRAY ── */
export async function saveFarmsToFirestore(uid, farms) {
    if (!uid) return;
    try {
        const ref = await userDocRef(uid);
        await ref.set({ farms }, { merge: true });
    } catch (e) {
        console.warn('[Firebase] saveFarmsToFirestore error:', e);
    }
}

/* ── SAVE PER-FARM PROFILE ── */
export async function saveFarmProfileToFirestore(uid, farmId, profileData) {
    if (!uid || !farmId) return;
    try {
        const ref = await userDocRef(uid);
        await ref.set({
            farmProfiles: { [farmId]: profileData }
        }, { merge: true });
    } catch (e) {
        console.warn('[Firebase] saveFarmProfileToFirestore error:', e);
    }
}

/* ── SAVE GLOBAL PROFILE (name/email) ── */
export async function saveGlobalProfileToFirestore(uid, data) {
    if (!uid) return;
    try {
        const ref = await userDocRef(uid);
        await ref.set({ globalProfile: data }, { merge: true });
    } catch (e) {
        console.warn('[Firebase] saveGlobalProfileToFirestore error:', e);
    }
}