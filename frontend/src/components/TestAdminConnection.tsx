'use client';

import { useState } from 'react';
import { adminAuthService } from '@/services/adminAuthService';

export default function TestAdminConnection() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing connection...');
    
    try {
      console.log('Testing admin login with credentials:', {
        email: 'test@test.com',
        password: 'test123'
      });
      
      const response = await adminAuthService.login({
        email: 'test@test.com',
        password: 'test123'
      });
      
      setResult(`✅ Success! Admin: ${response.admin.name}, Token: ${response.token.substring(0, 20)}...`);
      console.log('Admin login successful:', response);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || 'Unknown error'}\n\nFull error details:\n${JSON.stringify(error, null, 2)}`);
      console.error('Admin login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const testApiConfig = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    setResult(`API Configuration:\n- NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'undefined'}\n- Default API URL: http://localhost:5000/api\n- Final API URL: ${apiUrl}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Test Admin Connection</h2>
      <div className="space-y-2">
        <button
          onClick={testApiConfig}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          Check API Config
        </button>
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Admin Login'}
        </button>
      </div>
      <div className="mt-4 p-3 bg-gray-100 rounded">
        <pre className="text-sm whitespace-pre-wrap">{result}</pre>
      </div>
    </div>
  );
}
