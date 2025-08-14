'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Projects() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const projectTypes = [
    {
      name: "Infrastructure Migration",
      description: "End-to-end infrastructure migration projects with detailed planning and execution tracking",
      icon: "🏗️",
      gradient: "from-blue-500 to-cyan-500",
      status: "Planning",
      features: ["Migration planning", "Resource allocation", "Risk mitigation", "Rollback procedures"]
    },
    {
      name: "Security Implementation",
      description: "Comprehensive security implementation projects with compliance tracking",
      icon: "🔒",
      gradient: "from-purple-500 to-pink-500",
      status: "In Development",
      features: ["Security assessment", "Implementation tracking", "Compliance monitoring", "Training delivery"]
    },
    {
      name: "Cloud Transformation",
      description: "Cloud migration and transformation projects with cost optimization",
      icon: "☁️",
      gradient: "from-green-500 to-emerald-500",
      status: "Active",
      features: ["Cloud strategy", "Cost optimization", "Performance monitoring", "Scalability planning"]
    },
    {
      name: "Digital Workplace",
      description: "Digital workplace transformation with user adoption tracking",
      icon: "💻",
      gradient: "from-orange-500 to-red-500",
      status: "Planning",
      features: ["User adoption", "Training programs", "Change management", "ROI tracking"]
    }
  ];

  const capabilities = [
    {
      title: "Project Lifecycle Management",
      description: "Complete project lifecycle from initiation to closure with milestone tracking",
      icon: "📋",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      title: "Resource Allocation",
      description: "Intelligent resource allocation and capacity planning for MSP teams",
      icon: "👥",
      gradient: "from-teal-500 to-blue-500"
    },
    {
      title: "Client Communication",
      description: "Automated client communication and status reporting",
      icon: "💬",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Timeline Management",
      description: "Advanced timeline management with critical path analysis",
      icon: "⏰",
      gradient: "from-yellow-500 to-orange-500"
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
            <li className="text-white font-medium">Projects</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-white/80 text-sm">MSP Project Management</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            Project
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Management
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto mb-8 animate-slide-up delay-200">
            End-to-end project management platform designed specifically for MSP workflows 
            and client engagement with advanced resource allocation and timeline management.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up delay-300">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/80">
              📋 Lifecycle Management
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/80">
              👥 Resource Allocation
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/80">
              ⏰ Timeline Tracking
            </span>
          </div>
        </div>

        {/* Project Types Grid */}
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12 animate-slide-up delay-400">
            Project Types
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {projectTypes.map((project, index) => (
              <div
                key={project.name}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 animate-slide-up cursor-pointer"
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-4xl mb-4">{project.icon}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      project.status === 'In Development' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {project.name}
                  </h3>
                  
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {project.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-white/60">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Button */}
                  <button className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 group/btn">
                    Create Project
                    <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities Section */}
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12 animate-slide-up delay-500">
            Platform Capabilities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {capabilities.map((capability, index) => (
              <div
                key={capability.title}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${capability.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                
                <div className="relative z-10 text-center">
                  <div className="text-3xl mb-4">{capability.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {capability.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Streamline Your Project Management?
            </h3>
            <p className="text-white/70 mb-6">
              Transform your MSP project delivery with our comprehensive project management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                Start New Project
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                View Templates
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm">
            © 2024 Lifecycle Manager X - Project Management. Built with Next.js and modern web technologies.
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
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
