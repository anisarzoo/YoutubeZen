document.addEventListener('DOMContentLoaded', () => {
  const toggles = [
    'hideComments',
    'hideSidebar',
    'hideShorts',
    'hideAds',
    'hideDescription',
    'hideEndScreen'
  ];

  // Load saved settings
  chrome.storage.sync.get(toggles, (result) => {
    toggles.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.checked = result[id] || false;
      }
    });
  });

  // Handle toggle changes
  toggles.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('change', () => {
        const state = element.checked;
        chrome.storage.sync.set({ [id]: state }, () => {
          // Notify active YouTube tabs
          chrome.tabs.query({ url: '*://*.youtube.com/*' }, (tabs) => {
            tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, { 
                type: 'toggle_change', 
                id: id, 
                state: state 
              });
            });
          });
        });
      });
    }
  });
});
