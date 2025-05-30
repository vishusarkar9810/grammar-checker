from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from grammar_model import correct_text
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    logger.info("Health check endpoint called")
    return {"message": "Grammar Checker API is running"}

@app.post("/check")
async def check_text(req: TextRequest):
    try:
        if not req or not req.text:
            raise HTTPException(status_code=400, detail="No text provided")
            
        logger.info("Received text for correction")
        # Use the actual grammar correction function
        corrected = correct_text(req.text)
        
        if corrected is None:
            raise HTTPException(status_code=500, detail="Grammar correction failed")
            
        logger.info("Text correction completed successfully")
        return {"corrected_text": corrected if corrected else req.text}
    except Exception as e:
        logger.error(f"Error during text correction: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

# Run the server
if __name__ == "__main__":
    try:
        logger.info("Starting server on http://localhost:8001")
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8001,
            log_level="info",
            reload=False,  # Disable auto-reload to prevent multiple instances
            workers=1  # Use single worker to prevent conflicts
        )
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        raise 