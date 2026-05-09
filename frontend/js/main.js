import { AppState, initTiles } from "./store.js";
import { FarmCanvas } from "./components/FarmCanvas.js";
import { SensorStrip } from "./components/SensorStrip.js";
import { NpcAdvisor } from "./components/NpcAdvisor.js";
import { Community } from "./components/Community.js";
import { initNavigation } from "./utils/navigation.js";
import { IotSimulator } from "./services/IotSimulator.js";
import { initAiChat } from "./services/AiChatService.js";
import { showToast } from "./utils/toast.js";

AppState.tiles = initTiles();

const pages = {
<<<<<<< HEAD
    splash: () => import('./pages/SplashPage.js').then(m => m.render()),
    login: () => import('./pages/LoginPage.js').then(m => m.render()),
    farmlist: () => import('./pages/FarmListPage.js').then(m => m.render()),
    home: () => import('./pages/HomePage.js').then(m => m.render()),
    'dash-c': () => import('./pages/CommercialPage.js').then(m => m.render()),
    community: () => import('./pages/CommunityPage.js').then(m => m.render()),
   feature: (params) => import('./pages/FeaturePage.js').then(m => m.render(params)),
    'sensor-detail': (p) => import('./pages/SensorDetailPage.js').then(m => m.render(p)),
    profile: () => import('./pages/ProfilePage.js').then(m => m.render()),
    'alert-detail': (params) => import('./pages/AlertDetailPage.js').then(m => { m.render(params); m.init?.(); }),
=======
  splash: () => import("./pages/SplashPage.js").then((m) => m.render()),
  login: () => import("./pages/LoginPage.js").then((m) => m.render()),
  farmlist: () => import("./pages/FarmListPage.js").then((m) => m.render()),
  buildfarm: () =>
    import("./pages/BuildFarmPage.js?v=3d-esm-1").then((m) => m.render()),

  home: () => import("./pages/HomePage.js").then((m) => m.render()),
  "dash-c": () => import("./pages/CommercialPage.js").then((m) => m.render()),
  community: () => import("./pages/CommunityPage.js").then((m) => m.render()),
  feature: (params) =>
    import("./pages/FeaturePage.js").then((m) => m.render(params)),
  "sensor-detail": (p) =>
    import("./pages/SensorDetailPage.js").then((m) => m.render(p)),
  profile: () => import("./pages/ProfilePage.js").then((m) => m.render()),
  "alert-detail": (p) =>
    import("./pages/AlertDetailPage.js").then((m) => m.render(p)),
  "whatif-pro": () =>
    import("./pages/WhatIfPro.js").then((m) => m.renderScreen()),
>>>>>>> eb8bb537e5661b46270184d4bc107b1b1f1c3830
};

document.addEventListener("DOMContentLoaded", () => {
  FarmCanvas.init("farmCanvas"); // safe if canvas not yet in DOM
  SensorStrip.init();
  NpcAdvisor.init();
  Community.init();
  IotSimulator.start(5000);
  initAiChat();
  initNavigation(pages);
  import("./pages/SplashPage.js").then((m) => m.render());
  window.showToast = showToast;
});
