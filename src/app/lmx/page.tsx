'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScalepadLogo from '@/components/ScalepadLogo';

export default function LifecycleManagerX() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const modules = [
    {
      title: "Assessments",
      description: "Comprehensive client assessment tools for MSPs to evaluate current infrastructure, security posture, and business needs.",
      icon: "🔍",
      gradient: "from-blue-500 to-cyan-500",
      status: "Active",
      features: ["Infrastructure audits", "Security assessments", "Gap analysis", "ROI calculations"]
    },
    {
      title: "Deliverables",
      description: "Streamlined delivery management system for MSPs to track, manage, and deliver client projects and services.",
      icon: "📦",
      gradient: "from-purple-500 to-pink-500",
      status: "In Development",
      features: ["Project tracking", "Service delivery", "Client reporting", "Milestone management"]
    },
    {
      title: "Projects",
      description: "End-to-end project management platform designed specifically for MSP workflows and client engagement.",
      icon: "🚀",
      gradient: "from-green-500 to-emerald-500",
      status: "Planning",
      features: ["Project lifecycle", "Resource allocation", "Client communication", "Timeline management"]
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
            <li className="text-white font-medium">Lifecycle Manager X</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-white/80 text-sm">Enterprise Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Lifecycle Manager X
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto mb-8 animate-slide-up delay-200">
            A comprehensive Customer Success Platform designed specifically for Managed Service Providers (MSPs), 
            streamlining client assessments, project delivery, and lifecycle management.
          </p>
          

        </div>

        {/* Prototypes Grid */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12 animate-slide-up delay-400">
            MSP Platform Modules
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {modules.map((module, index) => (
                              <div
                  key={module.title}
                  className={`group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-500 animate-slide-up ${
                    module.status === 'Planning' 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-white/10 transform hover:scale-105 cursor-pointer'
                  }`}
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${
                    module.status === 'Planning' 
                      ? 'from-gray-500 to-gray-600' 
                      : module.gradient
                  } opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-4xl mb-4">{module.icon}</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        module.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        module.status === 'In Development' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        module.status === 'Planning' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {module.status}
                      </span>
                    </div>
                    
                    <h3 className={`text-2xl font-bold mb-4 transition-all duration-300 ${
                      module.status === 'Planning' 
                        ? 'text-white/60' 
                        : 'text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text'
                    }`}>
                      {module.title}
                    </h3>
                    
                    <p className={`mb-6 leading-relaxed ${
                      module.status === 'Planning' 
                        ? 'text-white/50' 
                        : 'text-white/70'
                    }`}>
                      {module.description}
                    </p>
                    
                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {module.features.map((feature) => (
                        <div key={feature} className={`flex items-center text-sm ${
                          module.status === 'Planning' 
                            ? 'text-white/40' 
                            : 'text-white/60'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-3 ${
                            module.status === 'Planning' 
                              ? 'bg-gray-400' 
                              : 'bg-blue-400'
                          }`}></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    {/* Action Button */}
                    {module.status === 'Planning' ? (
                      <div className="inline-flex items-center text-gray-400 font-semibold">
                        Coming Soon
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    ) : (
                      <Link 
                        href={module.title === "Assessments" ? "/lmx/assessments" : 
                              module.title === "Deliverables" ? "/lmx/deliverables" : 
                              "/lmx/projects"}
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 group/btn"
                      >
                        Explore Module
                        <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your MSP Operations?
            </h3>
            <p className="text-white/70 mb-6">
              Streamline your client success workflows and deliver exceptional service with our MSP-focused platform.
            </p>
            <div className="text-center">
              <p className="text-white/80 text-lg">
                Contact Chris Day, Founder & CEO
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm">
            © 2024 Lifecycle Manager X. Built with Next.js, TypeScript, and Tailwind CSS.
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
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
