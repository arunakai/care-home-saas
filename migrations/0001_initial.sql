-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  facility_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facilities table
CREATE TABLE facilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  secured_unit_beds INTEGER DEFAULT 0,
  short_stay_beds INTEGER DEFAULT 0,
  bariatric_beds INTEGER DEFAULT 0,
  iv_therapy_available BOOLEAN DEFAULT FALSE,
  dialysis_available BOOLEAN DEFAULT FALSE,
  ventilator_available BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Residents table
CREATE TABLE residents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  facility_id INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  admission_date DATE,
  mobility_score INTEGER,
  cognitive_score INTEGER,
  adl_score INTEGER,
  nutrition_score INTEGER,
  medical_complexity_score INTEGER,
  requires_secured_unit BOOLEAN DEFAULT FALSE,
  requires_bariatric_accommodation BOOLEAN DEFAULT FALSE,
  requires_iv_therapy BOOLEAN DEFAULT FALSE,
  requires_dialysis BOOLEAN DEFAULT FALSE,
  requires_ventilator BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities (id)
);

-- Fitment predictions table
CREATE TABLE fitment_predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resident_id INTEGER,
  facility_id INTEGER NOT NULL,
  fitment_score REAL NOT NULL,
  recommendation TEXT NOT NULL,
  reasoning TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents (id),
  FOREIGN KEY (facility_id) REFERENCES facilities (id)
);

-- Infection outbreak predictions table
CREATE TABLE infection_predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  facility_id INTEGER NOT NULL,
  year INTEGER NOT NULL,
  week INTEGER NOT NULL,
  risk_score REAL NOT NULL,
  high_risk_weeks TEXT,
  key_factors TEXT,
  recommendations TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities (id)
);

-- Fall risk assessments table
CREATE TABLE fall_risk_assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resident_id INTEGER NOT NULL,
  risk_score REAL NOT NULL,
  risk_level TEXT NOT NULL,
  risk_factors TEXT,
  recommendations TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents (id)
);

-- PDF summaries table
CREATE TABLE pdf_summaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  original_filename TEXT NOT NULL,
  summary TEXT NOT NULL,
  key_points TEXT,
  original_length INTEGER,
  summary_length INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Meal intake measurements table
CREATE TABLE meal_intake_measurements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resident_id INTEGER NOT NULL,
  meal_type TEXT NOT NULL,
  percentage_consumed REAL NOT NULL,
  calories_estimated INTEGER,
  protein_estimated REAL,
  food_items TEXT,
  image_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents (id)
);

-- Nurse dictations table
CREATE TABLE nurse_dictations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  resident_id INTEGER NOT NULL,
  note_type TEXT NOT NULL,
  raw_transcription TEXT NOT NULL,
  formatted_note TEXT NOT NULL,
  audio_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (resident_id) REFERENCES residents (id)
);

-- LLM consultations table
CREATE TABLE llm_consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  resident_id INTEGER,
  scenario_type TEXT NOT NULL,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (resident_id) REFERENCES residents (id)
);

-- Insert sample facility
INSERT INTO facilities (name, address, city, province, postal_code, phone, email, secured_unit_beds, short_stay_beds, bariatric_beds, iv_therapy_available, dialysis_available, ventilator_available)
VALUES ('Maple Leaf Care Home', '123 Maple Street', 'Toronto', 'Ontario', 'M5V 2L7', '416-555-1234', 'info@mapleleafcare.ca', 12, 8, 4, TRUE, TRUE, FALSE);

-- Insert sample admin user
INSERT INTO users (email, password_hash, name, role, facility_id)
VALUES ('admin@mapleleafcare.ca', 'a0.IrOvnKOWYpnOK9YGZm3JMhYfQQNqL4tK9n7vLe', 'Admin User', 'SUPER_ADMIN', 1);
