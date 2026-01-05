from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ArtSphere Backend is Active"}