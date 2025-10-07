'use client';

import { useState } from 'react';
import { authService } from '@/services/authService';

export default function TestApiConnection() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');
    
    try {
      // Test with valid credentials
      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123'
      });
      
      setTestResult(`✅ Connection successful! User: ${result.user.name}`);
    } catch (error: any) {
      setTestResult(`❌ Connection failed: ${error.message}`);
      console.error('Test connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testInvalidCredentials = async () => {
    setLoading(true);
    setTestResult('Testing invalid credentials...');
    
    try {
      await authService.login({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
    } catch (error: any) {
      setTestResult(`✅ Invalid credentials handled correctly: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">API Connection Test</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Valid Login
        </button>
        
        <button
          onClick={testInvalidCredentials}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 ml-2"
        >
          Test Invalid Login
        </button>
      </div>
      
      {testResult && (
        <div className="p-3 bg-white border rounded">
          <pre className="text-sm">{testResult}</pre>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p>API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}</p>
        <p>Backend should be running on port 5000</p>
      </div>
    </div>
  );
}
