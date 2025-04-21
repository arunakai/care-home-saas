import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthGuard from '@/components/auth/AuthGuard';
import { UserRole } from '@/lib/auth/auth-utils';

export default function InfectionOutbreakPredictorIntegrated() {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      year: new Date().getFullYear(),
      week: Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1,
      staff_vaccination_rate: 85,
      resident_vaccination_rate: 90,
      seasonal_risk: 0.5,
      previous_outbreaks: 0,
      facility_size: 120,
      staff_turnover: 0.15
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Call the API
      const response = await fetch('/api/infection-outbreak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
    <AuthGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Infection Outbreak Predictor</h1>
          <p className="mt-1 text-sm text-gray-600">
            Predict potential infection outbreaks using ML and deep learning models trained on historical data.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Historical Outbreaks</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Week
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Infection Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Affected Residents
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Affected Staff
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2024</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Influenza A</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Moderate
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2024</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Norovirus</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Mild
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2023</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">48</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">COVID-19</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Severe
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Predict Outbreaks</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Year to Predict
                  </label>
                  <input
                    id="year"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('year', { 
                      required: 'Year is required',
                      min: { value: 2025, message: 'Year must be 2025 or later' },
                      max: { value: 2030, message: 'Year must be 2030 or earlier' }
                    })}
                  />
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="week" className="block text-sm font-medium text-gray-700 mb-1">
                    Week Number (1-52)
                  </label>
                  <input
                    id="week"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('week', { 
                      required: 'Week is required',
                      min: { value: 1, message: 'Week must be between 1-52' },
                      max: { value: 52, message: 'Week must be between 1-52' }
                    })}
                  />
                  {errors.week && (
                    <p className="mt-1 text-sm text-red-600">{errors.week.message}</p>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Prediction Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="staff_vaccination_rate" className="block text-sm font-medium text-gray-700 mb-1">
                    Staff Vaccination Rate (%)
                  </label>
                  <input
                    id="staff_vaccination_rate"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('staff_vaccination_rate', { 
                      required: 'Staff vaccination rate is required',
                      min: { value: 0, message: 'Rate must be between 0-100' },
                      max: { value: 100, message: 'Rate must be between 0-100' }
                    })}
                  />
                  {errors.staff_vaccination_rate && (
                    <p className="mt-1 text-sm text-red-600">{errors.staff_vaccination_rate.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="resident_vaccination_rate" className="block text-sm font-medium text-gray-700 mb-1">
                    Resident Vaccination Rate (%)
                  </label>
                  <input
                    id="resident_vaccination_rate"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('resident_vaccination_rate', { 
                      required: 'Resident vaccination rate is required',
                      min: { value: 0, message: 'Rate must be between 0-100' },
                      max: { value: 100, message: 'Rate must be between 0-100' }
                    })}
                  />
                  {errors.resident_vaccination_rate && (
                    <p className="mt-1 text-sm text-red-600">{errors.resident_vaccination_rate.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="seasonal_risk" className="block text-sm font-medium text-gray-700 mb-1">
                    Seasonal Risk Factor (0-1)
                  </label>
                  <input
                    id="seasonal_risk"
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('seasonal_risk', { 
                      required: 'Seasonal risk is required',
                      min: { value: 0, message: 'Risk must be between 0-1' },
                      max: { value: 1, message: 'Risk must be between 0-1' }
                    })}
                  />
                  {errors.seasonal_risk && (
                    <p className="mt-1 text-sm text-red-600">{errors.seasonal_risk.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="previous_outbreaks" className="block text-sm font-medium text-gray-700 mb-1">
                    Previous Outbreaks (Recent)
                  </label>
                  <input
                    id="previous_outbreaks"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('previous_outbreaks', { 
                      required: 'Previous outbreaks is required',
                      min: { value: 0, message: 'Must be 0 or greater' }
                    })}
                  />
                  {errors.previous_outbreaks && (
                    <p className="mt-1 text-sm text-red-600">{errors.previous_outbreaks.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="facility_size" className="block text-sm font-medium text-gray-700 mb-1">
                    Facility Size (Beds)
                  </label>
                  <input
                    id="facility_size"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('facility_size', { 
                      required: 'Facility size is required',
                      min: { value: 1, message: 'Size must be at least 1' }
                    })}
                  />
                  {errors.facility_size && (
                    <p className="mt-1 text-sm text-red-600">{errors.facility_size.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="staff_turnover" className="block text-sm font-medium text-gray-700 mb-1">
                    Staff Turnover Rate (0-1)
                  </label>
                  <input
                    id="staff_turnover"
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('staff_turnover', { 
                      required: 'Staff turnover is required',
                      min: { value: 0, message: 'Rate must be between 0-1' },
                      max: { value: 1, message: 'Rate must be between 0-1' }
                    })}
                  />
                  {errors.staff_turnover && (
                    <p className="mt-1 text-sm text-red-600">{errors.staff_turnover.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Generate Prediction'}
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
                <p className="mt-4 text-gray-600">Analyzing outbreak risk...</p>
              </div>
            ) : prediction ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Risk Score</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className={`h-4 rounded-full ${
                        prediction.risk_score >= 70 ? 'bg-red-600' : 
                        prediction.risk_score >= 40 ? 'bg-yellow-500' : 'bg-green-600'
                      }`}
                      style={{ width: `${prediction.risk_score}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Low Risk</span>
                    <span className={`font-medium ${
                      prediction.risk_score >= 70 ? 'text-red-600' : 
                      prediction.risk_score >= 40 ? 'text-yellow-500' : 'text-green-600'
                    }`}>
                      {prediction.risk_score}/100
                    </span>
                    <span className="text-red-600">High Risk</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">High Risk Weeks</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {prediction.high_risk_weeks.map((week, index) => (
                      <div key={index} className="p-3 bg-red-100 text-red-800 rounded-lg text-center">
                        <p className="text-sm font-medium">Week {week}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Key Risk Factors</h3>
                  <div className="space-y-2">
                    {prediction.key_factors.map((factor, index) => (
                      <div key={index} className="p-2 bg-gray-100 rounded-lg">
                        <p className="text-sm font-medium text-gray-800">{factor.replace(/_/g, ' ').toUpperCase()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Recommendations</h3>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-blue-500">
                          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                        </span>
                        <span className="ml-2">{recommendation}</span>
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
                      alert('Prediction saved to facility records');
                    }}
                  >
                    Save to Facility Records
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
                <p>Complete the form to see prediction results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
