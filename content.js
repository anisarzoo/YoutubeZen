const CONFIG_MAP = {
    'hideComments': 'yt-focus-hide-comments',
    'hideSidebar': 'yt-focus-hide-sidebar',
    'hideShorts': 'yt-focus-hide-shorts',
    'hideAds': 'yt-focus-hide-ads',
    'hideDescription': 'yt-focus-hide-description',
    'hideEndScreen': 'yt-focus-hide-endscreen'
};

function applySettings() {
    chrome.storage.sync.get(Object.keys(CONFIG_MAP), (result) => {
        Object.keys(CONFIG_MAP).forEach(key => {
            const className = CONFIG_MAP[key];
            if (result[key]) {
                document.documentElement.classList.add(className);
            } else {
                document.documentElement.classList.remove(className);
            }
        });
    });
}

// Initial application
applySettings();

// Listen for changes from popup
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'toggle_change') {
        const className = CONFIG_MAP[message.id];
        if (className) {
            if (message.state) {
                document.documentElement.classList.add(className);
            } else {
                document.documentElement.classList.remove(className);
            }
        }
    }
});

// Since YouTube is a SPA (Single Page Application), we might need to re-apply 
// or ensure classes stay on the root. Usually the <html> tag persists.
const observer = new MutationObserver(() => {
    // Re-check settings if needed, but classes on <html> are usually safe.
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
