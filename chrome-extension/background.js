chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "checkGrammar",
    title: "Check Grammar",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "checkGrammar") {
    const selectedText = info.selectionText;
    if (selectedText) {
      checkGrammar(selectedText)
        .then(correctedText => {
          chrome.tabs.sendMessage(tab.id, {
            action: "showCorrection",
            originalText: selectedText,
            correctedText: correctedText
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }
});

async function checkGrammar(text) {
  try {
    const response = await fetch('http://localhost:8001/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.corrected_text;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
} 