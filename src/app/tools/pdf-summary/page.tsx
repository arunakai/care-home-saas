"use client";

import React, { useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import { UserRole } from '@/lib/auth/auth-utils';

export default function PDFSummarizer() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setSummary(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsProcessing(true);
    
    // In a real implementation, this would upload the file to the API
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      setIsProcessing(false);
      setSummary({
        summary: "This document outlines the new infection control protocols for long-term care facilities. It emphasizes the importance of hand hygiene, proper use of personal protective equipment, and environmental cleaning. The document also provides guidance on visitor policies during outbreaks and vaccination requirements for staff and residents. It recommends regular staff training on infection prevention and control measures, as well as routine audits to ensure compliance with protocols. The document concludes with specific procedures for managing different types of outbreaks, including respiratory, gastrointestinal, and antibiotic-resistant infections.",
        key_points: [
          "1) Hand hygiene is the most important measure to prevent the spread of infections.",
          "2) Staff must use appropriate PPE based on the type of care being provided.",
          "3) Environmental cleaning should be performed with approved disinfectants effective against common pathogens.",
          "4) Visitor restrictions may be implemented during active outbreaks.",
          "5) All staff should receive annual training on infection control procedures."
        ],
        original_length: 4250,
        summary_length: 842
      });
    }, 3000);
  };

  return (
    <AuthGuard allowedRoles={[UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">PDF Summarizer</h1>
          <p className="mt-1 text-sm text-gray-600">
            Upload PDF documents to automatically generate concise summaries using AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select PDF File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF files only, up to 10MB</p>
                  </div>
                </div>
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: <span className="font-medium">{file.name}</span>
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="summaryType" className="block text-sm font-medium text-gray-700 mb-1">
                  Summary Type
                </label>
                <select
                  id="summaryType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="concise">Concise (25% of original)</option>
                  <option value="detailed">Detailed (50% of original)</option>
                  <option value="key_points">Key Points Only</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!file || isProcessing}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Generating Summary...' : 'Generate Summary'}
              </button>
            </form>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary Results</h2>
            {isProcessing ? (
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
                <p className="mt-4 text-gray-600">Analyzing document content...</p>
              </div>
            ) : summary ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Document Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{summary.summary}</p>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>Original: {summary.original_length} words</span>
                    <span>Summary: {summary.summary_length} words ({Math.round((summary.summary_length / summary.original_length) * 100)}%)</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Key Points</h3>
                  <ul className="space-y-2 bg-gray-50 p-4 rounded-lg">
                    {summary.key_points.map((point: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700">{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => {
                      navigator.clipboard.writeText(summary.summary);
                    }}
                  >
                    Copy Summary
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Save to Records
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <p>Upload a PDF document to see summary</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
