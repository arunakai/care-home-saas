import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os
from datetime import datetime, timedelta

# Define the directory for saving models
MODEL_DIR = '/home/ubuntu/care-home-saas/care-home-saas/src/lib/ml-models'
os.makedirs(MODEL_DIR, exist_ok=True)

# Function to generate synthetic data for falls prediction
def generate_falls_prediction_data(n_samples=1000):
    np.random.seed(42)
    
    # Generate resident features
    age = np.random.randint(65, 100, n_samples)
    gender = np.random.choice([0, 1], n_samples)  # 0 for male, 1 for female
    
    # Mobility scores (1-5, lower is worse)
    mobility_score = np.random.randint(1, 6, n_samples)
    
    # Balance assessment (1-5, lower is worse)
    balance_score = np.random.randint(1, 6, n_samples)
    
    # Cognitive scores (1-5, lower is worse)
    cognitive_score = np.random.randint(1, 6, n_samples)
    
    # Medication count (number of medications)
    medication_count = np.random.randint(0, 15, n_samples)
    
    # History of falls (number of previous falls)
    fall_history = np.random.randint(0, 5, n_samples)
    
    # Vision impairment (0-3, higher is worse)
    vision_impairment = np.random.randint(0, 4, n_samples)
    
    # Incontinence (0-1, binary)
    incontinence = np.random.choice([0, 1], n_samples)
    
    # Use of assistive device (0-1, binary)
    assistive_device = np.random.choice([0, 1], n_samples)
    
    # Create a DataFrame
    data = pd.DataFrame({
        'age': age,
        'gender': gender,
        'mobility_score': mobility_score,
        'balance_score': balance_score,
        'cognitive_score': cognitive_score,
        'medication_count': medication_count,
        'fall_history': fall_history,
        'vision_impairment': vision_impairment,
        'incontinence': incontinence,
        'assistive_device': assistive_device
    })
    
    # Generate target (fall risk) based on features
    # Calculate base risk score
    fall_risk = np.zeros(n_samples)
    
    for i in range(n_samples):
        # Age factor (higher age = higher risk)
        age_factor = (age[i] - 65) / 35  # Normalize to 0-1
        
        # Mobility and balance factors (lower score = higher risk)
        mobility_factor = (6 - mobility_score[i]) / 5  # Invert and normalize
        balance_factor = (6 - balance_score[i]) / 5  # Invert and normalize
        
        # Cognitive factor (lower score = higher risk)
        cognitive_factor = (6 - cognitive_score[i]) / 5  # Invert and normalize
        
        # Medication factor (more medications = higher risk)
        medication_factor = medication_count[i] / 15  # Normalize
        
        # Fall history factor (more falls = higher risk)
        history_factor = fall_history[i] / 4  # Normalize
        
        # Vision factor (worse vision = higher risk)
        vision_factor = vision_impairment[i] / 3  # Normalize
        
        # Incontinence and assistive device factors
        incontinence_factor = incontinence[i] * 0.1
        assistive_factor = (1 - assistive_device[i]) * 0.1  # Not using device increases risk
        
        # Combine factors with weights
        fall_risk[i] = (
            age_factor * 0.15 +
            mobility_factor * 0.2 +
            balance_factor * 0.2 +
            cognitive_factor * 0.1 +
            medication_factor * 0.1 +
            history_factor * 0.15 +
            vision_factor * 0.05 +
            incontinence_factor +
            assistive_factor
        )
    
    # Add some random noise
    fall_risk += np.random.normal(0, 0.05, n_samples)
    
    # Clip to 0-1 range
    fall_risk = np.clip(fall_risk, 0, 1)
    
    # Create risk categories
    risk_category = np.zeros(n_samples, dtype=int)
    risk_category[(fall_risk >= 0.3) & (fall_risk < 0.6)] = 1  # Medium risk
    risk_category[fall_risk >= 0.6] = 2  # High risk
    
    data['fall_risk_score'] = fall_risk * 100  # Scale to 0-100
    data['risk_category'] = risk_category  # 0=Low, 1=Medium, 2=High
    
    return data

# Train the falls prediction model
def train_falls_prediction_model():
    # Generate synthetic data
    data = generate_falls_prediction_data()
    
    # Features and target
    X = data.drop(['fall_risk_score', 'risk_category'], axis=1)
    y_score = data['fall_risk_score']
    y_category = data['risk_category']
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train regression model for risk score
    score_model = RandomForestClassifier(n_estimators=100, random_state=42)
    score_model.fit(X_scaled, y_score)
    
    # Train classification model for risk category
    category_model = RandomForestClassifier(n_estimators=100, random_state=42)
    category_model.fit(X_scaled, y_category)
    
    # Save models and scaler
    joblib.dump(scaler, os.path.join(MODEL_DIR, 'falls_prediction_scaler.pkl'))
    joblib.dump(score_model, os.path.join(MODEL_DIR, 'falls_prediction_score_model.pkl'))
    joblib.dump(category_model, os.path.join(MODEL_DIR, 'falls_prediction_category_model.pkl'))
    
    print("Falls Prediction models trained and saved successfully.")
    
    return scaler, score_model, category_model

