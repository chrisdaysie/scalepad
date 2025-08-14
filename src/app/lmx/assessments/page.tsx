'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ScalepadLogo from '@/components/ScalepadLogo';

interface Assessment {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  status: string;
  lastUpdated: number;
  runAssessmentUrl: string;
  viewReportUrl: string;
  downloadJsonUrl: string;
  aliases: string[];
  keywords: string[];
  categoryTitles: string[];
}

// Static fallback data based on the original assessments
const staticAssessments: Assessment[] = [
  {
    id: "ai-readiness",
    title: "AI Readiness Assessment",
    description: "This 28-point assessment helps MSPs evaluate client readiness across four core dimensions critical to strategic engagement and account growth. Each item includes tiered scoring (At Risk, Needs Attention, Satisfactory, Not Applicable) and is framed in business terms — not just technical criteria.",
    icon: "🧠",
    gradient: "from-blue-500 to-cyan-500",
    status: "Active",
    lastUpdated: Math.floor(Date.now() / 1000) - 300,
    runAssessmentUrl: "/lmx/assessments/run/ai-readiness",
    viewReportUrl: "/lmx/assessments/report/ai-readiness",
    downloadJsonUrl: "/api/assessments/download/ai-readiness",
    aliases: ["ai"],
    keywords: ["ai", "artificial intelligence", "machine learning"],
    categoryTitles: ["AI Strategy & Planning", "Data Infrastructure & Governance", "AI Culture & Training", "AI Ethics & Governance", "Technology Foundation"]
  },
  {
    id: "base-policies",
    title: "Base Policies & Procedures Assessment",
    description: "This 20-point assessment evaluates organizational policy maturity, security controls, and business continuity preparedness. Designed to help MSPs understand client policy gaps and provide targeted recommendations.",
    icon: "📋",
    gradient: "from-purple-500 to-pink-500",
    status: "Active",
    lastUpdated: Math.floor(Date.now() / 1000) - 600,
    runAssessmentUrl: "/lmx/assessments/run/base-policies",
    viewReportUrl: "/lmx/assessments/report/base-policies",
    downloadJsonUrl: "/api/assessments/download/base-policies",
    aliases: ["base-policies"],
    keywords: ["policies", "procedures", "compliance", "governance"],
    categoryTitles: ["Policy Framework", "Security Controls", "Business Continuity", "Compliance Management"]
  },
  {
    id: "cs-readiness",
    title: "Customer Success Readiness Assessment",
    description: "This 16-point assessment helps organizations evaluate client readiness across four core dimensions critical to long-term success: strategic alignment, operational maturity, technology foundation, and cultural readiness.",
    icon: "📊",
    gradient: "from-green-500 to-emerald-500",
    status: "Active",
    lastUpdated: Math.floor(Date.now() / 1000) - 900,
    runAssessmentUrl: "/lmx/assessments/run/cs-readiness",
    viewReportUrl: "/lmx/assessments/report/cs-readiness",
    downloadJsonUrl: "/api/assessments/download/cs-readiness",
    aliases: ["cs"],
    keywords: ["customer", "success", "journey", "health"],
    categoryTitles: ["Customer Success Strategy", "Customer Journey Mapping", "Customer Health & Analytics", "CS Team Enablement"]
  },
  {
    id: "cyber-insurance-readiness",
    title: "Cyber Insurance Readiness Assessment",
    description: "The definitive 20-item assessment that combines business-focused insurance requirements with technical implementation guidance. Designed to evaluate cyber insurance readiness and identify coverage gaps.",
    icon: "🔒",
    gradient: "from-orange-500 to-red-500",
    status: "Active",
    lastUpdated: Math.floor(Date.now() / 1000) - 1200,
    runAssessmentUrl: "/lmx/assessments/run/cyber-insurance-readiness",
    viewReportUrl: "/lmx/assessments/report/cyber-insurance-readiness",
    downloadJsonUrl: "/api/assessments/download/cyber-insurance-readiness",
    aliases: ["cyber-insurance"],
    keywords: ["cyber insurance", "insurance", "coverage", "liability"],
    categoryTitles: ["Cyber Insurance Strategy", "Insurance Coverage & Terms", "Security Controls & Compliance", "Incident Response & Claims"]
  },
  {
    id: "cyber-resilience",
    title: "Cyber Resilience Assessment",
    description: "This 28-point assessment helps organizations evaluate their cybersecurity maturity, resilience posture, and cultural readiness to handle risk. It provides actionable insights for improving security posture.",
    icon: "🔒",
    gradient: "from-indigo-500 to-purple-500",
    status: "Active",
    lastUpdated: Math.floor(Date.now() / 1000) - 1500,
    runAssessmentUrl: "/lmx/assessments/run/cyber-resilience",
    viewReportUrl: "/lmx/assessments/report/cyber-resilience",
    downloadJsonUrl: "/api/assessments/download/cyber-resilience",
    aliases: [],
    keywords: ["cyber", "security", "resilience", "risk"],
    categoryTitles: ["Security Strategy & Governance", "Technical Security Controls", "Incident Response & Recovery", "Security Culture & Training"]
  },
  {
    id: "dwa",
    title: "Digital Workplace Assessment",
    description: "This 24-point assessment evaluates digital workplace maturity, collaboration tools, and remote work readiness. Helps organizations optimize their digital workplace strategy.",
    icon: "💻",
    gradient: "from-teal-500 to-cyan-500",
    status: "Active",
    lastUpdated: Math.floor(Date.now() / 1000) - 1800,
    runAssessmentUrl: "/lmx/assessments/run/dwa",
    viewReportUrl: "/lmx/assessments/report/dwa",
    downloadJsonUrl: "/api/assessments/download/dwa",
    aliases: ["dwa"],
    keywords: ["digital workplace", "collaboration", "remote work", "productivity"],
    categoryTitles: ["Digital Workplace Strategy", "Collaboration Tools & Platforms", "Remote Work Infrastructure", "User Experience & Adoption"]
  },
  {
    id: "new-client-comprehensive",
    title: "New Client Comprehensive Assessment",
    description: "This 32-point assessment provides a comprehensive evaluation of new client environments, covering technology, security, compliance, and business processes.",
    icon: "🏢",
    gradient: "from-slate-500 to-gray-500",
    status: "Active",
    lastUpdated: Math.floor(Date.now() / 1000) - 2100,
    runAssessmentUrl: "/lmx/assessments/run/new-client-comprehensive",
    viewReportUrl: "/lmx/assessments/report/new-client-comprehensive",
    downloadJsonUrl: "/api/assessments/download/new-client-comprehensive",
    aliases: ["new-client"],
    keywords: ["new client", "onboarding", "comprehensive", "evaluation"],
    categoryTitles: ["Technology Infrastructure", "Security & Compliance", "Business Processes", "Strategic Alignment"]
  },
  {
    id: "new-client-quick",
    title: "New Client Quick Assessment",
    description: "This 16-point assessment provides a rapid evaluation of new client environments, focusing on critical areas for immediate service delivery.",
    icon: "⚡",
    gradient: "from-yellow-500 to-orange-500",
    status: "Active",
    lastUpdated: Math.floor(Date.now() / 1000) - 2400,
    runAssessmentUrl: "/lmx/assessments/run/new-client-quick",
    viewReportUrl: "/lmx/assessments/report/new-client-quick",
    downloadJsonUrl: "/api/assessments/download/new-client-quick",
    aliases: ["quick"],
    keywords: ["quick", "rapid", "new client", "assessment"],
    categoryTitles: ["Critical Infrastructure", "Security Posture", "Service Requirements", "Quick Wins"]
  },
  {
    id: "technology-alignment",
    title: "Technology Alignment Assessment",
    description: "This 20-point assessment evaluates technology alignment with business objectives, identifying gaps and opportunities for optimization.",
    icon: "🎯",
    gradient: "from-pink-500 to-rose-500",
    status: "Active",
    lastUpdated: Math.floor(Date.now() / 1000) - 2700,
    runAssessmentUrl: "/lmx/assessments/run/technology-alignment",
    viewReportUrl: "/lmx/assessments/report/technology-alignment",
    downloadJsonUrl: "/api/assessments/download/technology-alignment",
    aliases: ["tech-alignment"],
    keywords: ["technology", "alignment", "strategy", "optimization"],
    categoryTitles: ["Technology Strategy", "Business Alignment", "Infrastructure Assessment", "Optimization Opportunities"]
  }
];

