document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleButton');
  const status = document.querySelector('.status');
  
  // Load current state
  chrome.storage.local.get(['enabled'], function(result) {
    const isEnabled = result.enabled !== undefined ? result.enabled : true;
    updateUI(isEnabled);
  });
  
  // Toggle button click handler
  toggleButton.addEventListener('click', function() {
    chrome.storage.local.get(['enabled'], function(result) {
      const currentState = result.enabled !== undefined ? result.enabled : true;
      const newState = !currentState;
      
      // Save new state
      chrome.storage.local.set({ enabled: newState }, function() {
        updateUI(newState);
        
        // Notify content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'toggleGrammarChecker',
            enabled: newState
          });
        });
      });
    });
  });
  
  function updateUI(isEnabled) {
    if (isEnabled) {
      status.textContent = 'Grammar checking is active';
      status.className = 'status active';
      toggleButton.textContent = 'Disable Grammar Checker';
    } else {
      status.textContent = 'Grammar checking is disabled';
      status.className = 'status';
      toggleButton.textContent = 'Enable Grammar Checker';
    }
  }
}); 