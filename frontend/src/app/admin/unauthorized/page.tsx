import Link from 'next/link';

export const metadata = {
  title: 'Unauthorized - Admin Access',
  description: 'Insufficient permissions for admin access',
};

export default function AdminUnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-3xl mb-6 shadow-2xl">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-slate-300 mb-8 text-lg">
          You don't have the required permissions to access this administrative area.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/admin"
            className="block w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            Back to Admin Dashboard
          </Link>
          
          <Link
            href="/admin/login"
            className="block w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-white/20"
          >
            Switch Account
          </Link>
          
          <Link
            href="/"
            className="block w-full text-slate-300 hover:text-white font-medium py-2 px-6 transition-colors duration-200"
          >
            Return to Main Site
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-yellow-200">
              If you believe this is an error, please contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