export default function Assessments() {
  // Set title immediately
  if (typeof document !== 'undefined') {
    document.title = "ScalePad - Assessments";
  }
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [assessments, setAssessments] = useState<Assessment[]>(staticAssessments);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedFromAPI, setHasLoadedFromAPI] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const loadAssessments = async () => {
    // Don't fetch if already loading or already loaded
    if (isLoading || hasLoadedFromAPI) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/assessments', {
        // Add cache control for production
        headers: {
          'Cache-Control': 'max-age=300', // 5 minutes cache
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setAssessments(data);
        setHasLoadedFromAPI(true);
      } else {
        throw new Error('Invalid data format or empty response');
      }
    } catch (error) {
      console.error('Failed to load assessments from API:', error);
      // Keep existing data, don't fallback to static data since we already have it
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch once on mount if we haven't loaded from API yet
    if (!hasLoadedFromAPI) {
      loadAssessments();
    }
  }, [loadAssessments, hasLoadedFromAPI]);

  const [currentTime, setCurrentTime] = useState<number | null>(null);

  // Update current time on client side only
  useEffect(() => {
    setCurrentTime(Math.floor(Date.now() / 1000));
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);



  const formatRelativeTime = (timestamp: number) => {
    if (currentTime === null) {
      return 'Loading...'; // Show loading state until client-side time is available
    }
    
    const diff = currentTime - timestamp;
    
    if (diff < 60) {
      return 'Just Now';
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diff < 2592000) {
      const days = Math.floor(diff / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diff / 2592000);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.1}px`,
            top: `${mousePosition.y * 0.1}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            right: `${mousePosition.x * 0.05}px`,
            bottom: `${mousePosition.y * 0.05}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Logo */}
        <div className="absolute top-8 right-8 z-20">
          <ScalepadLogo size="lg" showText={false} variant="light" />
        </div>
        
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                href="/" 
                className="text-white/60 hover:text-white transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Playground
              </Link>
            </li>
            <li className="text-white/40">/</li>
            <li>
              <Link 
                href="/lmx" 
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                Lifecycle Manager X
              </Link>
            </li>
            <li className="text-white/40">/</li>
            <li className="text-white font-medium">Assessments</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-white/80 text-sm">Configuration-Driven System</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            Assessment
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Templates
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto mb-8 animate-slide-up delay-200">
            Strategic Business Assessment & Analysis
          </p>
        </div>

        {/* Assessments Grid */}
        <div className="max-w-7xl mx-auto mb-16">
          {/* Subtle loading indicator */}
          {isLoading && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-white/80 text-sm">Refreshing data...</span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assessments.map((assessment, index) => (
              <div
                key={assessment.id}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 animate-slide-up flex flex-col"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${assessment.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Header with Icon and Timestamp */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl">{assessment.icon}</div>
                    <div className="text-xs text-white/60 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                      Updated {formatRelativeTime(assessment.lastUpdated)}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {assessment.title}
                  </h3>
                  
                  <p className="text-white/70 mb-6 leading-relaxed text-sm flex-grow">
                    {assessment.description.length > 120 
                      ? `${assessment.description.substring(0, 120)}...` 
                      : assessment.description}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3 w-full">
                    <Link
                      href={assessment.runAssessmentUrl}
                      className="block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 text-center"
                    >
                      Run Assessment
                    </Link>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Link
                        href={assessment.viewReportUrl}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 text-center text-sm"
                      >
                        View Report
                      </Link>
                      <a
                        href={assessment.downloadJsonUrl}
                        download
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 text-center text-sm"
                      >
                        Download JSON
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500">
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Assessment Template Documentation
              </h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Learn how to create your own assessment templates using our JSON format. Complete guide with examples, best practices, and implementation instructions.
              </p>
              <Link
                href="/lmx/assessments/documentation"
                className="inline-flex px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mb-16">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-2">
              Got an idea for an awesome assessment?
            </h3>
            <p className="text-white/70">
              Contact Chris Day, Founder & CEO
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm">
            © 2024 Lifecycle Manager X - Assessment Generator. Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
