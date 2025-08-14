'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DocumentationPage() {
  const [documentationContent, setDocumentationContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        const response = await fetch('/assessment-documentation.html');
        if (response.ok) {
          const content = await response.text();
          // Remove the duplicate "Back to Assessments" link from the original HTML
          const cleanedContent = content.replace(/<a href="\.\.\/\.\.\/\.\.\/index\.html" class="back-link">Back to Assessments<\/a>/g, '');
          setDocumentationContent(cleanedContent);
        } else {
          setDocumentationContent('<div class="error">Documentation not found</div>');
        }
      } catch (error) {
        console.error('Error fetching documentation:', error);
        setDocumentationContent('<div class="error">Error loading documentation</div>');
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link 
              href="/lmx/assessments"
              className="text-white hover:text-purple-300 transition-colors duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Assessments
            </Link>
            <h1 className="text-xl font-semibold text-white">Assessment Documentation</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Documentation Content */}
      <div dangerouslySetInnerHTML={{ __html: documentationContent }} />
    </div>
  );
}
