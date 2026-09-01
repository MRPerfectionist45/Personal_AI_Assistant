from fastapi import FastAPI, Request, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DEBUG: Visit /api/debug or /debug to confirm what path Vercel sends
@app.get("/api/debug")
@app.get("/debug")
async def debug(request: Request):
    return {
        "received_path": request.url.path,
        "note": "Use this to verify routing is working"
    }

# --- MAIN ROUTES ---
router = APIRouter()

@router.get("/")
def home():
    return {"message": "Backend is working!"}

@router.get("/health")
def health():
    return {"status": "healthy"}

@router.post("/chat")
async def chat(request: Request):
    try:
        body = await request.json()
        message = body.get("message", "")
        return {"reply": f"Backend received: {message}"}
    except Exception as e:
        return {"reply": f"Error: {str(e)}"}

# Mount router at BOTH /api and / so it works regardless of Vercel's path behavior
app.include_router(router, prefix="/api")
app.include_router(router, prefix="")

# REQUIRED for Vercel
handler = Mangum(app)