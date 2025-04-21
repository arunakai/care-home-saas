import React from 'react';
import { useForm } from 'react-hook-form';
import AuthGuard from '@/components/auth/AuthGuard';
import { UserRole } from '@/lib/auth/auth-utils';

export default function ResidentFitmentPredictor() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      residentName: '',
      age: '',
      mobilityScore: '',
      cognitiveScore: '',
      adlScore: '',
      nutritionScore: '',
      medicalComplexityScore: '',
      requiresSecuredUnit: false,
      requiresBariatricAccommodation: false,
      requiresIvTherapy: false,
      requiresDialysis: false,
      requiresVentilator: false,
    }
  });

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
    // In a real implementation, this would call the ML model API
    // and display the prediction results
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

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">New Resident Assessment</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="residentName" className="block text-sm font-medium text-gray-700 mb-1">
                  Resident Name
                </label>
                <input
                  id="residentName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('residentName', { required: 'Resident name is required' })}
                />
                {errors.residentName && (
                  <p className="mt-1 text-sm text-red-600">{errors.residentName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('age', { 
                    required: 'Age is required',
                    min: { value: 18, message: 'Age must be at least 18' },
                    max: { value: 120, message: 'Age must be less than 120' }
                  })}
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                )}
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Assessment Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="mobilityScore" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobility Score (1-5)
                </label>
                <input
                  id="mobilityScore"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('mobilityScore', { 
                    required: 'Mobility score is required',
                    min: { value: 1, message: 'Score must be between 1-5' },
                    max: { value: 5, message: 'Score must be between 1-5' }
                  })}
                />
                {errors.mobilityScore && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobilityScore.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="cognitiveScore" className="block text-sm font-medium text-gray-700 mb-1">
                  Cognitive Score (1-5)
                </label>
                <input
                  id="cognitiveScore"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('cognitiveScore', { 
                    required: 'Cognitive score is required',
                    min: { value: 1, message: 'Score must be between 1-5' },
                    max: { value: 5, message: 'Score must be between 1-5' }
                  })}
                />
                {errors.cognitiveScore && (
                  <p className="mt-1 text-sm text-red-600">{errors.cognitiveScore.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="adlScore" className="block text-sm font-medium text-gray-700 mb-1">
                  ADL Score (1-5)
                </label>
                <input
                  id="adlScore"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('adlScore', { 
                    required: 'ADL score is required',
                    min: { value: 1, message: 'Score must be between 1-5' },
                    max: { value: 5, message: 'Score must be between 1-5' }
                  })}
                />
                {errors.adlScore && (
                  <p className="mt-1 text-sm text-red-600">{errors.adlScore.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="nutritionScore" className="block text-sm font-medium text-gray-700 mb-1">
                  Nutrition Score (1-5)
                </label>
                <input
                  id="nutritionScore"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('nutritionScore', { 
                    required: 'Nutrition score is required',
                    min: { value: 1, message: 'Score must be between 1-5' },
                    max: { value: 5, message: 'Score must be between 1-5' }
                  })}
                />
                {errors.nutritionScore && (
                  <p className="mt-1 text-sm text-red-600">{errors.nutritionScore.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="medicalComplexityScore" className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Complexity Score (1-5)
                </label>
                <input
                  id="medicalComplexityScore"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('medicalComplexityScore', { 
                    required: 'Medical complexity score is required',
                    min: { value: 1, message: 'Score must be between 1-5' },
                    max: { value: 5, message: 'Score must be between 1-5' }
                  })}
                />
                {errors.medicalComplexityScore && (
                  <p className="mt-1 text-sm text-red-600">{errors.medicalComplexityScore.message}</p>
                )}
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-3">Special Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center">
                <input
                  id="requiresSecuredUnit"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('requiresSecuredUnit')}
                />
                <label htmlFor="requiresSecuredUnit" className="ml-2 block text-sm text-gray-700">
                  Requires Secured Unit
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="requiresBariatricAccommodation"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('requiresBariatricAccommodation')}
                />
                <label htmlFor="requiresBariatricAccommodation" className="ml-2 block text-sm text-gray-700">
                  Requires Bariatric Accommodation
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="requiresIvTherapy"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('requiresIvTherapy')}
                />
                <label htmlFor="requiresIvTherapy" className="ml-2 block text-sm text-gray-700">
                  Requires IV Therapy
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="requiresDialysis"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('requiresDialysis')}
                />
                <label htmlFor="requiresDialysis" className="ml-2 block text-sm text-gray-700">
                  Requires Dialysis
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="requiresVentilator"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('requiresVentilator')}
                />
                <label htmlFor="requiresVentilator" className="ml-2 block text-sm text-gray-700">
                  Requires Ventilator
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Predict Fitment
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
