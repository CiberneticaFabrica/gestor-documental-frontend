"use client";
import { useState } from 'react';

interface UploadStatus {
  type: 'success' | 'error' | 'progress';
  text: string;
  progress?: number;
}

export function DocumentUploadStatusPanel({ status }: { status: UploadStatus }) {
  return (
    <div className={`rounded-lg p-4 ${
      status.type === 'success' ? 'bg-green-50 dark:bg-green-900' : 
      status.type === 'error' ? 'bg-red-50 dark:bg-red-900' : 
      'bg-blue-50 dark:bg-blue-900'
    }`}>
      <h3 className={`font-semibold mb-2 ${
        status.type === 'success' ? 'text-green-800 dark:text-green-200' : 
        status.type === 'error' ? 'text-red-800 dark:text-red-200' : 
        'text-blue-800 dark:text-blue-200'
      }`}>Estado de Carga</h3>
      
      <div className="space-y-2">
        {status.progress !== undefined && status.type === 'progress' && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${status.progress}%` }}
            />
          </div>
        )}
        <p className={`text-sm ${
          status.type === 'success' ? 'text-green-700 dark:text-green-300' : 
          status.type === 'error' ? 'text-red-700 dark:text-red-300' : 
          'text-blue-700 dark:text-blue-300'
        }`}>{status.text}</p>
      </div>
    </div>
  );
}