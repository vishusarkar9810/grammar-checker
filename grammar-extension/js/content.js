class GrammarTooltip {
  constructor() {
    console.log('GrammarTooltip: Initializing...');
    this.tooltip = null;
    this.currentError = null;
    this.isEnabled = true;
    this.debounceTimer = null;
    this.init();
  }

  init() {
    console.log('GrammarTooltip: Setting up...');
    this.createTooltip();
    document.addEventListener('click', this.handleDocumentClick.bind(this));
    document.addEventListener('scroll', this.handleScroll.bind(this));
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('GrammarTooltip: Received message:', message);
      if (message.action === 'toggleGrammarChecker') {
        this.isEnabled = message.enabled;
        if (!this.isEnabled) {
          this.removeAllHighlights();
        }
      }
    });
    this.setupTextMonitoring();
    console.log('GrammarTooltip: Setup complete');
  }

  createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'grammar-tooltip';
    this.tooltip.style.display = 'none';
    this.tooltip.style.border = '2px solid #007bff';
    document.body.appendChild(this.tooltip);
  }

  setupTextMonitoring() {
    document.addEventListener('mouseup', (event) => {
      if (!this.isEnabled) return;
      let selectedText = '';
      let rect = null;
      let target = event.target;
      if (target.matches('textarea')) {
        // For textarea, use selectionStart/selectionEnd
        const start = target.selectionStart;
        const end = target.selectionEnd;
        selectedText = target.value.substring(start, end);
        console.log('GrammarTooltip: Textarea selection:', selectedText, start, end);
        if (selectedText.length > 0) {
          // Calculate position for tooltip (approximate, since textarea doesn't expose selection rect)
          rect = target.getBoundingClientRect();
          rect = {left: rect.left + 10, top: rect.top + 10, right: rect.right, bottom: rect.top + 40, width: 200, height: 40};
        }
      } else if (target.matches('[contenteditable="true"]')) {
        // For contenteditable, use window.getSelection
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          selectedText = selection.toString();
          rect = range.getBoundingClientRect();
          console.log('GrammarTooltip: Contenteditable selection:', selectedText, rect);
        }
      }
      if (selectedText && rect) {
        console.log('GrammarTooltip: Showing tooltip for selected text:', selectedText, rect);
        this.showCheckGrammarTooltip(selectedText, rect, target);
      } else {
        this.hideTooltip();
        console.log('GrammarTooltip: No valid selection or rect.');
      }
    });
  }

  showCheckGrammarTooltip(selectedText, position, element) {
    console.log('GrammarTooltip: showCheckGrammarTooltip called with:', selectedText, position, element);
    this.tooltip.innerHTML = `
      <div class="grammar-tooltip-header">
        <span class="grammar-tooltip-title">Grammar Checker</span>
        <button class="grammar-tooltip-close">×</button>
      </div>
      <div class="grammar-tooltip-content">
        <div style="margin-bottom:8px;">Selected: <em>${selectedText.replace(/</g, '&lt;')}</em></div>
        <button class="grammar-tooltip-check-btn">Check Grammar</button>
        <div class="grammar-tooltip-suggestions"></div>
      </div>
    `;
    this.positionTooltip(position);
    this.tooltip.style.display = 'block';
    this.addCheckGrammarTooltipListeners(selectedText, element);
  }

  addCheckGrammarTooltipListeners(selectedText, element) {
    const closeBtn = this.tooltip.querySelector('.grammar-tooltip-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.hideTooltip());
    const checkBtn = this.tooltip.querySelector('.grammar-tooltip-check-btn');
    if (checkBtn) {
      checkBtn.addEventListener('click', async () => {
        checkBtn.disabled = true;
        checkBtn.textContent = 'Checking...';
        const suggestionsDiv = this.tooltip.querySelector('.grammar-tooltip-suggestions');
        try {
          const matches = await this.checkGrammarWithAPI(selectedText);
          if (matches.length === 0) {
            suggestionsDiv.innerHTML = '<span style="color:green;">No issues found!</span>';
          } else {
            suggestionsDiv.innerHTML = matches.map(match => `
              <div style="margin-bottom:6px;">
                <b>${match.message}</b><br/>
                <span style="color:#888;">Suggestion: ${match.replacements.map(r=>r.value).join(', ') || 'None'}</span>
              </div>
            `).join('');
          }
        } catch (e) {
          suggestionsDiv.innerHTML = '<span style="color:red;">Error checking grammar.</span>';
        }
        checkBtn.disabled = false;
        checkBtn.textContent = 'Check Grammar';
      });
    }
  }

  async checkGrammarWithAPI(text) {
    console.log('GrammarTooltip: Sending text to LanguageTool API:', text);
    const response = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `text=${encodeURIComponent(text)}&language=en-US`
    });
    const result = await response.json();
    console.log('GrammarTooltip: LanguageTool API result:', result);
    return result.matches || [];
  }

  positionTooltip(position) {
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let left = position.left;
    let top = position.bottom + 5;
    if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 10;
    }
    if (top + tooltipRect.height > viewportHeight) {
      top = position.top - tooltipRect.height - 5;
    }
    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
    console.log('GrammarTooltip: Tooltip positioned at:', this.tooltip.style.left, this.tooltip.style.top);
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.style.display = 'none';
      this.currentError = null;
    }
  }

  handleDocumentClick(event) {
    if (this.tooltip && !this.tooltip.contains(event.target)) {
      this.hideTooltip();
    }
  }

  handleScroll() {
    this.hideTooltip();
  }

  removeAllHighlights() {
    const highlights = document.querySelectorAll('.grammar-error');
    highlights.forEach(highlight => {
      const parent = highlight.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
      }
    });
  }
}

console.log('GrammarTooltip: Starting initialization');
const grammarTooltip = new GrammarTooltip();
console.log('GrammarTooltip: Initialization complete'); 