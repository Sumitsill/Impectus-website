from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from pydantic import BaseModel

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to Node.js server IP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DoshaInput(BaseModel):
    answers: list[int] # Mock input

@app.get("/")
def read_root():
    return {"status": "ML Service Running"}

@app.get("/predict/opd-load")
def predict_opd_load():
    # Mock AI prediction
    next_hour_load = random.randint(20, 50)
    current_load = random.randint(30, 60)
    return {
        "current_load": current_load,
        "predicted_next_hour": next_hour_load,
        "status": "High" if current_load > 45 else "Normal"
    }

@app.get("/analyze/dosha-trends")
def get_dosha_trends():
    # Mock aggregation of patient data
    return {
        "vata": random.randint(30, 60),
        "pitta": random.randint(20, 40),
        "kapha": random.randint(10, 30),
        "dominant": "Vata"
    }

@app.get("/analyze/remedy-trends")
def get_remedy_trends():
    remedies = ["Arnica Montana", "Nux Vomica", "Belladonna", "Rhus Tox"]
    top = random.choice(remedies)
    return {
        "top_remedy": top,
        "effectiveness": random.randint(70, 95),
        "cases_treated": random.randint(10, 50)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
