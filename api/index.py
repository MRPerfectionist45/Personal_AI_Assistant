from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS - Allow your Vercel frontend to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your actual Vercel domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend is working!"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# THIS IS THE MISSING ENDPOINT YOUR FRONTEND IS CALLING
@app.post("/chat")
async def chat(request: Request):
    try:
        body = await request.json()
        message = body.get("message", "")
        
        # TODO: Replace this with your actual RAG logic
        # For now, it returns a test response to confirm the connection works
        return {"reply": f"Backend received: {message}"}
        
    except Exception as e:
        return {"reply": f"Error: {str(e)}"}

# THIS LINE IS REQUIRED FOR VERCEL
handler = Mangum(app)