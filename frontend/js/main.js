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
    splash: () => import("./pages/SplashPage.js").then((m) => m.render()),
    login: () => import("./pages/LoginPage.js").then((m) => m.render()),
    farmlist: () => import("./pages/FarmListPage.js").then((m) => m.render()),
    
   
    buildfarm: () => import("./pages/BuildFarmPage.js?v=3d-esm-1").then((m) => m.render()),

    home: () => import("./pages/HomePage.js").then((m) => m.render()),
    "dash-c": () => import("./pages/CommercialPage.js").then((m) => m.render()),
    community: () => import("./pages/CommunityPage.js").then((m) => m.render()),
    feature: (params) => import("./pages/FeaturePage.js").then((m) => m.render(params)),
    "sensor-detail": (p) => import("./pages/SensorDetailPage.js").then((m) => m.render(p)),
    profile: () => import("./pages/ProfilePage.js").then((m) => m.render()),
    "profit-detail": () => import("./pages/ProfitDetailPage.js").then((m) => m.render()),
    "energy-detail": () => import("./pages/EnergyDetailPage.js").then((m) => m.render()),
    // 💡 保留你辛苦修好的 alert-detail，带 init 的
    "alert-detail": (params) => import("./pages/AlertDetailPage.js").then((m) => { 
        m.render(params); 
        m.init?.(); 
    }),

    // 💡 这是你待会要做的 Pro Feature 页面
    "whatif-pro": () => import("./pages/WhatIfPro.js").then((m) => m.renderScreen()),
};

document.addEventListener("DOMContentLoaded", () => {
    FarmCanvas.init("farmCanvas");
    SensorStrip.init();
    NpcAdvisor.init();
    Community.init();
    IotSimulator.start(5000);
    initAiChat();
    
    // 初始化导航
    initNavigation(pages);
    
    // 渲染初始页面
    import("./pages/SplashPage.js").then((m) => m.render());
    window.showToast = showToast;
});