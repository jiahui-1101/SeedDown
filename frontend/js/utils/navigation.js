let pageModules = {};
let currentScreen = null;

const fallbackPageModules = {
    splash: () => import("../pages/SplashPage.js").then((m) => m.render()),
    login: () => import("../pages/LoginPage.js").then((m) => m.render()),
    farmlist: () => import("../pages/FarmListPage.js").then((m) => m.render()),
    buildfarm: () => import("../pages/BuildFarmPage.js?v=beginner-commercial-split-2").then((m) => m.render()),
    home: () => import("../pages/HomePage.js").then((m) => m.render()),
    "dash-c": () => import("../pages/CommercialPage.js").then((m) => m.render()),
    control: () => import("../pages/ControlPage.js").then((m) => m.render()),
    disease: () => import("../pages/DiseaseAnalysisPage.js").then((m) => m.render()),
    community: () => import("../pages/CommunityPage.js").then((m) => m.render()),
    feature: (params) => import("../pages/FeaturePage.js").then((m) => m.render(params)),
    "sensor-detail": (params) => {
    return import("../pages/SensorDetailPage.js").then((m) => m.render(params));
},
    profile: () => import("../pages/ProfilePage.js").then((m) => m.render()),
    "alert-detail": async (params) => {
    const m = await import("../pages/AlertDetailPage.js");
    m.render(params);
    await new Promise(r => setTimeout(r, 60));  // 等 DOM ready
    m.init(params);
},
    "whatif-pro": () => import("../pages/WhatIfPro.js").then((m) => m.renderScreen()),
    "zone-detail": (params) => import("../pages/ZoneDetailPage.js").then((m) => m.render(params)),
    "commercial-detail": (params) => import("../pages/CommercialDetailPage.js").then((m) => m.render(params)),
    "zone-overview": (params) => import("../pages/CommercialPage.js").then((m) => m.render(params)),
    "farm-master-detail": (params) => import("../pages/FarmMasterDetailPage.js").then((m) => m.render(params)),
    "alert-beginner": (params) => import("../pages/AlertsListBeginner.js").then((m) => {
    m.render(params);
    m.init?.(params);
}),
"alert-commercial": (params) => import("../pages/AlertsListCommercial.js").then((m) => {
    m.render(params);
    m.init?.(params);
}),
};

export function initNavigation(pages) {
    pageModules = pages;
}

export async function showScreen(screenName, params = {}) {
    console.log(`[Navigation] Showing screen: ${screenName}, current: ${currentScreen}`);
    const expectedScreenId = screenName === 'buildfarm'
        ? 'buildFarmScreen'
        : `${screenName}Screen`;
    const expectedScreen = document.getElementById(expectedScreenId);
    if (
        currentScreen === screenName &&
        Object.keys(params).length === 0 &&
        expectedScreen?.classList.contains('active')
    ) {
        console.log(`[Navigation] Screen ${screenName} already active, skipping`);
        return;
    }
    currentScreen = screenName;
    const loader = pageModules[screenName] || fallbackPageModules[screenName];
    if (!loader) {
        console.error(`[Navigation] Screen "${screenName}" not found in pageModules`);
        window.showToast?.('error', `Screen "${screenName}" not found`);
        return;
    }
    try {
        await loader(params);
    } catch (err) {
        console.error(`[Navigation] Error rendering screen "${screenName}":`, err);
        window.showToast?.('error', `Failed to load ${screenName}: ${err.message}`);
    }
}


