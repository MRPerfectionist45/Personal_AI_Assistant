from fastapi import FastAPI

app = FastAPI()


@app.get("/api")
def home():
    return {"message": "Backend is working!"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}