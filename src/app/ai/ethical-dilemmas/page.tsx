"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthGuard from '@/components/auth/AuthGuard';
import { UserRole } from '@/lib/auth/auth-utils';

export default function AIEthicalDilemmas() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      query: '',
      scenario_type: 'ethical_dilemma'
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      const result = await fetch('/api/llm-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await result.json();
      setResponse(responseData);
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
          <h1 className="text-2xl font-semibold text-gray-900">Ethical Dilemma Support</h1>
          <p className="mt-1 text-sm text-gray-600">
            Get AI-powered guidance for navigating complex ethical situations in long-term care.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Describe the Ethical Dilemma</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                  Situation Details
                </label>
                <textarea
                  id="query"
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the ethical dilemma you're facing in detail..."
                  {...register('query', { required: 'Please describe the situation' })}
                ></textarea>
                {errors.query && (
                  <p className="mt-1 text-sm text-red-600">{errors.query.message}</p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="scenario_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Type
                </label>
                <select
                  id="scenario_type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register('scenario_type')}
                >
                  <option value="ethical_dilemma">Ethical Dilemma</option>
                  <option value="policy_interpretation">Policy Interpretation</option>
                  <option value="critical_incident">Critical Incident</option>
                  <option value="on_call_support">On-Call Manager Decision</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Get Guidance'}
              </button>
            </form>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Guidance</h2>
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
                <p className="mt-4 text-gray-600">Analyzing the situation...</p>
              </div>
            ) : response ? (
              <div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{response.response}</pre>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => {
                      navigator.clipboard.writeText(response.response);
                    }}
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => setResponse(null)}
                  >
                    Clear
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
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p>Submit a query to receive AI guidance</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Ethical Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium text-blue-800 mb-2">Resident Autonomy vs. Safety</h3>
              <p className="text-sm text-gray-600">
                When a resident's choices conflict with their safety, how do you balance respect for autonomy with duty of care?
              </p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium text-blue-800 mb-2">End-of-Life Care Decisions</h3>
              <p className="text-sm text-gray-600">
                Navigating complex decisions about palliative care, life-sustaining treatments, and advance directives.
              </p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium text-blue-800 mb-2">Family Conflicts</h3>
              <p className="text-sm text-gray-600">
                Managing situations where family members disagree about a resident's care or have conflicts with staff.
              </p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium text-blue-800 mb-2">Resource Allocation</h3>
              <p className="text-sm text-gray-600">
                How to fairly distribute limited resources, staff time, or specialized care among residents with different needs.
              </p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium text-blue-800 mb-2">Privacy vs. Monitoring</h3>
              <p className="text-sm text-gray-600">
                Balancing resident privacy with necessary monitoring for health and safety concerns.
              </p>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium text-blue-800 mb-2">Staff Ethical Concerns</h3>
              <p className="text-sm text-gray-600">
                Addressing situations where staff members face moral distress or ethical conflicts in providing care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
