// Keep track of extension state for each tab
const tabStates = {};

// Listen for clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  // Get current state for this tab (default to false if not set)
  const isActive = tabStates[tab.id] || false;
  
  // Toggle the state
  tabStates[tab.id] = !isActive;
  
  // Send message to content script
  chrome.tabs.sendMessage(tab.id, {
    action: 'toggleVisibility',
    isActive: tabStates[tab.id]
  }).catch(error => {
    console.log('Error sending message:', error);
  });
});

// Clean up tab states when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabStates[tabId]) {
    delete tabStates[tabId];
  }
});