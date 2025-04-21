import unittest
import requests
import json
import os
import sys

# Add the project root to the path
sys.path.append('/home/ubuntu/care-home-saas/care-home-saas')

# Base URL for API tests
BASE_URL = "http://localhost:8000"

class TestCareHomeSaaSAPI(unittest.TestCase):
    """Test cases for the Care Home SaaS API endpoints"""
    
    def setUp(self):
        """Set up test environment before each test"""
        # Ensure the API is running (in a real test environment, this would be handled by a test fixture)
        pass
        
    def test_api_root(self):
        """Test the API root endpoint"""
        response = requests.get(f"{BASE_URL}/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("message", data)
        self.assertEqual(data["message"], "Care Home SaaS API is running")
    
    def test_resident_fitment(self):
        """Test the resident fitment prediction endpoint"""
        payload = {
            "mobility_score": 3,
            "cognitive_score": 2,
            "adl_score": 3,
            "nutrition_score": 4,
            "medical_complexity_score": 3,
            "requires_secured_unit": True,
            "requires_bariatric_accommodation": False,
            "requires_iv_therapy": True,
            "requires_dialysis": False,
            "requires_ventilator": False,
            "facility_id": 1
        }
        
        response = requests.post(f"{BASE_URL}/api/resident-fitment", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Check that the response contains the expected fields
        self.assertIn("fitment_score", data)
        self.assertIn("recommendation", data)
        self.assertIn("reasoning", data)
        
        # Check that the fitment score is within the expected range
        self.assertGreaterEqual(data["fitment_score"], 0)
        self.assertLessEqual(data["fitment_score"], 100)
    
    def test_infection_outbreak(self):
        """Test the infection outbreak prediction endpoint"""
        payload = {
            "year": 2025,
            "week": 48,
            "staff_vaccination_rate": 75,
            "resident_vaccination_rate": 85,
            "seasonal_risk": 0.8,
            "previous_outbreaks": 0,
            "facility_size": 120,
            "staff_turnover": 0.15
        }
        
        response = requests.post(f"{BASE_URL}/api/infection-outbreak", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Check that the response contains the expected fields
        self.assertIn("risk_score", data)
        self.assertIn("high_risk_weeks", data)
        self.assertIn("key_factors", data)
        self.assertIn("recommendations", data)
        
        # Check that the risk score is within the expected range
        self.assertGreaterEqual(data["risk_score"], 0)
        self.assertLessEqual(data["risk_score"], 100)
    
    def test_fall_risk(self):
        """Test the fall risk prediction endpoint"""
        payload = {
            "age": 82,
            "gender": 1,
            "mobility_score": 3,
            "balance_score": 2,
            "cognitive_score": 4,
            "medication_count": 7,
            "fall_history": 1,
            "vision_impairment": 1,
            "incontinence": 1,
            "assistive_device": 1
        }
        
        response = requests.post(f"{BASE_URL}/api/fall-risk", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Check that the response contains the expected fields
        self.assertIn("risk_score", data)
        self.assertIn("risk_level", data)
        self.assertIn("risk_factors", data)
        self.assertIn("recommendations", data)
        
        # Check that the risk score is within the expected range
        self.assertGreaterEqual(data["risk_score"], 0)
        self.assertLessEqual(data["risk_score"], 100)
    
    def test_llm_support(self):
        """Test the LLM support endpoint"""
        payload = {
            "query": "A resident wants to refuse medication but family insists they take it. What should we do?",
            "scenario_type": "ethical_dilemma",
            "resident_id": 123
        }
        
        response = requests.post(f"{BASE_URL}/api/llm-support", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Check that the response contains the expected fields
        self.assertIn("success", data)
        self.assertIn("response", data)
        self.assertIn("scenario_type", data)
        
        # Check that the response was successful
        self.assertTrue(data["success"])
        
        # Check that the scenario type matches the request
        self.assertEqual(data["scenario_type"], "ethical_dilemma")
    
    def tearDown(self):
        """Clean up after each test"""
        pass

if __name__ == "__main__":
    unittest.main()
