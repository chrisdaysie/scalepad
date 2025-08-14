'use client';

import { useEffect } from 'react';

export default function QBRDocumentationPage() {
  useEffect(() => {
    // Redirect to the new HTML documentation
    window.location.href = '/deliverables-documentation.html';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Redirecting to Documentation...</h1>
        <p className="text-gray-600">You are being redirected to the new QBR documentation.</p>
        <p className="text-gray-500 text-sm mt-2">
          If you are not redirected automatically, 
          <a 
            href="/deliverables-documentation.html" 
            className="text-blue-600 hover:text-blue-800 underline ml-1"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
}
