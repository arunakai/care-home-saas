'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import AuthGuard from '@/components/auth/AuthGuard';
import { UserRole } from '@/lib/auth/auth-utils';

export default function ResidentFitmentPredictor() {
  // Debug check for useForm availability
  useEffect(() => {
    if (!useForm) {
      console.warn('⚠️ react-hook-form: useForm() is not available. Please verify the package version.');
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
    },
  });

  const onSubmit = (data: any) => {
    console.log('✅ Submitted Form Data:', data);
    // Call to ML model or prediction service would go here
  };

  return (
    <AuthGuard allowedRoles={[UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Resident-Home Fitment Predictor
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Predict how well a new resident fits into your facility’s capabilities.
        </p>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">New Resident Assessment</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Resident Name</label>
                <input
                  type="text"
                  {...register('residentName', { required: 'Required' })}
                  className="form-input"
                />
                {errors.residentName && (
                  <p className="text-sm text-red-600">{errors.residentName.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Age</label>
                <input
                  type="number"
                  {...register('age', {
                    required: 'Required',
                    min: { value: 18, message: 'Min age is 18' },
                    max: { value: 120, message: 'Max age is 120' },
                  })}
                  className="form-input"
                />
                {errors.age && <p className="text-sm text-red-600">{errors.age.message}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Mobility Score (1-5)</label>
                <input
                  type="number"
                  {...register('mobilityScore', {
                    required: 'Required',
                    min: 1,
                    max: 5,
                  })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Cognitive Score (1-5)</label>
                <input
                  type="number"
                  {...register('cognitiveScore', {
                    required: 'Required',
                    min: 1,
                    max: 5,
                  })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">ADL Score (1-5)</label>
                <input
                  type="number"
                  {...register('adlScore', {
                    required: 'Required',
                    min: 1,
                    max: 5,
                  })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Nutrition Score (1-5)</label>
                <input
                  type="number"
                  {...register('nutritionScore', {
                    required: 'Required',
                    min: 1,
                    max: 5,
                  })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Medical Complexity (1-5)</label>
                <input
                  type="number"
                  {...register('medicalComplexityScore', {
                    required: 'Required',
                    min: 1,
                    max: 5,
                  })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Special Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  ['requiresSecuredUnit', 'Requires Secured Unit'],
                  ['requiresBariatricAccommodation', 'Requires Bariatric Accommodation'],
                  ['requiresIvTherapy', 'Requires IV Therapy'],
                  ['requiresDialysis', 'Requires Dialysis'],
                  ['requiresVentilator', 'Requires Ventilator'],
                ].map(([id, label]) => (
                  <div key={id} className="flex items-center space-x-2">
                    <input type="checkbox" id={id} {...register(id)} />
                    <label htmlFor={id} className="text-sm">{label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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