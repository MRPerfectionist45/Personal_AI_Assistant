from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from mangum import Mangum
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== LOAD KNOWLEDGE BASE ==========
KNOWLEDGE = []
try:
    with open("knowledge.json", "r", encoding="utf-8") as f:
        KNOWLEDGE = json.load(f)
except Exception as e:
    print(f"Warning: Could not load knowledge.json: {e}")
    KNOWLEDGE = []

@app.get("/api")
@app.get("/api/")
def home():
    return {"message": "Backend is working!", "knowledge_entries": len(KNOWLEDGE)}

@app.get("/api/health")
def health():
    return {"status": "online", "entries_loaded": len(KNOWLEDGE)}

@app.post("/api/chat")
async def chat(request: Request):
    try:
        body = await request.json()
        user_message = body.get("message", "").strip()
        
        if not user_message:
            return JSONResponse(
                status_code=400,
                content={"reply": "Please send a message."}
            )

        reply = await groq_rag_response(user_message)
        return {"reply": reply}

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"reply": f"Server Error: {str(e)}"}
        )

async def groq_rag_response(query: str) -> str:
    import httpx
    
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return "ERROR: GROQ_API_KEY not found. Please add it in Vercel Dashboard > Settings > Environment Variables, then redeploy."
    
    context = json.dumps(KNOWLEDGE[:10], indent=2, ensure_ascii=False)
    
    system_prompt = f"""You are Deepak Gaikwad's personal AI assistant.
You help visitors learn about Deepak's skills, projects, experience, and background.
Use the following knowledge base to answer questions accurately and concisely.
If the answer is not in the knowledge base, say so politely.

KNOWLEDGE BASE:
{context}
"""
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ],
                "max_tokens": 1024,
                "temperature": 0.7
            },
            timeout=30.0
        )
        
        data = response.json()
        
        if "choices" not in data:
            error_msg = data.get("error", {}).get("message", str(data))
            return f"Groq API Error: {error_msg}"
        
        return data["choices"][0]["message"]["content"]

handler = Mangum(app)