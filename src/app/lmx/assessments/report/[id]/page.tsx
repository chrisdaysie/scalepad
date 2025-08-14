'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ScalepadLogo from '@/components/ScalepadLogo';

interface AssessmentReport {
  id: string;
  title: string;
  description: string;
  completedDate: string;
  overallScore: number;
  totalQuestions: number;
  answeredQuestions: number;
  categories: Array<{
    title: string;
    score: number;
    maxScore: number;
    questions: Array<{
      title: string;
      answer: string;
      score: number;
      maxScore: number;
      remediation: string;
    }>;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    impact: string;
  }>;
  nextSteps: Array<{
    title: string;
    description: string;
    timeline: string;
  }>;
}

export default function ViewAssessmentReport() {
  const params = useParams();
  const assessmentId = params.id as string;
  
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading sample data
    const loadSampleReport = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sampleReport: AssessmentReport = {
        id: assessmentId,
        title: "AI Readiness Assessment",
        description: "Comprehensive evaluation of AI readiness across strategic, operational, technical, and cultural dimensions.",
        completedDate: new Date().toLocaleDateString(),
        overallScore: 72,
        totalQuestions: 28,
        answeredQuestions: 28,
        categories: [
          {
            title: "Strategic Alignment",
            score: 85,
            maxScore: 100,
            questions: [
              {
                title: "Willingness to explore AI as part of strategic planning",
                answer: "Satisfactory",
                score: 8,
                maxScore: 10,
                remediation: "Continue integrating AI into strategic discussions and planning sessions."
              },
              {
                title: "Clarity of business goals that could benefit from AI",
                answer: "Needs Attention",
                score: 6,
                maxScore: 10,
                remediation: "Define specific business outcomes and use cases for AI implementation."
              },
              {
                title: "Leadership commitment to AI-driven transformation",
                answer: "Satisfactory",
                score: 8,
                maxScore: 10,
                remediation: "Maintain executive sponsorship and expand leadership engagement."
              },
              {
                title: "Perception of AI as a business enabler",
                answer: "Satisfactory",
                score: 7,
                maxScore: 10,
                remediation: "Continue positioning AI as a strategic business tool."
              }
            ]
          },
          {
            title: "Operational Readiness",
            score: 65,
            maxScore: 100,
            questions: [
              {
                title: "Data quality and accessibility",
                answer: "At Risk",
                score: 4,
                maxScore: 10,
                remediation: "Implement data governance framework and improve data quality processes."
              },
              {
                title: "Process maturity for AI integration",
                answer: "Needs Attention",
                score: 6,
                maxScore: 10,
                remediation: "Standardize processes and create AI integration workflows."
              },
              {
                title: "Change management capabilities",
                answer: "Satisfactory",
                score: 7,
                maxScore: 10,
                remediation: "Strengthen change management processes for AI adoption."
              },
              {
                title: "Resource allocation for AI initiatives",
                answer: "Needs Attention",
                score: 6,
                maxScore: 10,
                remediation: "Allocate dedicated resources and budget for AI projects."
              },
              {
                title: "Performance measurement framework",
                answer: "Satisfactory",
                score: 7,
                maxScore: 10,
                remediation: "Establish KPIs and metrics for AI initiative success."
              },
              {
                title: "Risk management for AI projects",
                answer: "At Risk",
                score: 4,
                maxScore: 10,
                remediation: "Develop comprehensive risk management framework for AI."
              },
              {
                title: "Compliance and regulatory awareness",
                answer: "Needs Attention",
                score: 6,
                maxScore: 10,
                remediation: "Stay updated on AI regulations and compliance requirements."
              }
            ]
          },
          {
            title: "Technical Infrastructure",
            score: 78,
            maxScore: 100,
            questions: [
              {
                title: "Cloud infrastructure readiness",
                answer: "Satisfactory",
                score: 8,
                maxScore: 10,
                remediation: "Continue cloud migration and optimize infrastructure for AI workloads."
              },
              {
                title: "Data storage and management systems",
                answer: "Satisfactory",
                score: 7,
                maxScore: 10,
                remediation: "Enhance data storage capabilities and management processes."
              },
              {
                title: "Security and compliance framework",
                answer: "Satisfactory",
                score: 7,
                maxScore: 10,
                remediation: "Enhance security protocols and ensure compliance with AI regulations."
              },
              {
                title: "Integration capabilities",
                answer: "Needs Attention",
                score: 6,
                maxScore: 10,
                remediation: "Improve system integration capabilities for AI tools."
              },
              {
                title: "Scalability of current infrastructure",
                answer: "Satisfactory",
                score: 8,
                maxScore: 10,
                remediation: "Continue scaling infrastructure to support AI growth."
              },
              {
                title: "API and data access capabilities",
                answer: "Needs Attention",
                score: 6,
                maxScore: 10,
                remediation: "Develop robust API framework for AI data access."
              },
              {
                title: "Backup and disaster recovery",
                answer: "Satisfactory",
                score: 8,
                maxScore: 10,
                remediation: "Maintain strong backup and recovery processes."
              }
            ]
          },
          {
            title: "Cultural Readiness",
            score: 70,
            maxScore: 100,
            questions: [
              {
                title: "Employee AI literacy and training",
                answer: "Needs Attention",
                score: 6,
                maxScore: 10,
                remediation: "Develop comprehensive AI training programs for all employees."
              },
              {
                title: "Change management readiness",
                answer: "Satisfactory",
                score: 7,
                maxScore: 10,
                remediation: "Strengthen change management processes for AI adoption."
              },
              {
                title: "Innovation culture and mindset",
                answer: "Satisfactory",
                score: 7,
                maxScore: 10,
                remediation: "Foster innovation culture and encourage AI experimentation."
              },
              {
                title: "Collaboration and cross-functional teams",
                answer: "Satisfactory",
                score: 8,
                maxScore: 10,
                remediation: "Continue building cross-functional AI teams."
              },
              {
                title: "Communication about AI initiatives",
                answer: "Needs Attention",
                score: 6,
                maxScore: 10,
                remediation: "Improve communication strategy for AI initiatives."
              },
              {
                title: "Employee engagement with AI tools",
                answer: "Satisfactory",
                score: 7,
                maxScore: 10,
                remediation: "Increase employee engagement with AI tools and processes."
              },
              {
                title: "Knowledge sharing and learning",
                answer: "Satisfactory",
                score: 7,
                maxScore: 10,
                remediation: "Establish knowledge sharing platforms for AI learning."
              }
            ]
          }
        ],
        recommendations: [
          {
            priority: 'high',
            category: 'Operational Readiness',
            title: 'Improve Data Quality Framework',
            description: 'Implement comprehensive data governance and quality management processes.',
            impact: 'High impact on AI model accuracy and decision-making capabilities.'
          },
          {
            priority: 'high',
            category: 'Operational Readiness',
            title: 'Develop Risk Management Framework',
            description: 'Create comprehensive risk management processes for AI projects.',
            impact: 'Critical for ensuring AI project success and compliance.'
          },
          {
            priority: 'medium',
            category: 'Cultural Readiness',
            title: 'Develop AI Training Program',
            description: 'Create role-based AI literacy training for all employees.',
            impact: 'Medium impact on adoption and utilization of AI tools.'
          },
          {
            priority: 'medium',
            category: 'Technical Infrastructure',
            title: 'Enhance Integration Capabilities',
            description: 'Improve system integration and API framework for AI tools.',
            impact: 'Medium impact on AI tool effectiveness and user experience.'
          },
          {
            priority: 'low',
            category: 'Strategic Alignment',
            title: 'Enhance Goal Definition',
            description: 'Refine business goals and success metrics for AI initiatives.',
            impact: 'Low impact on strategic direction and measurement.'
          }
        ],
        nextSteps: [
          {
            title: 'Data Governance Implementation',
            description: 'Establish data quality standards and governance framework',
            timeline: '30-60 days'
          },
          {
            title: 'Risk Management Framework Development',
            description: 'Create comprehensive risk management processes for AI',
            timeline: '45-75 days'
          },
          {
            title: 'AI Training Program Development',
            description: 'Design and launch employee AI literacy training',
            timeline: '60-90 days'
          },
          {
            title: 'Integration Framework Enhancement',
            description: 'Improve API and system integration capabilities',
            timeline: '90-120 days'
          }
        ]
      };
      
      setReport(sampleReport);
      setLoading(false);
    };

    loadSampleReport();
  }, [assessmentId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading assessment report...</div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Report not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
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
              <h1 className="text-2xl font-bold text-white mt-2">Assessment Report</h1>
            </div>
            <div className="text-right">
              <div className="text-white/60 text-sm">Completed</div>
              <div className="text-white font-semibold">{report.completedDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Assessment Overview */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{report.title}</h2>
                <p className="text-white/70">{report.description}</p>
              </div>
              <div className={`text-center p-4 rounded-xl border ${getScoreBgColor(report.overallScore)}`}>
                <div className={`text-3xl font-bold ${getScoreColor(report.overallScore)}`}>
                  {report.overallScore}%
                </div>
                <div className="text-white/60 text-sm">Overall Score</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{report.totalQuestions}</div>
                <div className="text-white/60 text-sm">Total Questions</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{report.answeredQuestions}</div>
                <div className="text-white/60 text-sm">Answered</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{report.categories.length}</div>
                <div className="text-white/60 text-sm">Categories</div>
              </div>
            </div>
          </div>

          {/* Category Scores */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Category Performance</h3>
            <div className="space-y-4">
              {report.categories.map((category, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{category.title}</h4>
                    <div className={`text-lg font-bold ${getScoreColor(category.score)}`}>
                      {category.score}%
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        category.score >= 80 ? 'bg-green-500' : 
                        category.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                  <div className="text-white/60 text-sm">
                    {category.questions.length} questions
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Key Recommendations</h3>
            <div className="space-y-4">
              {report.recommendations.map((rec, index) => (
                <div key={index} className="border border-white/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      rec.priority === 'high' ? 'bg-red-500 text-white' :
                      rec.priority === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                    <span className="text-white/60 text-sm">{rec.category}</span>
                  </div>
                  <h4 className="text-white font-medium mb-2">{rec.title}</h4>
                  <p className="text-white/70 text-sm mb-2">{rec.description}</p>
                  <p className="text-white/60 text-xs">Impact: {rec.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Download PDF Report
            </button>
            <Link
              href={`/lmx/assessments/run/${assessmentId}`}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Retake Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
