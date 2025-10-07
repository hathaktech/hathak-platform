'use client';

import React, { useState } from 'react';
import { API } from '@/services/api';

export default function TestBackendConnection() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    setStatus('testing');
    setMessage('Testing connection...');
    
    try {
      const response = await API.get('/api/auth/test');
      setStatus('success');
      setMessage(`Backend is running! Response: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setStatus('error');
      setMessage(`Connection failed: ${error.message}`);
      console.error('Backend test error:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Backend Connection Test</h3>
      <button
        onClick={testConnection}
        disabled={status === 'testing'}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'testing' ? 'Testing...' : 'Test Connection'}
      </button>
      {message && (
        <div className={`mt-2 p-2 rounded ${
          status === 'success' ? 'bg-green-100 text-green-800' :
          status === 'error' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
