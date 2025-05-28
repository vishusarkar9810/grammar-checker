document.addEventListener('DOMContentLoaded', function() {
  const inputText = document.getElementById('inputText');
  const checkButton = document.getElementById('checkButton');
  const resultDiv = document.getElementById('result');
  const loadingDiv = document.getElementById('loading');
  const resultLabel = document.getElementById('resultLabel');
  const resultRow = document.getElementById('resultRow');
  const copyBtn = document.getElementById('copyBtn');

  function showResult(text) {
    resultDiv.textContent = text;
    resultLabel.style.display = 'block';
    resultRow.style.display = 'flex';
  }

  function hideResult() {
    resultDiv.textContent = '';
    resultLabel.style.display = 'none';
    resultRow.style.display = 'none';
  }

  checkButton.addEventListener('click', async function() {
    const text = inputText.value.trim();
    if (!text) {
      showResult('Please enter some text to check.');
      return;
    }

    // Show loading state
    loadingDiv.style.display = 'flex';
    checkButton.disabled = true;
    hideResult();

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
      showResult(data.corrected_text);
    } catch (error) {
      showResult('Error: Could not check grammar. Make sure the server is running.');
      console.error('Error:', error);
    } finally {
      // Hide loading state
      loadingDiv.style.display = 'none';
      checkButton.disabled = false;
    }
  });

  copyBtn.addEventListener('click', function() {
    const text = resultDiv.textContent;
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '✅';
        setTimeout(() => {
          copyBtn.textContent = '📋';
        }, 1200);
      });
    }
  });

  // Hide result on input change
  inputText.addEventListener('input', hideResult);
}); 