# Function to predict fall risk
def predict_fall_risk(resident_data):
    # Load models and scaler
    scaler = joblib.load(os.path.join(MODEL_DIR, 'falls_prediction_scaler.pkl'))
    score_model = joblib.load(os.path.join(MODEL_DIR, 'falls_prediction_score_model.pkl'))
    category_model = joblib.load(os.path.join(MODEL_DIR, 'falls_prediction_category_model.pkl'))
    
    # Convert input data to DataFrame
    input_df = pd.DataFrame([resident_data])
    
    # Scale input data
    input_scaled = scaler.transform(input_df)
    
    # Make predictions
    risk_score = score_model.predict(input_scaled)[0]
    risk_category = category_model.predict(input_scaled)[0]
    
    # Map category to risk level
    category_map = {
        0: "Low Risk",
        1: "Medium Risk",
        2: "High Risk"
    }
    
    risk_level = category_map[risk_category]
    
    # Generate risk factors based on resident data
    risk_factors = []
    
    if resident_data['age'] >= 85:
        risk_factors.append("Advanced age (85+)")
    
    if resident_data['mobility_score'] <= 2:
        risk_factors.append("Severely impaired mobility")
    elif resident_data['mobility_score'] <= 3:
        risk_factors.append("Moderately impaired mobility")
    
    if resident_data['balance_score'] <= 2:
        risk_factors.append("Poor balance")
    
    if resident_data['cognitive_score'] <= 3:
        risk_factors.append("Cognitive impairment")
    
    if resident_data['medication_count'] >= 8:
        risk_factors.append("Polypharmacy (8+ medications)")
    
    if resident_data['fall_history'] >= 2:
        risk_factors.append("History of multiple falls")
    elif resident_data['fall_history'] == 1:
        risk_factors.append("History of one fall")
    
    if resident_data['vision_impairment'] >= 2:
        risk_factors.append("Significant vision impairment")
    
    if resident_data['incontinence'] == 1:
        risk_factors.append("Incontinence")
    
    if resident_data['assistive_device'] == 0:
        risk_factors.append("Not using assistive device")
    
    # Generate recommendations based on risk level and factors
    recommendations = []
    
    if risk_category == 2:  # High risk
        recommendations.append("Implement comprehensive fall prevention plan")
        recommendations.append("Consider bed/chair alarms")
        recommendations.append("Increase supervision during transfers and ambulation")
        recommendations.append("Physical therapy evaluation for strengthening exercises")
        recommendations.append("Review and optimize medication regimen")
        recommendations.append("Consider hip protectors")
    elif risk_category == 1:  # Medium risk
        recommendations.append("Regular balance and strength exercises")
        recommendations.append("Ensure proper footwear")
        recommendations.append("Review medications for fall risk")
        recommendations.append("Ensure assistive devices are properly fitted and used")
        recommendations.append("Environmental modifications to reduce hazards")
    else:  # Low risk
        recommendations.append("Maintain physical activity")
        recommendations.append("Regular vision and hearing checks")
        recommendations.append("Maintain safe environment")
    
    # Add specific recommendations based on risk factors
    if "Poor balance" in risk_factors:
        recommendations.append("Balance training exercises with physical therapy")
    
    if "Cognitive impairment" in risk_factors:
        recommendations.append("Simplified environment with clear visual cues")
    
    if "Polypharmacy" in risk_factors:
        recommendations.append("Medication review to eliminate unnecessary prescriptions")
    
    if "Significant vision impairment" in risk_factors:
        recommendations.append("Improve lighting and use high-contrast visual cues")
    
    if "Incontinence" in risk_factors:
        recommendations.append("Scheduled toileting program")
    
    return {
        'risk_score': round(float(risk_score), 1),
        'risk_level': risk_level,
        'risk_factors': risk_factors,
        'recommendations': recommendations
    }

if __name__ == "__main__":
    # Train the model
    train_falls_prediction_model()
    
    # Test prediction with sample data
    resident_data = {
        'age': 82,
        'gender': 1,  # Female
        'mobility_score': 3,
        'balance_score': 2,
        'cognitive_score': 4,
        'medication_count': 7,
        'fall_history': 1,
        'vision_impairment': 1,
        'incontinence': 1,
        'assistive_device': 1
    }
    
    result = predict_fall_risk(resident_data)
    print("Prediction result:", result)
