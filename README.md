# Enhanced Grammar Checker

A powerful grammar correction tool that uses AI to fix grammar, spelling, and punctuation errors in text.

## Features

- Real-time grammar correction
- Highlights changes between original and corrected text
- Dark/light mode
- Mobile-responsive design
- Correction history
- Copy to clipboard functionality
- Character and word count
- Keyboard shortcuts

## Setup Instructions

### Prerequisites

- Python 3.7 or higher
- Node.js (optional, for npm)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Start a simple HTTP server:
   ```
   # Using Python
   python -m http.server 8080
   
   # OR using Node.js
   npx http-server -p 8080
   ```

3. Open your browser and go to:
   ```
   http://localhost:8080
   ```

## How to Use

1. **Enter Text**: Type or paste your text with grammar errors in the input box, or select one of the example sentences.

2. **Check Grammar**: Click the "Check Grammar" button or press Ctrl+Enter to submit the text for correction.

3. **View Results**: The corrected text will appear in the output section with grammar errors fixed.

4. **See Changes**: Look at the "What Changed" section to see the specific corrections highlighted.

5. **Copy Results**: Click the copy button in the top-right corner of the results to copy the corrected text to your clipboard.

6. **View History**: Click the "Correction History" tab to see your previous corrections. You can reuse or remove items from your history.

7. **Toggle Theme**: Click the moon/sun icon in the top-right corner to switch between dark and light modes.

## Technical Details

The grammar checker consists of two main components:

### Backend (Python/FastAPI)

- Uses a transformer-based sequence-to-sequence model for grammar correction
- Implements custom post-processing to handle specific grammar rules
- Provides a simple REST API for text correction

### Frontend (HTML/CSS/JavaScript)

- Clean, responsive interface for easy interaction
- Local storage for saving user preferences and correction history
- Real-time text analysis for character and word counts

## Troubleshooting

- **Backend Connection Issues**: Ensure the backend server is running at http://localhost:8000. Check the connection status message on the frontend.
  
- **Slow Performance**: Grammar correction for longer texts may take a few seconds. The processing time is displayed with each correction.

- **Installation Problems**: Make sure you have the correct Python version and all required packages installed.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 