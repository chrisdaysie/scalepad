'use client';

import { useState, useEffect } from 'react';
import ScalepadLogo from '@/components/ScalepadLogo';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.1}px`,
            top: `${mousePosition.y * 0.1}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            right: `${mousePosition.x * 0.05}px`,
            bottom: `${mousePosition.y * 0.05}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Logo */}
        <div className="absolute top-8 right-8 z-20">
          <ScalepadLogo size="lg" showText={false} variant="light" />
        </div>
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-white/80 text-sm">Available for new projects</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-slide-up">
            Chris Day&apos;s
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Playground
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 animate-slide-up delay-200">
            Exploring the intersection of technology and creativity through innovative web applications, 
            AI experiments, and cutting-edge development projects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-300">
            <a href="/lmx" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 whitespace-nowrap">
              Explore Lifecycle Manager X
            </a>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              Get in Touch
            </button>
          </div>
        </div>

        {/* Coming Soon Projects */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12 animate-slide-up delay-400">
            Coming Soon
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 opacity-50 cursor-not-allowed">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-white/60 mb-4">
                  AI-Powered Analytics
                </h3>
                <p className="text-white/50 mb-6 leading-relaxed">
                  Advanced analytics platform with machine learning insights and predictive modeling.
                </p>
                <div className="flex items-center text-white/40 text-sm">
                  <span className="px-3 py-1 bg-white/10 rounded-full">Coming Soon</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 opacity-50 cursor-not-allowed">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-white/60 mb-4">
                  Creative Studio
                </h3>
                <p className="text-white/50 mb-6 leading-relaxed">
                  Digital design and creative tools for modern content creation workflows.
                </p>
                <div className="flex items-center text-white/40 text-sm">
                  <span className="px-3 py-1 bg-white/10 rounded-full">Coming Soon</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 opacity-50 cursor-not-allowed">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="text-2xl font-bold text-white/60 mb-4">
                  Research Lab
                </h3>
                <p className="text-white/50 mb-6 leading-relaxed">
                  Experimental projects and cutting-edge technology research platform.
                </p>
                <div className="flex items-center text-white/40 text-sm">
                  <span className="px-3 py-1 bg-white/10 rounded-full">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm">
            © 2024 Chris Day. Built with Next.js, TypeScript, and Tailwind CSS.
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
