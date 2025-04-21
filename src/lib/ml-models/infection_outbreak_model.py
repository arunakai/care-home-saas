import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os
from datetime import datetime, timedelta

# Define the directory for saving models
MODEL_DIR = '/home/ubuntu/care-home-saas/care-home-saas/src/lib/ml-models'
os.makedirs(MODEL_DIR, exist_ok=True)

# Function to generate synthetic data for infection outbreak prediction
def generate_infection_outbreak_data(n_samples=1000):
    np.random.seed(42)
    
    # Generate dates spanning multiple years
    start_date = datetime(2020, 1, 1)
    dates = [start_date + timedelta(days=i*7) for i in range(n_samples)]  # Weekly data
    
    # Extract year and week number
    years = [date.year for date in dates]
    weeks = [date.isocalendar()[1] for date in dates]
    
    # Generate features
    staff_vaccination_rate = np.random.uniform(50, 100, n_samples)
    resident_vaccination_rate = np.random.uniform(60, 100, n_samples)
    
    # Seasonal factors - higher in winter months (weeks 1-10 and 45-52)
    seasonal_risk = np.zeros(n_samples)
    for i in range(n_samples):
        week = weeks[i]
        if week <= 10 or week >= 45:
            seasonal_risk[i] = np.random.uniform(0.6, 1.0)  # Higher risk in winter
        elif 11 <= week <= 20 or 35 <= week <= 44:
            seasonal_risk[i] = np.random.uniform(0.3, 0.6)  # Medium risk in spring/fall
        else:
            seasonal_risk[i] = np.random.uniform(0.1, 0.3)  # Lower risk in summer
    
    # Previous outbreaks (binary indicator for recent outbreaks)
    previous_outbreaks = np.zeros(n_samples)
    for i in range(5, n_samples):
        # Chance of outbreak influenced by previous weeks
        if np.mean(previous_outbreaks[i-5:i]) > 0.3:
            previous_outbreaks[i] = np.random.choice([0, 1], p=[0.6, 0.4])
        else:
            previous_outbreaks[i] = np.random.choice([0, 1], p=[0.9, 0.1])
    
    # Facility size factor (larger facilities have more risk)
    facility_size = np.random.randint(20, 200, n_samples)
    size_factor = facility_size / 200  # Normalize to 0-1
    
    # Staff turnover rate (higher turnover increases risk)
    staff_turnover = np.random.uniform(0.05, 0.4, n_samples)
    
    # Create a DataFrame
    data = pd.DataFrame({
        'year': years,
        'week': weeks,
        'staff_vaccination_rate': staff_vaccination_rate,
        'resident_vaccination_rate': resident_vaccination_rate,
        'seasonal_risk': seasonal_risk,
        'previous_outbreaks': previous_outbreaks,
        'facility_size': facility_size,
        'staff_turnover': staff_turnover
    })
    
    # Generate target (outbreak risk) based on features
    outbreak_risk = np.zeros(n_samples)
    
    for i in range(n_samples):
        # Base risk from seasonal factors
        base_risk = seasonal_risk[i] * 0.4
        
        # Adjust for vaccination rates (higher vaccination = lower risk)
        vaccination_factor = 0.5 - ((staff_vaccination_rate[i] + resident_vaccination_rate[i]) / 400)
        
        # Adjust for previous outbreaks
        previous_factor = 0.2 if previous_outbreaks[i] > 0 else 0
        
        # Adjust for facility size and staff turnover
        size_turnover_factor = (size_factor[i] * 0.1) + (staff_turnover[i] * 0.2)
        
        # Combine factors
        outbreak_risk[i] = base_risk + vaccination_factor + previous_factor + size_turnover_factor
    
    # Add some random noise
    outbreak_risk += np.random.normal(0, 0.05, n_samples)
    
    # Clip to 0-1 range
    outbreak_risk = np.clip(outbreak_risk, 0, 1)
    
    # Scale to 0-100
    outbreak_risk *= 100
    
    data['outbreak_risk'] = outbreak_risk
    
    return data

