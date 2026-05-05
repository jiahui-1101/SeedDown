'use strict';

/* ============================================================
   MODULE: STATE & NAVIGATION ROUTING
   PLACEHOLDER: Toggle mode (CHRIST)
   ============================================================ */
const STATE = {
  mode: 'beginner',   // 'beginner' | 'commercial'
  farmName: 'Farm 1 — Rack Alpha',
  currentScreen: 's-splash',
  prevScreen: 's-splash',

  tiles: [
    {id:0, plant:'🥬', name:'Lettuce', status:'healthy', growth:78, days:7},
    {id:1, plant:'🌿', name:'Spinach', status:'warning', growth:55, days:12},
    {id:2, plant:'🌱', name:'Basil',   status:'ready',   growth:100,days:0},
    {id:3, plant:'🍅', name:'Tomato',  status:'danger',  growth:40, days:20},
    {id:4, plant:'🌿', name:'Mint',    status:'healthy', growth:62, days:9},
    {id:5, plant:'🌶️', name:'Chili',   status:'healthy', growth:33, days:18},
    {id:6, plant:null, name:null,      status:'empty',   growth:0,  days:0},
    {id:7, plant:null, name:null,      status:'empty',   growth:0,  days:0},
    {id:8, plant:null, name:null,      status:'empty',   growth:0,  days:0},
    {id:9, plant:null, name:null,      status:'empty',   growth:0,  days:0},
    {id:10,plant:null, name:null,      status:'empty',   growth:0,  days:0},
    {id:11,plant:null, name:null,      status:'empty',   growth:0,  days:0},
  ],

  sensors: {
    temp: {val:34.2, unit:'°C', status:'danger'},
    humid:{val:68,   unit:'%',  status:'ok'},
    light:{val:82,   unit:'%',  status:'ok'},
    ph:   {val:6.2,  unit:'pH', status:'ok'},
    water:{val:22,   unit:'%',  status:'warning'},
    nutrient:{val:78,unit:'%',  status:'ok'},
  },

  addPlant: { selectedCropIndex: null, selectedTileId: null },
  visitTarget: null,
  chatMessages: [],
};

// Login Flow Routing
function selMode(m) {
  STATE.mode = m;
  document.getElementById('btn-beg').classList.toggle('sel', m==='beginner');
  document.getElementById('btn-com').classList.toggle('sel', m==='commercial');
}

function doLogin() {
  UI.showScreen('s-farmlist');
}

function goDash() {
  if(STATE.mode === 'beginner') { 
    UI.showScreen('s-home'); 
  } else { 
    UI.showScreen('s-dash-c'); 
  }
}

function switchMode() {
  STATE.mode = STATE.mode === 'beginner' ? 'commercial' : 'beginner';
  UI.showToast('success', 'Switched to ' + (STATE.mode==='beginner'?'Beginner 🌱':'Commercial 🏭') + ' mode!');
}

function goBuild() {
  UI.showToast('info', 'BUILD NEW FARM\nTake Photo → Map Sensor → Build!');
}