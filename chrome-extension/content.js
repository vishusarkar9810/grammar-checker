// Create and inject the correction popup
const popup = document.createElement('div');
popup.style.cssText = `
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 10000;
  max-width: 300px;
  display: none;
`;
document.body.appendChild(popup);

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showCorrection") {
    showCorrection(request.originalText, request.correctedText);
  }
});

function showCorrection(originalText, correctedText) {
  popup.innerHTML = `
    <div style="margin-bottom: 10px;">
      <strong>Original:</strong>
      <p style="margin: 5px 0;">${originalText}</p>
    </div>
    <div style="margin-bottom: 10px;">
      <strong>Corrected:</strong>
      <p style="margin: 5px 0;">${correctedText}</p>
    </div>
    <button id="applyCorrection" style="
      background: #4CAF50;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 5px;
    ">Apply Correction</button>
    <button id="closePopup" style="
      background: #f44336;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    ">Close</button>
  `;

  popup.style.display = 'block';

  // Add event listeners for the buttons
  document.getElementById('applyCorrection').addEventListener('click', () => {
    // Find the selected text and replace it
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(correctedText));
    }
    popup.style.display = 'none';
  });

  document.getElementById('closePopup').addEventListener('click', () => {
    popup.style.display = 'none';
  });
} 