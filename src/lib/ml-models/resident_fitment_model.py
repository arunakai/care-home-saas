import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Define the directory for saving models
MODEL_DIR = '/home/ubuntu/care-home-saas/care-home-saas/src/lib/ml-models'
os.makedirs(MODEL_DIR, exist_ok=True)

# Function to generate synthetic data for resident-home fitment
def generate_resident_fitment_data(n_samples=1000):
    np.random.seed(42)
    
    # Generate features
    mobility_score = np.random.randint(1, 6, n_samples)
    cognitive_score = np.random.randint(1, 6, n_samples)
    adl_score = np.random.randint(1, 6, n_samples)
    nutrition_score = np.random.randint(1, 6, n_samples)
    medical_complexity_score = np.random.randint(1, 6, n_samples)
    
    requires_secured_unit = np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
    requires_bariatric_accommodation = np.random.choice([0, 1], n_samples, p=[0.8, 0.2])
    requires_iv_therapy = np.random.choice([0, 1], n_samples, p=[0.85, 0.15])
    requires_dialysis = np.random.choice([0, 1], n_samples, p=[0.9, 0.1])
    requires_ventilator = np.random.choice([0, 1], n_samples, p=[0.95, 0.05])
    
    # Facility capabilities
    secured_unit_beds = np.random.randint(0, 20, n_samples)
    short_stay_beds = np.random.randint(0, 15, n_samples)
    bariatric_beds = np.random.randint(0, 10, n_samples)
    iv_therapy_available = np.random.choice([0, 1], n_samples, p=[0.2, 0.8])
    dialysis_available = np.random.choice([0, 1], n_samples, p=[0.3, 0.7])
    ventilator_available = np.random.choice([0, 1], n_samples, p=[0.4, 0.6])
    
    # Create a DataFrame
    data = pd.DataFrame({
        'mobility_score': mobility_score,
        'cognitive_score': cognitive_score,
        'adl_score': adl_score,
        'nutrition_score': nutrition_score,
        'medical_complexity_score': medical_complexity_score,
        'requires_secured_unit': requires_secured_unit,
        'requires_bariatric_accommodation': requires_bariatric_accommodation,
        'requires_iv_therapy': requires_iv_therapy,
        'requires_dialysis': requires_dialysis,
        'requires_ventilator': requires_ventilator,
        'secured_unit_beds': secured_unit_beds,
        'short_stay_beds': short_stay_beds,
        'bariatric_beds': bariatric_beds,
        'iv_therapy_available': iv_therapy_available,
        'dialysis_available': dialysis_available,
        'ventilator_available': ventilator_available
    })
    
    # Generate target (fitment score) based on features
    # Higher scores for better matches between resident needs and facility capabilities
    fitment_score = np.zeros(n_samples)
    
    # Base score from assessment scores (higher is better)
    base_score = (mobility_score + cognitive_score + adl_score + nutrition_score + (6 - medical_complexity_score)) / 5
    fitment_score += base_score * 20  # Scale to 0-100
    
    # Adjust for special requirements
    for i in range(n_samples):
        # Secured unit requirement
        if requires_secured_unit[i] == 1:
            if secured_unit_beds[i] > 0:
                fitment_score[i] += 5
            else:
                fitment_score[i] -= 20
        
        # Bariatric accommodation
        if requires_bariatric_accommodation[i] == 1:
            if bariatric_beds[i] > 0:
                fitment_score[i] += 5
            else:
                fitment_score[i] -= 15
        
        # IV therapy
        if requires_iv_therapy[i] == 1:
            if iv_therapy_available[i] == 1:
                fitment_score[i] += 5
            else:
                fitment_score[i] -= 15
        
        # Dialysis
        if requires_dialysis[i] == 1:
            if dialysis_available[i] == 1:
                fitment_score[i] += 5
            else:
                fitment_score[i] -= 20
        
        # Ventilator
        if requires_ventilator[i] == 1:
            if ventilator_available[i] == 1:
                fitment_score[i] += 5
            else:
                fitment_score[i] -= 25
    
    # Clip scores to 0-100 range
    fitment_score = np.clip(fitment_score, 0, 100)
    
    # Create fitment categories
    fitment_category = np.zeros(n_samples, dtype=int)
    fitment_category[fitment_score >= 80] = 2  # Excellent fit
    fitment_category[(fitment_score >= 60) & (fitment_score < 80)] = 1  # Good fit
    fitment_category[fitment_score < 60] = 0  # Poor fit
    
    data['fitment_score'] = fitment_score
    data['fitment_category'] = fitment_category
    
    return data