# Train the infection outbreak prediction model
def train_infection_outbreak_model():
    # Generate synthetic data
    data = generate_infection_outbreak_data()
    
    # Features and target
    X = data.drop(['outbreak_risk'], axis=1)
    y = data['outbreak_risk']
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train regression model for outbreak risk
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_scaled, y)
    
    # Save model and scaler
    joblib.dump(scaler, os.path.join(MODEL_DIR, 'infection_outbreak_scaler.pkl'))
    joblib.dump(model, os.path.join(MODEL_DIR, 'infection_outbreak_model.pkl'))
    
    print("Infection Outbreak Prediction model trained and saved successfully.")
    
    return scaler, model

# Function to predict infection outbreak risk
def predict_infection_outbreak(input_data):
    # Load model and scaler
    scaler = joblib.load(os.path.join(MODEL_DIR, 'infection_outbreak_scaler.pkl'))
    model = joblib.load(os.path.join(MODEL_DIR, 'infection_outbreak_model.pkl'))
    
    # Convert input data to DataFrame
    input_df = pd.DataFrame([input_data])
    
    # Scale input data
    input_scaled = scaler.transform(input_df)
    
    # Make prediction
    risk_score = model.predict(input_scaled)[0]
    
    # Get feature importances for this prediction
    feature_importances = dict(zip(input_df.columns, model.feature_importances_))
    
    # Sort features by importance
    sorted_importances = sorted(feature_importances.items(), key=lambda x: x[1], reverse=True)
    
    # Generate weeks with highest risk
    year = input_data['year']
    predicted_week = input_data['week']
    
    # Find high-risk weeks based on seasonal patterns
    high_risk_weeks = []
    
    # Winter weeks
    winter_weeks = list(range(1, 11)) + list(range(45, 53))
    for week in winter_weeks:
        if abs(week - predicted_week) <= 4:  # Within a month of predicted week
            high_risk_weeks.append(week)
    
    # Sort by risk (closer to predicted week = higher risk)
    high_risk_weeks.sort(key=lambda w: abs(w - predicted_week))
    
    # Generate recommendations based on risk score
    recommendations = []
    
    if risk_score > 70:
        recommendations.append("High outbreak risk detected. Implement full infection control protocols.")
        recommendations.append("Increase cleaning frequency in common areas and high-touch surfaces.")
        recommendations.append("Consider visitor restrictions during high-risk weeks.")
        recommendations.append("Ensure all staff are up-to-date on vaccinations.")
    elif risk_score > 40:
        recommendations.append("Moderate outbreak risk detected. Review infection control procedures.")
        recommendations.append("Increase hand hygiene compliance monitoring.")
        recommendations.append("Ensure adequate PPE supplies are available.")
        recommendations.append("Consider screening visitors for symptoms during high-risk weeks.")
    else:
        recommendations.append("Low outbreak risk detected. Maintain standard infection control practices.")
        recommendations.append("Continue regular staff education on infection prevention.")
        recommendations.append("Monitor for any early signs of infection among residents.")
    
    # Add vaccination-specific recommendations
    if input_data['staff_vaccination_rate'] < 80:
        recommendations.append("Increase staff vaccination rate to reduce outbreak risk.")
    if input_data['resident_vaccination_rate'] < 85:
        recommendations.append("Increase resident vaccination rate to reduce outbreak risk.")
    
    return {
        'risk_score': round(float(risk_score), 1),
        'high_risk_weeks': high_risk_weeks[:3],  # Top 3 high-risk weeks
        'key_factors': [factor for factor, _ in sorted_importances[:3]],  # Top 3 factors
        'recommendations': recommendations
    }

if __name__ == "__main__":
    # Train the model
    train_infection_outbreak_model()
    
    # Test prediction with sample data
    input_data = {
        'year': 2025,
        'week': 48,
        'staff_vaccination_rate': 75,
        'resident_vaccination_rate': 85,
        'seasonal_risk': 0.8,
        'previous_outbreaks': 0,
        'facility_size': 120,
        'staff_turnover': 0.15
    }
    
    result = predict_infection_outbreak(input_data)
    print("Prediction result:", result)
