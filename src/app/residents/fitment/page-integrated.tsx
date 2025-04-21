import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthGuard from '@/components/auth/AuthGuard';
import { UserRole } from '@/lib/auth/auth-utils';

export default function ResidentFitmentPredictorIntegrated() {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      mobility_score: 3,
      cognitive_score: 3,
      adl_score: 3,
      nutrition_score: 3,
      medical_complexity_score: 3,
      requires_secured_unit: false,
      requires_bariatric_accommodation: false,
      requires_iv_therapy: false,
      requires_dialysis: false,
      requires_ventilator: false,
      facility_id: 1
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Convert boolean values to match API expectations
      const apiData = {
        ...data,
        requires_secured_unit: data.requires_secured_unit,
        requires_bariatric_accommodation: data.requires_bariatric_accommodation,
        requires_iv_therapy: data.requires_iv_therapy,
        requires_dialysis: data.requires_dialysis,
        requires_ventilator: data.requires_ventilator
      };

      // Call the API
      const response = await fetch('/api/resident-fitment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard allowedRoles={[UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Resident-Home Fitment Predictor</h1>
          <p className="mt-1 text-sm text-gray-600">
            Predict the fitment of a new applicant based on your facility's capabilities and the resident's needs.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Facility Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h3 className="font-medium text-blue-800">Secured Unit Beds</h3>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-medium text-green-800">Short Stay Beds</h3>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div className="p-4 border rounded-lg bg-purple-50">
              <h3 className="font-medium text-purple-800">Bariatric Beds</h3>
              <p className="text-2xl font-bold">4</p>
            </div>
            <div className="p-4 border rounded-lg bg-yellow-50">
              <h3 className="font-medium text-yellow-800">IV Therapy</h3>
              <p className="text-2xl font-bold">Available</p>
            </div>
            <div className="p-4 border rounded-lg bg-red-50">
              <h3 className="font-medium text-red-800">Dialysis</h3>
              <p className="text-2xl font-bold">Available</p>
            </div>
            <div className="p-4 border rounded-lg bg-indigo-50">
              <h3 className="font-medium text-indigo-800">Ventilator Support</h3>
              <p className="text-2xl font-bold">Not Available</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">New Resident Assessment</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label htmlFor="facility_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Facility
                </label>
                <select
                  id="facility_id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('facility_id', { required: 'Facility is required' })}
                >
                  <option value="1">Main Facility</option>
                  <option value="2">North Wing</option>
                  <option value="3">South Wing</option>
                </select>
                {errors.facility_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.facility_id.message}</p>
                )}
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Assessment Scores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="mobility_score" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobility Score (1-5)
                  </label>
                  <input
                    id="mobility_score"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('mobility_score', { 
                      required: 'Mobility score is required',
                      min: { value: 1, message: 'Score must be between 1-5' },
                      max: { value: 5, message: 'Score must be between 1-5' }
                    })}
                  />
                  {errors.mobility_score && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobility_score.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="cognitive_score" className="block text-sm font-medium text-gray-700 mb-1">
                    Cognitive Score (1-5)
                  </label>
                  <input
                    id="cognitive_score"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('cognitive_score', { 
                      required: 'Cognitive score is required',
                      min: { value: 1, message: 'Score must be between 1-5' },
                      max: { value: 5, message: 'Score must be between 1-5' }
                    })}
                  />
                  {errors.cognitive_score && (
                    <p className="mt-1 text-sm text-red-600">{errors.cognitive_score.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="adl_score" className="block text-sm font-medium text-gray-700 mb-1">
                    ADL Score (1-5)
                  </label>
                  <input
                    id="adl_score"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('adl_score', { 
                      required: 'ADL score is required',
                      min: { value: 1, message: 'Score must be between 1-5' },
                      max: { value: 5, message: 'Score must be between 1-5' }
                    })}
                  />
                  {errors.adl_score && (
                    <p className="mt-1 text-sm text-red-600">{errors.adl_score.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="nutrition_score" className="block text-sm font-medium text-gray-700 mb-1">
                    Nutrition Score (1-5)
                  </label>
                  <input
                    id="nutrition_score"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('nutrition_score', { 
                      required: 'Nutrition score is required',
                      min: { value: 1, message: 'Score must be between 1-5' },
                      max: { value: 5, message: 'Score must be between 1-5' }
                    })}
                  />
                  {errors.nutrition_score && (
                    <p className="mt-1 text-sm text-red-600">{errors.nutrition_score.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="medical_complexity_score" className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Complexity Score (1-5)
                  </label>
                  <input
                    id="medical_complexity_score"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('medical_complexity_score', { 
                      required: 'Medical complexity score is required',
                      min: { value: 1, message: 'Score must be between 1-5' },
                      max: { value: 5, message: 'Score must be between 1-5' }
                    })}
                  />
                  {errors.medical_complexity_score && (
                    <p className="mt-1 text-sm text-red-600">{errors.medical_complexity_score.message}</p>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Special Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <input
                    id="requires_secured_unit"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    {...register('requires_secured_unit')}
                  />
                  <label htmlFor="requires_secured_unit" className="ml-2 block text-sm text-gray-700">
                    Requires Secured Unit
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="requires_bariatric_accommodation"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    {...register('requires_bariatric_accommodation')}
                  />
                  <label htmlFor="requires_bariatric_accommodation" className="ml-2 block text-sm text-gray-700">
                    Requires Bariatric Accommodation
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="requires_iv_therapy"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    {...register('requires_iv_therapy')}
                  />
                  <label htmlFor="requires_iv_therapy" className="ml-2 block text-sm text-gray-700">
                    Requires IV Therapy
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="requires_dialysis"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    {...register('requires_dialysis')}
                  />
                  <label htmlFor="requires_dialysis" className="ml-2 block text-sm text-gray-700">
                    Requires Dialysis
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="requires_ventilator"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    {...register('requires_ventilator')}
                  />
                  <label htmlFor="requires_ventilator" className="ml-2 block text-sm text-gray-700">
                    Requires Ventilator
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Predict Fitment'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Prediction Results</h2>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <svg
                  className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="mt-4 text-gray-600">Analyzing fitment...</p>
              </div>
            ) : prediction ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Fitment Score</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className={`h-4 rounded-full ${
                        prediction.fitment_score >= 80 ? 'bg-green-600' : 
                        prediction.fitment_score >= 60 ? 'bg-yellow-500' : 'bg-red-600'
                      }`}
                      style={{ width: `${prediction.fitment_score}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Poor Fit</span>
                    <span className={`font-medium ${
                      prediction.fitment_score >= 80 ? 'text-green-600' : 
                      prediction.fitment_score >= 60 ? 'text-yellow-500' : 'text-red-600'
                    }`}>
                      {prediction.fitment_score}/100
                    </span>
                    <span className="text-green-600">Excellent Fit</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Recommendation</h3>
                  <div className={`p-4 rounded-lg ${
                    prediction.recommendation.includes("Excellent") ? 'bg-green-100 text-green-800' : 
                    prediction.recommendation.includes("Good") ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <p className="font-medium">{prediction.recommendation}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Reasoning</h3>
                  <ul className="space-y-2">
                    {prediction.reasoning.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-blue-500">
                          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        </span>
                        <span className="ml-2">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    onClick={() => {
                      // In a real implementation, this would save the prediction to the database
                      alert('Prediction saved to resident record');
                    }}
                  >
                    Save to Resident Record
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <svg
                  className="h-16 w-16 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  ></path>
                </svg>
                <p>Complete the assessment form to see prediction results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
