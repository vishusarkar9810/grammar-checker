from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from grammar_model import correct_text

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
    return {"message": "Grammar Checker API is running"}

@app.post("/check")
async def check_text(req: TextRequest):
    # Use the actual grammar correction function
    corrected = correct_text(req.text)
    return {"corrected_text": corrected}

# Run the server
if __name__ == "__main__":
    import uvicorn
    print("Starting server on http://localhost:8001")
    uvicorn.run(app, host="0.0.0.0", port=8001) 