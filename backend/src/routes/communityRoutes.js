const express = require('express');
const router = express.Router();
const { getDb, FieldValue } = require('../config/db');

// ──────────────────────────────────────────────────────────
//  NPC Templates (pure memory, zero Firebase cost)
// ──────────────────────────────────────────────────────────
const NPC_TEMPLATES = [
    { id:'npc_0', name:'Aisha.Farm',     avatar:'👩‍🌾', farmLayout:['🍅','🍅','🌿',null,'🌿',null,'🌱',null,'🌶️'] },
    { id:'npc_1', name:'Botani_Master',  avatar:'👨‍🌾', farmLayout:['🌿','🌿',null,'🥬','🌱',null,null,'🌿',null] },
    { id:'npc_2', name:'GreenThumb99',   avatar:'🧑‍🌾', farmLayout:[null,'🥬',null,'🌿',null,'🌱',null,null,'🌿'] },
    { id:'npc_3', name:'UTM_Agri',       avatar:'🏫',   farmLayout:['🌶️','🌶️','🌶️',null,'🌱',null,'🥕',null,'🥕'] },
    { id:'npc_4', name:'CityPlanter',    avatar:'🏙️',   farmLayout:['🍅','🥬','🌶️',null,null,null,'🌿','🌱',null] },
];

function computeState(hoursOffline) {
    return {
        isThirsty:    hoursOffline >= 5,
        bugCount:     hoursOffline >= 18 ? 2 : hoursOffline >= 16 ? 1 : 0,
        hoursOffline: Math.floor(hoursOffline),
    };
}

