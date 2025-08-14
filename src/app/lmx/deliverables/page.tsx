'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScalepadLogo from '@/components/ScalepadLogo';

export default function Deliverables() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [qbrReports, setQbrReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Load QBR reports data
    const loadQBRReports = async () => {
      try {
        const response = await fetch('/api/deliverables');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setQbrReports(data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Failed to load QBR reports:', error);
        // Fallback to empty array
        setQbrReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadQBRReports();
  }, []);

  const formatRelativeTime = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
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

  // Separate aggregate and individual reports
  const aggregateReports = qbrReports.filter(report => report.type === 'aggregate');
  const individualReports = qbrReports.filter(report => report.type === 'individual');

  const features = [
    {
      title: "Real-time Data Integration",
      description: "Live metrics from Cork API with automated data collection",
      icon: "📡",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "AI-Generated Insights",
      description: "Intelligent analysis and automated recommendations",
      icon: "🤖",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      title: "Risk Assessment",
      description: "Automated risk scoring and security posture analysis",
      icon: "⚠️",
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Professional Reports",
      description: "Modern, responsive layout with clean sections",
      icon: "📊",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

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
            <li className="text-white font-medium">Deliverables</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-white/80 text-sm">AI-Enhanced QBR Reports</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              QBR Deliverables
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto mb-8 animate-slide-up delay-200">
            Client communication tools for roadmap planning, prioritization, presentation, and professional "leave behind" materials.
          </p>
          

        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12 animate-slide-up delay-400">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                
                <div className="relative z-10 text-center">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="max-w-7xl mx-auto mb-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading QBR reports...</p>
            </div>
          </div>
        )}

        {/* Comprehensive QBR Report */}
        {!loading && aggregateReports.length > 0 && (
          <div className="max-w-7xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12 animate-slide-up delay-500">
              Comprehensive QBR Report
            </h2>
            
            <div className="mb-16">
              {aggregateReports.map((report, index) => (
                <div
                  key={report.id}
                  className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 animate-slide-up cursor-pointer max-w-4xl mx-auto"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${report.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                                      {/* Header with Icon and Timestamp */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-6xl">{report.icon}</div>
                    <div className="text-xs text-white/60 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                      Updated {formatRelativeTime(report.lastUpdated)}
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {report.title}
                  </h3>
                  
                  <p className="text-white/70 mb-6 leading-relaxed text-lg">
                    {report.description}
                  </p>
                    
                    {/* Action Button */}
                    <Link 
                      href={report.qbrUrl}
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 group/btn text-lg"
                    >
                      View Comprehensive Report
                      <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Individual QBR Report Examples */}
        {!loading && individualReports.length > 0 && (
          <div className="max-w-7xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12 animate-slide-up delay-600">
              Individual Platform Reports
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {individualReports.map((report, index) => (
                <div
                  key={report.id}
                  className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${700 + index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${report.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                                      {/* Header with Icon and Timestamp */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl">{report.icon}</div>
                    <div className="text-xs text-white/60 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                      Updated {formatRelativeTime(report.lastUpdated)}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {report.title}
                  </h3>
                  
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {report.description}
                  </p>
                    
                    {/* Action Button */}
                                                              <Link 
                       href={report.qbrUrl}
                       className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 group/btn"
                     >
                       View QBR Report
                       <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                       </svg>
                     </Link>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}

        {/* Report Sections */}
        <div className="text-center mb-16">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">
              📊 Enhanced QBR Report Sections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">⚠️</span>
                  Risks
                </h4>
                <p className="text-white/70 text-sm">Security posture analysis and risk assessment with automated scoring.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">🤖</span>
                  Insights
                </h4>
                <p className="text-white/70 text-sm">Data-driven observations about the environment and performance metrics.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white flex items-center">
                  <span className="text-2xl mr-2">🎯</span>
                  Recommendations
                </h4>
                <p className="text-white/70 text-sm">Actionable improvement suggestions based on AI analysis.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500">
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                QBR Report Documentation
              </h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Learn how to create and customize QBR reports using our comprehensive documentation. Complete guide with examples, best practices, and implementation instructions.
              </p>
              <Link
                href="/lmx/deliverables/documentation"
                className="inline-flex px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm">
            © 2024 Lifecycle Manager X - QBR Deliverables. Built with Next.js, TypeScript, and Tailwind CSS.
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
        
        .delay-400 {
          animation-delay: 400ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
        
        .delay-600 {
          animation-delay: 600ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
