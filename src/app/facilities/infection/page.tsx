import React from 'react';
import { useForm } from 'react-hook-form';
import AuthGuard from '@/components/auth/AuthGuard';
import { UserRole } from '@/lib/auth/auth-utils';

export default function InfectionOutbreakPredictor() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      facilityId: '1',
      year: new Date().getFullYear().toString(),
      historicalData: 'true',
      seasonalFactors: 'true',
      staffVaccinationRate: '85',
      residentVaccinationRate: '90',
      infectionTypes: ['influenza', 'covid19', 'norovirus']
    }
  });

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
    // In a real implementation, this would call the ML model API
    // and display the prediction results
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

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Predict Outbreaks</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="facilityId" className="block text-sm font-medium text-gray-700 mb-1">
                  Facility
                </label>
                <select
                  id="facilityId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('facilityId', { required: 'Facility is required' })}
                >
                  <option value="1">Main Facility</option>
                  <option value="2">North Wing</option>
                  <option value="3">South Wing</option>
                </select>
                {errors.facilityId && (
                  <p className="mt-1 text-sm text-red-600">{errors.facilityId.message}</p>
                )}
              </div>
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
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Prediction Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="historicalData" className="block text-sm font-medium text-gray-700 mb-1">
                  Include Historical Data
                </label>
                <select
                  id="historicalData"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('historicalData')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label htmlFor="seasonalFactors" className="block text-sm font-medium text-gray-700 mb-1">
                  Include Seasonal Factors
                </label>
                <select
                  id="seasonalFactors"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('seasonalFactors')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label htmlFor="staffVaccinationRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Staff Vaccination Rate (%)
                </label>
                <input
                  id="staffVaccinationRate"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('staffVaccinationRate', { 
                    required: 'Staff vaccination rate is required',
                    min: { value: 0, message: 'Rate must be between 0-100' },
                    max: { value: 100, message: 'Rate must be between 0-100' }
                  })}
                />
                {errors.staffVaccinationRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.staffVaccinationRate.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="residentVaccinationRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Resident Vaccination Rate (%)
                </label>
                <input
                  id="residentVaccinationRate"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('residentVaccinationRate', { 
                    required: 'Resident vaccination rate is required',
                    min: { value: 0, message: 'Rate must be between 0-100' },
                    max: { value: 100, message: 'Rate must be between 0-100' }
                  })}
                />
                {errors.residentVaccinationRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.residentVaccinationRate.message}</p>
                )}
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Infection Types to Monitor</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center">
                <input
                  id="influenza"
                  type="checkbox"
                  value="influenza"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('infectionTypes')}
                />
                <label htmlFor="influenza" className="ml-2 block text-sm text-gray-700">
                  Influenza
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="covid19"
                  type="checkbox"
                  value="covid19"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('infectionTypes')}
                />
                <label htmlFor="covid19" className="ml-2 block text-sm text-gray-700">
                  COVID-19
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="norovirus"
                  type="checkbox"
                  value="norovirus"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('infectionTypes')}
                />
                <label htmlFor="norovirus" className="ml-2 block text-sm text-gray-700">
                  Norovirus
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="c_diff"
                  type="checkbox"
                  value="c_diff"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('infectionTypes')}
                />
                <label htmlFor="c_diff" className="ml-2 block text-sm text-gray-700">
                  C. difficile
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="mrsa"
                  type="checkbox"
                  value="mrsa"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('infectionTypes')}
                />
                <label htmlFor="mrsa" className="ml-2 block text-sm text-gray-700">
                  MRSA
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="vre"
                  type="checkbox"
                  value="vre"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('infectionTypes')}
                />
                <label htmlFor="vre" className="ml-2 block text-sm text-gray-700">
                  VRE
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Generate Prediction
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