// ── GET /me ──────────────────────────────────────────────
router.get('/me', async (req, res) => {
    try {
        const db  = getDb();
        const ref = db.collection('users').doc('my_account');
        const doc = await ref.get();
        if (!doc.exists) {
            const newUser = { userId:'my_account', coins:100, createdAt:new Date() };
            await ref.set(newUser);
            return res.json(newUser);
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /visits/neighbors ─────────────────────────────────
// Close-loop: only users with hasFarm=true appear here.
// Fills up to 5 with NPCs (no DB cost).
router.get('/visits/neighbors', async (req, res) => {
    try {
        const db  = getDb();
        const now = Date.now();

        const snapshot = await db.collection('users')
            .where('hasFarm', '==', true)
            .limit(20).get();

        const realFarms = snapshot.docs.map(doc => {
            const data = doc.data();
            const lastActive = data.lastActiveAt ? data.lastActiveAt.toDate().getTime() : now;
            const hoursOffline = (now - lastActive) / (1000 * 60 * 60);
            return {
                id: doc.id,
                name:       data.displayName || data.name || 'Farmer',
                avatar:     data.avatar      || '🧑‍🌾',
                farmLayout: data.farmLayout  || Array(9).fill(null),
                isNPC:      false,
                ...computeState(hoursOffline),
            };
        });

        const result = [...realFarms];
        let npcIdx = 0;
        while (result.length < 5 && npcIdx < NPC_TEMPLATES.length) {
            const tpl = NPC_TEMPLATES[npcIdx++];
            const randomHours = Math.floor(Math.random() * 23);
            result.push({ ...tpl, isNPC:true, ...computeState(randomHours) });
        }

        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST /visits/interact/:farmId ─────────────────────────
router.post('/visits/interact/:farmId', async (req, res) => {
    try {
        const { action } = req.body; // 'water' | 'catch_bug'
        const { farmId } = req.params;
        const reward = action === 'catch_bug' ? 10 : 5;
        const db     = getDb();
        const meRef  = db.collection('users').doc('my_account');

        if (farmId.startsWith('npc_')) {
            await meRef.update({ coins: FieldValue.increment(reward) });
            const meDoc = await meRef.get();
            return res.json({ success:true, isNPC:true, earned:reward, newTotal:meDoc.data().coins });
        }

        const farmRef = db.collection('users').doc(farmId);
        const isSelf  = farmId === 'my_account';
        await farmRef.update({ lastActiveAt: new Date() });
        await meRef.update({ coins: FieldValue.increment(reward) });
        if (!isSelf) {
            await farmRef.update({
                notifications: FieldValue.arrayUnion({
                    from: 'my_account', type: action, read: false,
                    message: action === 'water' ? '💧 A neighbor watered your farm!' : '🦾 A neighbor caught a bug!',
                    createdAt: new Date(),
                }),
            });
        }
        const meDoc = await meRef.get();
        res.json({ success:true, isSelf, earned:reward, newTotal:meDoc.data().coins });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST /visits/register-farm ────────────────────────────
// Called from BuildFarmPage after setup is complete.
router.post('/visits/register-farm', async (req, res) => {
    try {
        const { farmLayout, displayName, avatar } = req.body;
        const db = getDb();
        await db.collection('users').doc('my_account').set({
            hasFarm:      true,
            farmLayout:   farmLayout  || Array(9).fill(null),
            displayName:  displayName || 'My Farm',
            avatar:       avatar      || '🧑‍🌾',
            lastActiveAt: new Date(),
        }, { merge: true });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── SOS POSTS ─────────────────────────────────────────────
router.post('/posts/sos', async (req, res) => {
    try {
        const db = getDb();
        const { author, title, content, image } = req.body;
        const docRef = await db.collection('posts').add({
            type:'sos', author:author||'Anonymous', title, content,
            image:image||null, comments:[], likes:0, status:'active', createdAt:new Date(),
        });
        res.json({ success:true, id:docRef.id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/posts', async (req, res) => {
    try {
        const db   = getDb();
        const snap = await db.collection('posts').orderBy('createdAt','desc').get();
        res.json(snap.docs.map(doc => {
            const d = doc.data();
            return { id:doc.id, ...d, createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt };
        }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/posts/:postId/comments', async (req, res) => {
    try {
        const db = getDb();
        const { text, author } = req.body;
        await db.collection('posts').doc(req.params.postId).update({
            comments: FieldValue.arrayUnion({ author:author||'User', text, createdAt:new Date() }),
        });
        res.json({ success:true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/posts/:postId/like', async (req, res) => {
    try {
        const db = getDb();
        await db.collection('posts').doc(req.params.postId).update({ likes: FieldValue.increment(1) });
        res.json({ success:true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/posts/:postId', async (req, res) => {
    try {
        const db = getDb();
        await db.collection('posts').doc(req.params.postId).delete();
        res.json({ success:true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/posts/:postId/reward', async (req, res) => {
    try {
        const db  = getDb();
        const { amount } = req.body;
        const ref = db.collection('users').doc('my_account');
        const doc = await ref.get();
        if (doc.data().coins < amount) return res.status(400).json({ message:'Not enough coins!' });
        await ref.update({ coins: FieldValue.increment(-amount) });
        res.json({ success:true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── BARTER BOARD ──────────────────────────────────────────
async function seedBarterDatabase() {
    try {
        const db  = getDb();
        const col = db.collection('barterItems');
        if (!(await col.limit(1).get()).empty) return;
        const seeds = [
            { title:'Ugly Veggie Box',       tradeType:'both',   priceCoins:30, lookingFor:'Mint',          location:'College Hall A',   author:'Aisha.Farm',    status:'available', buyer:null, image:null, createdAt:new Date().toISOString() },
            { title:'Fresh Mint Bundle',     tradeType:'barter', priceCoins:0,  lookingFor:'Basil',         location:'Library Lobby',    author:'Botani_Master', status:'available', buyer:null, image:null, createdAt:new Date().toISOString() },
            { title:'Chili Seedlings x10',   tradeType:'coins',  priceCoins:20, lookingFor:'',              location:'Block N Courtyard',author:'UTM_Agri',      status:'available', buyer:null, image:null, createdAt:new Date().toISOString() },
            { title:'Homemade Compost 2kg',  tradeType:'both',   priceCoins:15, lookingFor:'Chili Seedlings',location:'Dorm Block C',    author:'GreenThumb99',  status:'available', buyer:null, image:null, createdAt:new Date().toISOString() },
            { title:'Cherry Tomatoes 500g',  tradeType:'coins',  priceCoins:25, lookingFor:'',              location:'Cafeteria',        author:'Aisha.Farm',    status:'available', buyer:null, image:null, createdAt:new Date().toISOString() },
            { title:'Basil Pesto Homemade',  tradeType:'barter', priceCoins:0,  lookingFor:'Fresh Mint Bundle',location:'Student Union', author:'GreenThumb99',  status:'available', buyer:null, image:null, createdAt:new Date().toISOString() },
            { title:'Watering Can 2L',       tradeType:'both',   priceCoins:40, lookingFor:'Compost',       location:'Eng Faculty',      author:'Botani_Master', status:'available', buyer:null, image:null, createdAt:new Date().toISOString() },
        ];
        const batch = db.batch();
        seeds.forEach(s => batch.set(col.doc(), s));
        await batch.commit();
        console.log('✅ Barter seeded');
    } catch (e) { console.error('Barter seed error:', e.message); }
}

router.post('/barter/seed', async (req, res) => { await seedBarterDatabase(); res.json({ success:true }); });

router.get('/barter', async (req, res) => {
    try {
        const db   = getDb();
        const snap = await db.collection('barterItems').orderBy('createdAt','desc').get();
        let items  = snap.docs.map(d => ({ id:d.id, ...d.data() }));
        const { search } = req.query;
        if (search) { const kw = search.toLowerCase(); items = items.filter(i => i.title.toLowerCase().includes(kw)); }
        res.json(items);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/barter', async (req, res) => {
    try {
        const db = getDb();
        const { author, title, description, image, tradeType, priceCoins, lookingFor, location } = req.body;
        const docRef = await db.collection('barterItems').add({ author:author||'MyFarm', title, description, image, tradeType, priceCoins, lookingFor, location, status:'available', buyer:null, createdAt:new Date().toISOString() });
        let matchFound = null;
        if (tradeType === 'barter' || tradeType === 'both') {
            const ms = await db.collection('barterItems').where('status','==','available').where('title','==',lookingFor).limit(1).get();
            if (!ms.empty) matchFound = { id:ms.docs[0].id, ...ms.docs[0].data() };
        }
        res.json({ success:true, id:docRef.id, matchFound });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/barter/:id/reserve', async (req, res) => {
    try {
        const db      = getDb();
        const itemRef = db.collection('barterItems').doc(req.params.id);
        const item    = (await itemRef.get()).data();
        if (item.status !== 'available') return res.status(400).json({ message:'Item no longer available' });
        if (req.body.paymentMethod === 'coins') {
            const uRef = db.collection('users').doc('my_account');
            const uDoc = await uRef.get();
            if (uDoc.data().coins < item.priceCoins) return res.status(400).json({ message:'Not enough coins!' });
            await uRef.update({ coins: FieldValue.increment(-item.priceCoins) });
        }
        await itemRef.update({ status:'reserved', buyer: req.body.buyer||'MyFarm' });
        res.json({ success:true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/barter/:id/complete', async (req, res) => {
    try {
        const db = getDb();
        await db.collection('barterItems').doc(req.params.id).update({ status:'completed' });
        res.json({ success:true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = { router, seedBarterDatabase };
