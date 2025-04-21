import unittest
import os
import sys
from unittest.mock import patch, MagicMock

# Add the project root to the path
sys.path.append('/home/ubuntu/care-home-saas/care-home-saas')

# Import the ML models
sys.path.append('/home/ubuntu/care-home-saas/care-home-saas/src/lib/ml-models')
from resident_fitment_model import predict_resident_fitment
from infection_outbreak_model import predict_infection_outbreak
from falls_prediction_model import predict_fall_risk
from llm_support_agent import get_llm_support_agent

class TestMLModels(unittest.TestCase):
    """Test cases for the ML models"""
    
    def test_resident_fitment_model(self):
        """Test the resident fitment prediction model"""
        # Test input data
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
        
        # Call the prediction function
        result = predict_resident_fitment(resident_data, facility_data)
        
        # Check that the result contains the expected fields
        self.assertIn('fitment_score', result)
        self.assertIn('recommendation', result)
        self.assertIn('reasoning', result)
        
        # Check that the fitment score is within the expected range
        self.assertGreaterEqual(result['fitment_score'], 0)
        self.assertLessEqual(result['fitment_score'], 100)
        
        # Check that the reasoning is a list with at least one item
        self.assertIsInstance(result['reasoning'], list)
        self.assertGreater(len(result['reasoning']), 0)
    
    def test_infection_outbreak_model(self):
        """Test the infection outbreak prediction model"""
        # Test input data
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
        
        # Call the prediction function
        result = predict_infection_outbreak(input_data)
        
        # Check that the result contains the expected fields
        self.assertIn('risk_score', result)
        self.assertIn('high_risk_weeks', result)
        self.assertIn('key_factors', result)
        self.assertIn('recommendations', result)
        
        # Check that the risk score is within the expected range
        self.assertGreaterEqual(result['risk_score'], 0)
        self.assertLessEqual(result['risk_score'], 100)
        
        # Check that high_risk_weeks is a list
        self.assertIsInstance(result['high_risk_weeks'], list)
        
        # Check that recommendations is a list with at least one item
        self.assertIsInstance(result['recommendations'], list)
        self.assertGreater(len(result['recommendations']), 0)
    
    def test_falls_prediction_model(self):
        """Test the falls prediction model"""
        # Test input data
        resident_data = {
            'age': 82,
            'gender': 1,
            'mobility_score': 3,
            'balance_score': 2,
            'cognitive_score': 4,
            'medication_count': 7,
            'fall_history': 1,
            'vision_impairment': 1,
            'incontinence': 1,
            'assistive_device': 1
        }
        
        # Call the prediction function
        result = predict_fall_risk(resident_data)
        
        # Check that the result contains the expected fields
        self.assertIn('risk_score', result)
        self.assertIn('risk_level', result)
        self.assertIn('risk_factors', result)
        self.assertIn('recommendations', result)
        
        # Check that the risk score is within the expected range
        self.assertGreaterEqual(result['risk_score'], 0)
        self.assertLessEqual(result['risk_score'], 100)
        
        # Check that risk_level is one of the expected values
        self.assertIn(result['risk_level'], ["Low Risk", "Medium Risk", "High Risk"])
        
        # Check that risk_factors and recommendations are lists
        self.assertIsInstance(result['risk_factors'], list)
        self.assertIsInstance(result['recommendations'], list)
    
    def test_llm_support_agent(self):
        """Test the LLM support agent"""
        # Initialize the LLM support agent
        agent = get_llm_support_agent()
        
        # Test input data
        query = "A resident wants to refuse medication but family insists they take it. What should we do?"
        scenario_type = "ethical_dilemma"
        
        # Call the process_query function
        result = agent.process_query(query, scenario_type)
        
        # Check that the result contains the expected fields
        self.assertIn('success', result)
        self.assertIn('response', result)
        self.assertIn('scenario_type', result)
        
        # Check that the response was successful
        self.assertTrue(result['success'])
        
        # Check that the scenario type matches the input
        self.assertEqual(result['scenario_type'], scenario_type)
        
        # Check that the response is a non-empty string
        self.assertIsInstance(result['response'], str)
        self.assertGreater(len(result['response']), 0)

if __name__ == "__main__":
    unittest.main()
