import { AppState, initTiles } from "./store.js";
import { FarmCanvas } from "./components/FarmCanvas.js";
import { SensorStrip } from "./components/SensorStrip.js";
import { Community } from "./components/Community.js";
import { initNavigation, showScreen } from "./utils/navigation.js";
import { IotSimulator } from "./services/IotSimulator.js";
import { initAiChat } from "./services/AiChatService.js";
import { showToast } from "./utils/toast.js";
import { API_BASE } from "./utils/apiBase.js";

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

function readJsonStorage(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function clearSessionCache() {
    localStorage.removeItem('token');
    localStorage.removeItem('seeddown_user');
    localStorage.removeItem('user_farms');
    localStorage.removeItem('farm_profile');
    AppState.uid = null;
    AppState.userEmail = '';
    AppState.userName = '';
    AppState.isGuest = false;
    AppState.currentFarmId = null;
    AppState.currentFarm = null;
    AppState.farmName = 'My Farm';
}

function hydrateSessionFromCache() {
    const cachedUser = readJsonStorage('seeddown_user', {});
    const cachedFarms = readJsonStorage('user_farms', []);
    AppState.mode = localStorage.getItem('seeddown_mode') || cachedUser.mode || 'beginner';
    AppState.isGuest = Boolean(cachedUser.isGuest);
    AppState.uid = cachedUser.uid || cachedUser.email || null;
    AppState.userEmail = cachedUser.email || '';
    AppState.userName = cachedUser.name || cachedUser.displayName || cachedUser.email?.split('@')[0] || 'Farmer';
    if (Array.isArray(cachedFarms) && cachedFarms.length) {
        AppState.currentFarm = cachedFarms[0];
        AppState.currentFarmId = cachedFarms[0].id;
        AppState.farmName = cachedFarms[0].name || 'My Farm';
    }
}

async function refreshSessionFromBackend() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const headers = { Authorization: `Bearer ${token}` };
    try {
        const userRes = await fetch(`${API_BASE}/api/auth/me`, { headers });
        const userData = await userRes.json().catch(() => ({}));
        if (!userRes.ok || userData.ok === false) throw new Error(userData.error || 'Session expired');

        const user = userData.user || {};
        const nextUser = {
            uid: user.email || AppState.uid,
            email: user.email || AppState.userEmail,
            name: user.name || AppState.userName || user.email?.split('@')[0] || 'Farmer',
            mode: user.mode || AppState.mode || 'beginner',
            isGuest: AppState.isGuest,
        };
        localStorage.setItem('seeddown_user', JSON.stringify(nextUser));
        localStorage.setItem('seeddown_mode', nextUser.mode);
        AppState.mode = nextUser.mode;
        AppState.uid = nextUser.uid;
        AppState.userEmail = nextUser.email;
        AppState.userName = nextUser.name;

        const farmsRes = await fetch(`${API_BASE}/api/farms`, { headers });
        const farmsData = await farmsRes.json().catch(() => ({}));
        if (farmsRes.ok && farmsData.ok && Array.isArray(farmsData.farms)) {
            localStorage.setItem('user_farms', JSON.stringify(farmsData.farms));
            if (farmsData.farms.length) {
                AppState.currentFarm = farmsData.farms[0];
                AppState.currentFarmId = farmsData.farms[0].id;
                AppState.farmName = farmsData.farms[0].name || 'My Farm';
            }
        }
        AppState.notify?.();
        return true;
    } catch (error) {
        console.warn('[main] Session restore failed:', error.message);
        clearSessionCache();
        showToast('warning', 'Session expired. Please sign in again.');
        showScreen('login');
        return false;
    }
}

async function bootInitialScreen() {
    if (localStorage.getItem('token')) {
        hydrateSessionFromCache();
        await showScreen('farmlist');
        refreshSessionFromBackend();
        return;
    }
    import("./pages/SplashPage.js").then((m) => m.render());
}

// 监听 DOM 加载完毕，初始化主系统组件与后台物联网模拟服务
document.addEventListener("DOMContentLoaded", () => {
    FarmCanvas.init("farmCanvas");
    SensorStrip.init();
    Community.init();
    
    // Optional local demo simulator. Real Firebase/cached readings are the default.
    if (localStorage.getItem('seeddown_demo_simulator_enabled') === '1') {
        IotSimulator.start(5000);
    }
    
    // 初始化 AI 聊天专家基础服务
    initAiChat();
    
    // 注入路由框架并传入页面配置
    initNavigation(pages);
    
    // Restore cached sessions before showing the public launch flow.
    bootInitialScreen();
    
    // 挂载全局 Toast 提示组件到 window
    window.showToast = showToast;
});
