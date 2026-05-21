import { AppState, initTiles } from "./store.js";
import { FarmCanvas } from "./components/FarmCanvas.js";
import { SensorStrip } from "./components/SensorStrip.js";
import { NpcAdvisor } from "./components/NpcAdvisor.js";
import { Community } from "./components/Community.js";
import { initNavigation } from "./utils/navigation.js";
import { IotSimulator } from "./services/IotSimulator.js";
import { initAiChat } from "./services/AiChatService.js";
import { showToast } from "./utils/toast.js";

// 初始化全局状态中的瓷砖/网格布局
AppState.tiles = initTiles();

// 核心页面路由映射表
const pages = {
    splash: () => import("./pages/SplashPage.js").then((m) => m.render()),
    login: () => import("./pages/LoginPage.js").then((m) => m.render()),
    farmlist: () => import("./pages/FarmListPage.js").then((m) => m.render()),
    
    // 💡 Jia Hui 新加的智能农场搭建页面
    buildfarm: () => import("./pages/BuildFarmPage.js?v=beginner-commercial-split-2").then((m) => m.render()),

    home: () => import("./pages/HomePage.js").then((m) => m.render()),
    "dash-c": () => import("./pages/CommercialPage.js").then((m) => m.render()),
    control: () => import("./pages/ControlPage.js").then((m) => m.render()),
    disease: () => import("./pages/DiseaseAnalysisPage.js").then((m) => m.render()),
    community: () => import("./pages/CommunityPage.js").then((m) => m.render()),
    feature: (params) => import("./pages/FeaturePage.js").then((m) => m.render(params)),
    
    // 动态传感器详情：自动分流商业版与初学者版
    "sensor-detail": (params) => {
        const isCommercial = params?.from === 'dash-c' || params?.from === 'zone-detail' || params?.mode === 'commercial';
        if (isCommercial) {
            return import("./pages/SensorDetailPageCommercial.js").then((m) => m.render(params));
        }
        return import("./pages/SensorDetailPage.js").then((m) => m.render(params));
    },
    
    "zone-detail": (params) => import("./pages/ZoneDetailPage.js").then((m) => m.render(params)),
    "commercial-detail": (params) => import("./pages/CommercialDetailPage.js").then((m) => m.render(params)),
    "zone-overview": (params) => import("./pages/CommercialPage.js").then((m) => m.render(params)),
    profile: () => import("./pages/ProfilePage.js").then((m) => m.render()),
    "profit-detail": () => import("./pages/ProfitDetailPage.js").then((m) => m.render()),
    "energy-detail": () => import("./pages/EnergyDetailPage.js").then((m) => m.render()),
    
    // 💡 警报详情页：渲染 HTML 后触发事件挂载
    "alert-detail": (params) => import("./pages/AlertDetailPage.js").then((m) => { 
    const html = m.render(params); 
    m.init?.(params);  // ← 加 params
    return html;
}),

    // 💡 策略模拟优化版 Pro Feature 页面
    "whatif-pro": () => import("./pages/WhatIfPro.js").then((m) => m.renderScreen()),

    // 🛰️ Predictive Alert 预测性警报页面（拆分初学者版与商业专业版）
    "alert-beginner": (params) => import("./pages/AlertsListBeginner.js").then((m) => {
    m.render(params);
    m.init?.(params);
}),
"alert-commercial": (params) => import("./pages/AlertsListCommercial.js").then((m) => {
    m.render(params);
    m.init?.(params);
}),
};

// 监听 DOM 加载完毕，初始化主系统组件与后台物联网模拟服务
document.addEventListener("DOMContentLoaded", () => {
    FarmCanvas.init("farmCanvas");
    SensorStrip.init();
    NpcAdvisor.init();
    Community.init();
    
    // Optional local demo simulator. Real Firebase/cached readings are the default.
    if (localStorage.getItem('seeddown_demo_simulator_enabled') === '1') {
        IotSimulator.start(5000);
    }
    
    // 初始化 AI 聊天专家基础服务
    initAiChat();
    
    // 注入路由框架并传入页面配置
    initNavigation(pages);
    
    // 渲染 Splash 欢迎首屏
    import("./pages/SplashPage.js").then((m) => m.render());
    
    // 挂载全局 Toast 提示组件到 window
    window.showToast = showToast;
});
