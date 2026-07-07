'use client';

import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function FileUpload({ onFileSelect, isLoading = false }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        onFileSelect(file);
      } else {
        alert('Please upload a CSV file');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragActive
          ? 'border-orange-500 bg-orange-50'
          : 'border-gray-300 bg-white'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-lg font-semibold text-gray-700 mb-2">
        Drop your CSV file here
      </p>
      <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
      <input
        type="file"
        accept=".csv"
        onChange={handleChange}
        disabled={isLoading}
        className="hidden"
        id="csv-upload"
      />
      <label htmlFor="csv-upload">
        <button
          type="button"
          onClick={() => document.getElementById('csv-upload')?.click()}
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'Uploading...' : 'Upload File'}
        </button>
      </label>
      <p className="text-xs text-gray-400 mt-4">Supported files: .csv (max 10 MB)</p>
    </div>
  );
}
