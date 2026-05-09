let pageModules = {};
let currentScreen = null;

export function initNavigation(pages) {
    pageModules = pages;
}

export async function showScreen(screenName, params = {}) {
    console.log(`[Navigation] Showing screen: ${screenName}, current: ${currentScreen}`);
    if (currentScreen === screenName && Object.keys(params).length === 0){
        console.log(`[Navigation] Screen ${screenName} already active, skipping`);
        return;
    }
    currentScreen = screenName;
    const loader = pageModules[screenName];
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