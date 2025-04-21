import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os
import matplotlib.pyplot as plt
import joblib

# Define the directory for saving models
MODEL_DIR = '/home/ubuntu/care-home-saas/care-home-saas/src/lib/ml-models'
os.makedirs(MODEL_DIR, exist_ok=True)

# Function to generate synthetic data for meal intake measurement
def generate_meal_intake_data(n_samples=500):
    # This would normally use real images, but for this example we'll create synthetic data
    # In a real implementation, you would use a dataset of meal images with consumption labels
    
    # Create synthetic images (random noise patterns)
    images = []
    consumption_percentages = []
    
    for i in range(n_samples):
        # Create a random "meal" image (100x100 pixels)
        img = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
        
        # Add some structure to simulate food
        center_x, center_y = np.random.randint(30, 70, 2)
        radius = np.random.randint(20, 40)
        color = np.random.randint(100, 255, 3)
        
        # Draw a circle to represent a plate
        cv2.circle(img, (center_x, center_y), radius, (255, 255, 255), 2)
        
        # Simulate food on plate with varying amounts
        consumption = np.random.uniform(0, 1)  # Random consumption percentage
        food_radius = int(radius * (1 - consumption))
        
        if food_radius > 0:
            cv2.circle(img, (center_x, center_y), food_radius, tuple(color.tolist()), -1)
        
        images.append(img)
        consumption_percentages.append(consumption * 100)  # Convert to percentage
    
    return np.array(images), np.array(consumption_percentages)

# Function to create and train a CNN model for meal intake measurement
def train_meal_intake_model():
    # Generate synthetic data
    X, y = generate_meal_intake_data()
    
    # Normalize pixel values
    X = X.astype('float32') / 255.0
    
    # Split data into training and validation sets
    split_idx = int(len(X) * 0.8)
    X_train, X_val = X[:split_idx], X[split_idx:]
    y_train, y_val = y[:split_idx], y[split_idx:]
    
    # Create a simple CNN model
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=(100, 100, 3)),
        MaxPooling2D((2, 2)),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Flatten(),
        Dense(128, activation='relu'),
        Dropout(0.5),
        Dense(1, activation='linear')  # Regression output for percentage
    ])
    
    # Compile the model
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    
    # Train the model
    history = model.fit(
        X_train, y_train,
        epochs=10,
        batch_size=32,
        validation_data=(X_val, y_val),
        verbose=1
    )
    
    # Save the model
    model.save(os.path.join(MODEL_DIR, 'meal_intake_model.h5'))
    
    print("Meal Intake Measurement model trained and saved successfully.")
    
    return model, history

# Function to preprocess an image for prediction
def preprocess_image(image_path):
    # Load and preprocess the image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image at {image_path}")
    
    # Resize to expected input size
    img = cv2.resize(img, (100, 100))
    
    # Normalize pixel values
    img = img.astype('float32') / 255.0
    
    return img

# Function to analyze meal intake from an image
def analyze_meal_intake(image_path):
    try:
        # Load the model
        model = tf.keras.models.load_model(os.path.join(MODEL_DIR, 'meal_intake_model.h5'))
        
        # Preprocess the image
        img = preprocess_image(image_path)
        
        # Make prediction
        img_batch = np.expand_dims(img, axis=0)
        percentage_consumed = float(model.predict(img_batch)[0][0])
        
        # Ensure percentage is within valid range
        percentage_consumed = max(0, min(100, percentage_consumed))
        
        # Estimate calories and protein based on percentage consumed
        # In a real implementation, this would be based on the specific meal
        base_calories = 500  # Example base calories for a full meal
        base_protein = 20    # Example base protein (g) for a full meal
        
        calories_estimated = int(base_calories * (percentage_consumed / 100))
        protein_estimated = round(base_protein * (percentage_consumed / 100), 1)
        
        # Simulate food item detection
        # In a real implementation, this would use object detection models
        food_items = [
            {"name": "Chicken", "consumed": f"{np.random.randint(60, 100)}%"},
            {"name": "Rice", "consumed": f"{np.random.randint(40, 90)}%"},
            {"name": "Vegetables", "consumed": f"{np.random.randint(30, 80)}%"},
            {"name": "Bread Roll", "consumed": f"{np.random.randint(0, 100)}%"}
        ]
        
        return {
            "success": True,
            "percentageConsumed": round(percentage_consumed, 1),
            "caloriesEstimated": calories_estimated,
            "proteinEstimated": protein_estimated,
            "foodItems": food_items
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# Function to visualize meal intake analysis
def visualize_meal_intake(image_path, analysis_result):
    if not analysis_result["success"]:
        return None
    
    # Load the image
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Create figure
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
    
    # Display original image
    ax1.imshow(img)
    ax1.set_title("Original Meal Image")
    ax1.axis('off')
    
    # Create consumption visualization
    percentage = analysis_result["percentageConsumed"]
    labels = ['Consumed', 'Remaining']
    sizes = [percentage, 100 - percentage]
    colors = ['#ff9999', '#66b3ff']
    
    ax2.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=90)
    ax2.axis('equal')
    ax2.set_title(f"Meal Consumption: {percentage}%")
    
    # Add text with nutritional information
    fig.text(0.5, 0.02, 
             f"Estimated Calories: {analysis_result['caloriesEstimated']} kcal | " +
             f"Estimated Protein: {analysis_result['proteinEstimated']}g",
             ha='center', fontsize=12)
    
    # Save visualization
    output_path = image_path.replace('.jpg', '_analysis.jpg').replace('.png', '_analysis.png')
    plt.savefig(output_path)
    plt.close()
    
    return output_path

if __name__ == "__main__":
    # Train the model
    model, history = train_meal_intake_model()
    
    # In a real implementation, you would test with actual meal images
    # For this example, we'll just print a message
    print("Model ready for meal intake analysis.")
