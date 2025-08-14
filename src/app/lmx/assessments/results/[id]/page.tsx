'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
// import ScalepadLogo from '@/components/ScalepadLogo';

export default function AssessmentResults() {
  const params = useParams();
  const searchParams = useSearchParams();
  const assessmentId = params.id as string;
  const answersParam = searchParams.get('answers');
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (answersParam) {
      try {
        const parsedAnswers = JSON.parse(decodeURIComponent(answersParam));
        setAnswers(parsedAnswers);
      } catch (error) {
        console.error('Failed to parse answers:', error);
      }
    }
    setLoading(false);
  }, [answersParam]);

  useEffect(() => {
    // Set page title based on assessment ID
    const getProperTitle = (id: string): string => {
      const titleMap: { [key: string]: string } = {
        'ai-readiness': 'AI Readiness Assessment',
        'cs-readiness': 'Customer Success Readiness Assessment',
        'cyber-insurance-readiness': 'Cyber Insurance Readiness Assessment',
        'cyber-resilience': 'Cyber Resilience Assessment',
        'digital-work-analytics': 'Digital Work Analytics Assessment',
        'technology-alignment': 'Technology Alignment Assessment',
        'new-client-comprehensive': 'New Client Assessment (Comprehensive)',
        'new-client-quick': 'New Client Assessment (Quick)',
        'base-policies': 'Base Policies & Procedures Assessment',
        'compliance-readiness': 'Compliance Readiness Assessment'
      };
      
      return titleMap[id] || `${id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Assessment`;
    };

    document.title = `ScalePad - ${getProperTitle(assessmentId)} Results`;
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Processing results...</div>
        </div>
      </div>
    );
  }

  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">

            <div>
              <Link 
                href="/lmx/assessments"
                className="text-white/60 hover:text-white transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Assessments
              </Link>
              <h1 className="text-2xl font-bold text-white mt-2">
                Assessment Complete
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 mb-8">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Assessment Completed Successfully!
            </h2>
            <p className="text-white/70 text-lg mb-8">
              You&apos;ve completed the {assessmentId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} assessment.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-8">
              <div className="text-2xl font-bold text-white mb-2">{answeredQuestions}</div>
              <div className="text-white/70">Questions Answered</div>
            </div>

            <div className="space-y-4">
              <div className="text-white/60">
                <strong>Next Steps:</strong>
              </div>
              <ul className="text-white/70 space-y-2">
                <li>• View detailed assessment report</li>
                <li>• Download results as JSON</li>
                <li>• Generate professional PDF report</li>
                <li>• Share results with stakeholders</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href={`/lmx/assessments/report/${assessmentId}?answers=${encodeURIComponent(JSON.stringify(answers))}`}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-3xl mb-3">📊</div>
              <div className="font-semibold mb-2">View Report</div>
              <div className="text-sm opacity-80">Detailed assessment results and analysis</div>
            </Link>

            <a
              href={`/api/assessments/download/${assessmentId}`}
              download
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-6 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-3xl mb-3">📥</div>
              <div className="font-semibold mb-2">Download JSON</div>
              <div className="text-sm opacity-80">Raw assessment data in JSON format</div>
            </a>

            <Link
              href="/lmx/assessments"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-3xl mb-3">🏠</div>
              <div className="font-semibold mb-2">Back to Assessments</div>
              <div className="text-sm opacity-80">Return to assessment library</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
