'use client';

import React from 'react';

interface CSVPreviewProps {
  columns: string[];
  preview: any[];
  fileName: string;
}

export function CSVPreview({ columns, preview, fileName }: CSVPreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">CSV Preview</h3>
      <p className="text-sm text-gray-600 mb-4">File: {fileName}</p>
      
      <div className="table-responsive overflow-x-auto max-h-96 overflow-y-auto">
        <table className="table w-full border-collapse">
          <thead className="sticky top-0">
            <tr className="bg-gray-100">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 border-b">
                {columns.map((col) => (
                  <td key={`${idx}-${col}`} className="px-4 py-3 text-sm text-gray-700">
                    {String(row[col] || '').substring(0, 50)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
