import sys
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import json
import numpy as np
import joblib
import pandas as pd
import tempfile
import shutil

# Add the ML models directory to the path
sys.path.append('/home/ubuntu/care-home-saas/care-home-saas/src/lib/ml-models')

# Import the ML models
from resident_fitment_model import predict_resident_fitment
from infection_outbreak_model import predict_infection_outbreak
from falls_prediction_model import predict_fall_risk
from pdf_summarizer import get_pdf_summarizer
from nurse_dictation_tool import get_nurse_dictation_tool
from llm_support_agent import get_llm_support_agent
# Note: meal_intake_model is imported separately due to its dependencies

# Create the FastAPI app
app = FastAPI(title="Care Home SaaS API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the upload directory
UPLOAD_DIR = '/home/ubuntu/care-home-saas/care-home-saas/uploads'
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize the PDF summarizer
pdf_summarizer = get_pdf_summarizer()

# Initialize the nurse dictation tool
nurse_dictation_tool = get_nurse_dictation_tool()

# Initialize the LLM support agent
llm_support_agent = get_llm_support_agent()

# Define request and response models
class ResidentFitmentRequest(BaseModel):
    mobility_score: int
    cognitive_score: int
    adl_score: int
    nutrition_score: int
    medical_complexity_score: int
    requires_secured_unit: bool
    requires_bariatric_accommodation: bool
    requires_iv_therapy: bool
    requires_dialysis: bool
    requires_ventilator: bool
    facility_id: int

class InfectionOutbreakRequest(BaseModel):
    year: int
    week: int
    staff_vaccination_rate: float
    resident_vaccination_rate: float
    seasonal_risk: float
    previous_outbreaks: int
    facility_size: int
    staff_turnover: float

class FallRiskRequest(BaseModel):
    age: int
    gender: int
    mobility_score: int
    balance_score: int
    cognitive_score: int
    medication_count: int
    fall_history: int
    vision_impairment: int
    incontinence: int
    assistive_device: int

class LLMSupportRequest(BaseModel):
    query: str
    scenario_type: str
    resident_id: Optional[int] = None

# API endpoints
@app.get("/")
async def root():
    return {"message": "Care Home SaaS API is running"}

@app.post("/api/resident-fitment")
async def resident_fitment(request: ResidentFitmentRequest):
    try:
        # Convert request to the format expected by the model
        resident_data = {
            'mobility_score': request.mobility_score,
            'cognitive_score': request.cognitive_score,
            'adl_score': request.adl_score,
            'nutrition_score': request.nutrition_score,
            'medical_complexity_score': request.medical_complexity_score,
            'requires_secured_unit': 1 if request.requires_secured_unit else 0,
            'requires_bariatric_accommodation': 1 if request.requires_bariatric_accommodation else 0,
            'requires_iv_therapy': 1 if request.requires_iv_therapy else 0,
            'requires_dialysis': 1 if request.requires_dialysis else 0,
            'requires_ventilator': 1 if request.requires_ventilator else 0
        }
        
        # Mock facility data (in a real app, this would come from the database)
        facility_data = {
            'secured_unit_beds': 10,
            'short_stay_beds': 5,
            'bariatric_beds': 2,
            'iv_therapy_available': 1,
            'dialysis_available': 1,
            'ventilator_available': 0
        }
        
        # Call the prediction function
        result = predict_resident_fitment(resident_data, facility_data)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/infection-outbreak")
async def infection_outbreak(request: InfectionOutbreakRequest):
    try:
        # Convert request to the format expected by the model
        input_data = {
            'year': request.year,
            'week': request.week,
            'staff_vaccination_rate': request.staff_vaccination_rate,
            'resident_vaccination_rate': request.resident_vaccination_rate,
            'seasonal_risk': request.seasonal_risk,
            'previous_outbreaks': request.previous_outbreaks,
            'facility_size': request.facility_size,
            'staff_turnover': request.staff_turnover
        }
        
        # Call the prediction function
        result = predict_infection_outbreak(input_data)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/fall-risk")
async def fall_risk(request: FallRiskRequest):
    try:
        # Convert request to the format expected by the model
        resident_data = {
            'age': request.age,
            'gender': request.gender,
            'mobility_score': request.mobility_score,
            'balance_score': request.balance_score,
            'cognitive_score': request.cognitive_score,
            'medication_count': request.medication_count,
            'fall_history': request.fall_history,
            'vision_impairment': request.vision_impairment,
            'incontinence': request.incontinence,
            'assistive_device': request.assistive_device
        }
        
        # Call the prediction function
        result = predict_fall_risk(resident_data)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pdf-summary")
async def pdf_summary(file: UploadFile = File(...)):
    try:
        # Save the uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Call the PDF summarizer
        result = pdf_summarizer.summarize_pdf(file_path)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/meal-intake")
async def meal_intake(
    file: UploadFile = File(...),
    resident_id: int = Form(...),
    meal_type: str = Form(...)
):
    try:
        # Save the uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Import the meal intake model here to avoid loading it at startup
        from meal_intake_model import analyze_meal_intake
        
        # Call the meal intake analyzer
        result = analyze_meal_intake(file_path)
        
        # Add metadata
        result["resident_id"] = resident_id
        result["meal_type"] = meal_type
        result["timestamp"] = pd.Timestamp.now().isoformat()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/nurse-dictation")
async def nurse_dictation(
    file: UploadFile = File(...),
    resident_id: int = Form(...),
    user_id: int = Form(...),
    note_type: str = Form(...)
):
    try:
        # Save the uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Call the nurse dictation tool
        result = nurse_dictation_tool.process_dictation(
            file_path,
            resident_id,
            user_id,
            note_type
        )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/llm-support")
async def llm_support(request: LLMSupportRequest):
    try:
        # Call the LLM support agent
        result = llm_support_agent.process_query(
            request.query,
            request.scenario_type
        )
        
        # Add metadata
        if request.resident_id:
            result["resident_id"] = request.resident_id
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the API with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