# Train the resident-home fitment model
def train_resident_fitment_model():
    # Generate synthetic data
    data = generate_resident_fitment_data()
    
    # Features and target
    X = data.drop(['fitment_score', 'fitment_category'], axis=1)
    y_score = data['fitment_score']
    y_category = data['fitment_category']
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train regression model for fitment score
    score_model = RandomForestClassifier(n_estimators=100, random_state=42)
    score_model.fit(X_scaled, y_score)
    
    # Train classification model for fitment category
    category_model = RandomForestClassifier(n_estimators=100, random_state=42)
    category_model.fit(X_scaled, y_category)
    
    # Save models and scaler
    joblib.dump(scaler, os.path.join(MODEL_DIR, 'resident_fitment_scaler.pkl'))
    joblib.dump(score_model, os.path.join(MODEL_DIR, 'resident_fitment_score_model.pkl'))
    joblib.dump(category_model, os.path.join(MODEL_DIR, 'resident_fitment_category_model.pkl'))
    
    print("Resident-Home Fitment models trained and saved successfully.")
    
    return scaler, score_model, category_model

# Function to predict resident-home fitment
def predict_resident_fitment(resident_data, facility_data):
    # Load models and scaler
    scaler = joblib.load(os.path.join(MODEL_DIR, 'resident_fitment_scaler.pkl'))
    score_model = joblib.load(os.path.join(MODEL_DIR, 'resident_fitment_score_model.pkl'))
    category_model = joblib.load(os.path.join(MODEL_DIR, 'resident_fitment_category_model.pkl'))
    
    # Combine resident and facility data
    input_data = {**resident_data, **facility_data}
    input_df = pd.DataFrame([input_data])
    
    # Scale input data
    input_scaled = scaler.transform(input_df)
    
    # Make predictions
    fitment_score = score_model.predict(input_scaled)[0]
    fitment_category = category_model.predict(input_scaled)[0]
    
    # Map category to recommendation
    category_map = {
        0: "Poor Fit - Not Recommended",
        1: "Good Fit - Consider Admission",
        2: "Excellent Fit - Highly Recommended"
    }
    
    recommendation = category_map[fitment_category]
    
    # Generate reasoning based on requirements and facility capabilities
    reasoning = []
    
    if input_data['requires_secured_unit'] and input_data['secured_unit_beds'] > 0:
        reasoning.append("Facility has secured unit beds available for resident's needs.")
    elif input_data['requires_secured_unit'] and input_data['secured_unit_beds'] == 0:
        reasoning.append("Facility lacks secured unit beds required by resident.")
    
    if input_data['requires_bariatric_accommodation'] and input_data['bariatric_beds'] > 0:
        reasoning.append("Facility has bariatric beds available for resident's needs.")
    elif input_data['requires_bariatric_accommodation'] and input_data['bariatric_beds'] == 0:
        reasoning.append("Facility lacks bariatric beds required by resident.")
    
    if input_data['requires_iv_therapy'] and input_data['iv_therapy_available']:
        reasoning.append("Facility provides IV therapy services required by resident.")
    elif input_data['requires_iv_therapy'] and not input_data['iv_therapy_available']:
        reasoning.append("Facility does not provide IV therapy services required by resident.")
    
    if input_data['requires_dialysis'] and input_data['dialysis_available']:
        reasoning.append("Facility provides dialysis services required by resident.")
    elif input_data['requires_dialysis'] and not input_data['dialysis_available']:
        reasoning.append("Facility does not provide dialysis services required by resident.")
    
    if input_data['requires_ventilator'] and input_data['ventilator_available']:
        reasoning.append("Facility provides ventilator support required by resident.")
    elif input_data['requires_ventilator'] and not input_data['ventilator_available']:
        reasoning.append("Facility does not provide ventilator support required by resident.")
    
    # Add assessment-based reasoning
    if input_data['mobility_score'] <= 2:
        reasoning.append("Resident has low mobility score, requiring significant assistance.")
    if input_data['cognitive_score'] <= 2:
        reasoning.append("Resident has low cognitive score, requiring memory care services.")
    if input_data['medical_complexity_score'] >= 4:
        reasoning.append("Resident has high medical complexity, requiring advanced clinical care.")
    
    return {
        'fitment_score': round(float(fitment_score), 1),
        'recommendation': recommendation,
        'reasoning': reasoning
    }

if __name__ == "__main__":
    # Train the model
    train_resident_fitment_model()
    
    # Test prediction with sample data
    resident_data = {
        'mobility_score': 3,
        'cognitive_score': 2,
        'adl_score': 3,
        'nutrition_score': 4,
        'medical_complexity_score': 3,
        'requires_secured_unit': 1,
        'requires_bariatric_accommodation': 0,
        'requires_iv_therapy': 1,
        'requires_dialysis': 0,
        'requires_ventilator': 0
    }
    
    facility_data = {
        'secured_unit_beds': 10,
        'short_stay_beds': 5,
        'bariatric_beds': 2,
        'iv_therapy_available': 1,
        'dialysis_available': 0,
        'ventilator_available': 0
    }
    
    result = predict_resident_fitment(resident_data, facility_data)
    print("Prediction result:", result)
