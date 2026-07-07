'use client';

import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ResultsProps {
  totalRecords: number;
  successfulRecords: number;
  skippedRecords: number;
  records: any[];
  skipped: any[];
}

export function Results({
  totalRecords,
  successfulRecords,
  skippedRecords,
  records,
  skipped,
}: ResultsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Records</div>
          <div className="text-3xl font-bold text-gray-900">{totalRecords}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="text-sm text-gray-600 mb-2">Successfully Imported</div>
          <div className="text-3xl font-bold text-green-600">{successfulRecords}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="text-sm text-gray-600 mb-2">Skipped Records</div>
          <div className="text-3xl font-bold text-red-600">{skippedRecords}</div>
        </div>
      </div>

      {successfulRecords > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <CheckCircle className="mr-2 text-green-500" /> Imported Records
          </h3>
          <div className="table-responsive max-h-96 overflow-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Company</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Mobile</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 10).map((record, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{record.name || '-'}</td>
                    <td className="px-4 py-3 text-xs">{record.email || '-'}</td>
                    <td className="px-4 py-3">{record.company || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {record.crm_status || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{record.mobile_without_country_code || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {records.length > 10 && (
            <p className="text-sm text-gray-500 mt-4">
              Showing 10 of {records.length} records
            </p>
          )}
        </div>
      )}

      {skippedRecords > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertCircle className="mr-2 text-yellow-500" /> Skipped Records
          </h3>
          <div className="space-y-3">
            {skipped.slice(0, 5).map((item, idx) => (
              <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm font-medium text-gray-700">{item.reason}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Record: {JSON.stringify(item.originalRecord).substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
          {skipped.length > 5 && (
            <p className="text-sm text-gray-500 mt-4">
              And {skipped.length - 5} more skipped records
            </p>
          )}
        </div>
      )}
    </div>
  );
}
