'use client';

import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { CSVPreview } from '@/components/CSVPreview';
import { Results } from '@/components/Results';
import { uploadCSV, importCSV, healthCheck } from '@/lib/api';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

type Step = 'upload' | 'preview' | 'confirm' | 'processing' | 'results';

interface UploadState {
  fileId: string;
  fileName: string;
  totalRows: number;
  preview: any[];
  records: any[];
  columns: string[];
}

interface ResultsState {
  totalRecords: number;
  successfulRecords: number;
  skippedRecords: number;
  records: any[];
  skipped: any[];
}

export default function Home() {
  const [step, setStep] = useState<Step>('upload');
  const [uploadState, setUploadState] = useState<UploadState | null>(null);
  const [resultsState, setResultsState] = useState<ResultsState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    // Check API health
    healthCheck().then(setApiReady);
  }, []);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setLoading(true);

    try {
      const response = await uploadCSV(file);
      setUploadState(response);
      setStep('preview');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to upload file'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!uploadState) return;

    setError(null);
    setLoading(true);
    setStep('processing');

    try {
      const response = await importCSV(uploadState.fileId, uploadState.records);
      setResultsState(response);
      setStep('results');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to process import'
      );
      setStep('preview');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setUploadState(null);
    setResultsState(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            GrowEasy CSV Importer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload CSV files with any format and let AI intelligently extract and map CRM data
          </p>
        </div>

        {/* API Status */}
        {!apiReady && (
          <div className="alert alert-error mb-6 flex items-center">
            <AlertCircle className="mr-2" />
            <span>API is not available. Please check the deployment configuration.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6 flex items-center">
            <AlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Step Indicators */}
        <div className="flex justify-between items-center mb-12 max-w-3xl mx-auto">
          {(['upload', 'preview', 'confirm', 'processing', 'results'] as const).map(
            (s, idx) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step === s
                      ? 'bg-orange-500 text-white'
                      : ['upload', 'preview', 'confirm', 'processing', 'results'].indexOf(step) >
                        idx
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {['upload', 'preview', 'confirm', 'processing', 'results'].indexOf(step) >
                  idx ? (
                    <CheckCircle size={20} />
                  ) : (
                    idx + 1
                  )}
                </div>
                {idx < 4 && (
                  <div
                    className={`h-1 w-8 mx-2 ${
                      ['upload', 'preview', 'confirm', 'processing', 'results'].indexOf(step) >
                      idx
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            )
          )}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {step === 'upload' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <FileUpload onFileSelect={handleFileSelect} isLoading={loading} />
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Supported Formats:</strong> Facebook Lead Export, Google Ads Export, Excel sheets,
                  Real Estate CRM exports, Sales reports, and more. Our AI will intelligently map any CSV format.
                </p>
              </div>
            </div>
          )}

          {step === 'preview' && uploadState && (
            <div className="space-y-6">
              <CSVPreview
                columns={uploadState.columns}
                preview={uploadState.preview}
                fileName={uploadState.fileName}
              />
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-700 mb-4">
                  Total rows in file: <strong>{uploadState.totalRows}</strong>
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className="btn btn-secondary flex-1"
                  >
                    Upload Different File
                  </button>
                  <button
                    onClick={() => setStep('confirm')}
                    className="btn btn-primary flex-1"
                    disabled={loading}
                  >
                    Proceed to Import
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'confirm' && uploadState && (
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Import</h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700">
                    <strong>File:</strong> {uploadState.fileName}
                  </p>
                  <p className="text-gray-700">
                    <strong>Rows:</strong> {uploadState.totalRows}
                  </p>
                  <p className="text-gray-700">
                    <strong>Columns:</strong> {uploadState.columns.length}
                  </p>
                </div>
                <p className="text-gray-600 mb-6">
                  Ready to process? Our AI will analyze and extract CRM data from each record. This may take a
                  moment depending on file size.
                </p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('preview')} className="btn btn-secondary flex-1">
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="btn btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Start Import'}
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing CSV</h2>
              <p className="text-gray-600">
                Our AI is analyzing and extracting CRM data. This may take a moment...
              </p>
            </div>
          )}

          {step === 'results' && resultsState && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Import Complete</h2>
                <Results {...resultsState} />
              </div>
              <button
                onClick={handleReset}
                className="btn btn-primary w-full"
              >
                Import Another File
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600 text-sm">
          <p>
            GrowEasy CSV Importer • Powered by Claude AI • <a href="#" className="text-orange-500">GitHub</a>
          </p>
        </div>
      </div>
    </main>
  );
}
