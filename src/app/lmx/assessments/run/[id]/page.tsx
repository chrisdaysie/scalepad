'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ScalepadLogo from '@/components/ScalepadLogo';

interface Question {
  title: string;
  description: string;
  remediation_tips: string;
  criterion_label_type_enum: string;
  criteria: Array<{
    label_enum: string;
    description: string;
  }>;
  scoring_instructions: string;
}

interface Category {
  title: string;
  description: string;
  is_question_weight_evenly_distributed: boolean;
  questions: Question[];
}

interface AssessmentData {
  assessment_template_create_payload: {
    title: string;
    description: string;
    is_category_weight_evenly_distributed: boolean;
    categories: Category[];
  };
}

export default function RunAssessment() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;
  
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const [showRemediation, setShowRemediation] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/assessments/data/${assessmentId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(`Failed to load assessment: ${response.status} - ${data.error || 'Unknown error'}${data.details ? ` (${data.details})` : ''}`);
        }
        
        setAssessment(data);
      } catch (error) {
        console.error('Error loading assessment:', error);
        setError(error instanceof Error ? error.message : 'Failed to load assessment');
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      loadAssessment();
    }
  }, [assessmentId]);

  useEffect(() => {
    if (assessment) {
      const totalQuestions = assessment.assessment_template_create_payload.categories.reduce(
        (total, category) => total + category.questions.length, 0
      );
      const answeredQuestions = Object.keys(answers).length;
      setProgress((answeredQuestions / totalQuestions) * 100);
    }
  }, [answers, assessment]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    setShowRemediation(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const toggleRemediation = (questionId: string) => {
    setShowRemediation(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getTotalQuestions = () => {
    if (!assessment) return 0;
    return assessment.assessment_template_create_payload.categories.reduce(
      (total, category) => total + category.questions.length, 0
    );
  };

  const getAnsweredQuestions = () => {
    return Object.keys(answers).length;
  };

  const getAnswerColor = (labelEnum: string) => {
    const label = labelEnum.toLowerCase();
    
    // High risk - red
    if (label === 'atrisk' || label.includes('at risk') || label.includes('critical') || label.includes('high risk') || label.includes('poor')) {
      return {
        border: 'border-red-500',
        bg: 'bg-red-500/10',
        bgHover: 'hover:bg-red-500/20',
        text: 'text-red-400',
        selectedBorder: 'border-red-500',
        selectedBg: 'bg-red-500/20'
      };
    }
    
    // Medium risk - yellow/orange
    if (label === 'needsattention' || label.includes('needs attention') || label.includes('moderate') || label.includes('fair') || label.includes('warning')) {
      return {
        border: 'border-yellow-500',
        bg: 'bg-yellow-500/10',
        bgHover: 'hover:bg-yellow-500/20',
        text: 'text-yellow-400',
        selectedBorder: 'border-yellow-500',
        selectedBg: 'bg-yellow-500/20'
      };
    }
    
    // Good - green
    if (label === 'satisfactory' || label.includes('good') || label.includes('adequate')) {
      return {
        border: 'border-green-500',
        bg: 'bg-green-500/10',
        bgHover: 'hover:bg-green-500/20',
        text: 'text-green-400',
        selectedBorder: 'border-green-500',
        selectedBg: 'bg-green-500/20'
      };
    }
    
    // Excellent - green
    if (label.includes('excellent') || label.includes('optimal') || label.includes('best practice') || label.includes('advanced')) {
      return {
        border: 'border-green-500',
        bg: 'bg-green-500/10',
        bgHover: 'hover:bg-green-500/20',
        text: 'text-green-400',
        selectedBorder: 'border-green-500',
        selectedBg: 'bg-green-500/20'
      };
    }
    
    // Not Applicable - gray
    if (label === 'notapplicable' || label.includes('not applicable') || label.includes('n/a') || label.includes('na')) {
      return {
        border: 'border-gray-500',
        bg: 'bg-gray-500/10',
        bgHover: 'hover:bg-gray-500/20',
        text: 'text-gray-400',
        selectedBorder: 'border-gray-500',
        selectedBg: 'bg-gray-500/20'
      };
    }
    
    // Default - neutral
    return {
      border: 'border-white/20',
      bg: 'bg-white/5',
      bgHover: 'hover:bg-white/10',
      text: 'text-white/60',
      selectedBorder: 'border-blue-500',
      selectedBg: 'bg-blue-500/10'
    };
  };

  const handleCompleteAssessment = () => {
    router.push(`/lmx/assessments/results/${assessmentId}?answers=${encodeURIComponent(JSON.stringify(answers))}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading assessment...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <div className="text-white text-xl mb-4">Error Loading Assessment</div>
          <div className="text-white/70 mb-6">{error}</div>
          <Link
            href="/lmx/assessments"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Assessment not found</div>
      </div>
    );
  }

  const { title, description, categories } = assessment.assessment_template_create_payload;
  const totalQuestions = getTotalQuestions();
  const answeredQuestions = getAnsweredQuestions();

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
              <h1 className="text-2xl font-bold text-white mt-2">{title}</h1>
            </div>
            <div className="text-right">
              <div className="text-white/60 text-sm">Progress</div>
              <div className="text-white font-semibold">{Math.round(progress)}%</div>
              <div className="text-white/60 text-xs">
                {answeredQuestions} of {totalQuestions} questions
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Assessment Description */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">Assessment Overview</h2>
            <p className="text-white/70">{description}</p>
          </div>

          {/* Categories and Questions */}
          <div className="space-y-8">
            {categories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                {/* Category Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {category.title}
                    </h3>
                    <div className="text-sm text-white/60">
                      {category.questions.length} questions
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">{category.description}</p>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                  {category.questions.map((question, questionIndex) => {
                    const questionId = `${categoryIndex}-${questionIndex}`;
                    const isAnswered = answers[questionId];
                    const showRemediationForThis = showRemediation[questionId];

                    return (
                      <div 
                        key={questionIndex} 
                        className={`border rounded-lg p-4 transition-all duration-200 ${
                          isAnswered 
                            ? 'border-green-500/30 bg-green-500/5' 
                            : 'border-white/20 bg-white/5'
                        }`}
                      >
                        {/* Question Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                                isAnswered 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-white/20 text-white/60'
                              }`}>
                                {questionIndex + 1}
                              </div>
                              <h4 className="text-white font-medium">{question.title}</h4>
                            </div>
                            <p className="text-white/70 text-sm ml-9">{question.description}</p>
                          </div>
                          {isAnswered && (
                            <div className="text-green-400 text-sm font-medium">✓ Answered</div>
                          )}
                        </div>

                        {/* Scoring Instructions */}
                        {question.scoring_instructions && (
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4 ml-9">
                            <div className="text-blue-400 text-xs font-semibold mb-1">Scoring Instructions:</div>
                            <p className="text-white/80 text-xs">{question.scoring_instructions}</p>
                          </div>
                        )}

                        {/* Answer Options */}
                        <div className="space-y-2 ml-9">
                          {question.criteria.map((criterion, index) => {
                            const colors = getAnswerColor(criterion.label_enum);
                            const isSelected = answers[questionId] === criterion.label_enum;
                            
                            return (
                              <label
                                key={index}
                                className={`block p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                  isSelected
                                    ? `${colors.selectedBorder} ${colors.selectedBg}`
                                    : `${colors.border} ${colors.bg} ${colors.bgHover}`
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={questionId}
                                  value={criterion.label_enum}
                                  checked={isSelected}
                                  onChange={(e) => handleAnswer(questionId, e.target.value)}
                                  className="sr-only"
                                />
                                <div className="flex items-start">
                                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 mr-3 flex-shrink-0 ${
                                    isSelected
                                      ? `${colors.selectedBorder} ${colors.selectedBg}`
                                      : colors.border
                                  }`}>
                                    {isSelected && (
                                      <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                                    )}
                                  </div>
                                  <div>
                                    <div className={`font-medium text-sm mb-1 ${
                                      isSelected ? 'text-white' : colors.text
                                    }`}>
                                      {criterion.label_enum.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                    <div className="text-white/60 text-xs">
                                      {criterion.description}
                                    </div>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>

                        {/* Remediation Tips */}
                        {isAnswered && question.remediation_tips && (
                          <div className="mt-4 ml-9">
                            <button
                              onClick={() => toggleRemediation(questionId)}
                              className="text-yellow-400 text-sm font-medium hover:text-yellow-300 transition-colors"
                            >
                              {showRemediationForThis ? 'Hide' : 'Show'} Remediation Tips
                            </button>
                            {showRemediationForThis && (
                              <div className="mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                <div className="text-yellow-400 text-xs font-semibold mb-1">Remediation Tips:</div>
                                <p className="text-white/80 text-xs">{question.remediation_tips}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Complete Assessment Button */}
          <div className="mt-12 text-center">
            <button
              onClick={handleCompleteAssessment}
              disabled={progress < 100}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                progress < 100
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105'
              }`}
            >
              {progress < 100 
                ? `Complete Assessment (${Math.round(progress)}%)`
                : 'Complete Assessment & View Results'
              }
            </button>
            {progress < 100 && (
              <p className="text-white/60 text-sm mt-2">
                Please answer all {totalQuestions} questions to complete the assessment
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
