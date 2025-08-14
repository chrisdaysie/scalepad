'use client';

import { useState, useEffect } from 'react';
import ScalepadLogo from '@/components/ScalepadLogo';
import Image from 'next/image';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [revealCount, setRevealCount] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleReveal = () => {
    setRevealCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Mysterious Background */}
      <div className="absolute inset-0">
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Gradient orbs */}
        <div 
          className="absolute w-[800px] h-[800px] bg-gradient-radial from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl"
          style={{
            left: `${mousePosition.x * 0.1 - 400}px`,
            top: `${mousePosition.y * 0.1 - 400}px`,
            transition: 'all 0.5s ease-out'
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] bg-gradient-radial from-blue-500/10 via-transparent to-transparent rounded-full blur-3xl"
          style={{
            right: `${mousePosition.x * 0.05 - 300}px`,
            bottom: `${mousePosition.y * 0.05 - 300}px`,
            transition: 'all 0.5s ease-out'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Mysterious Logo */}
        <div className="absolute top-8 right-8 z-20 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <div className="relative group">
            <ScalepadLogo size="lg" showText={false} variant="light" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="text-center mb-20 mt-20">

          
          {/* Enigmatic Title */}
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-slide-up font-mono">
            <span className="text-white/40">[</span>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              SCALEPAD_PLAYGROUND
            </span>
            <span className="text-white/40">]</span>
          </h1>
          
          {/* Mysterious Description */}
          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto mb-12 animate-slide-up delay-200 font-mono">
            <span className="text-purple-400">//</span> A digital laboratory where ideas converge and possibilities emerge
          </p>
          
          {/* Hidden Image Reveal */}
          <div className="relative mb-12 animate-slide-up delay-300">
            <div 
              className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-2 border-white/10 cursor-pointer group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleReveal}
            >
              <Image
                src="/chrisday.jpg"
                alt="Mysterious Figure"
                fill
                className={`object-cover transition-all duration-700 ${
                  isHovered || revealCount > 0 ? 'scale-100 opacity-100' : 'scale-110 opacity-30'
                }`}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-500 ${
                isHovered ? 'opacity-0' : 'opacity-100'
              }`} />
              
            </div>
          </div>
          
          {/* Mysterious Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-400">
            <a 
              href="/lmx" 
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 text-white rounded-lg font-mono hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10">ENTER_LABORATORY</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <button className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white/60 rounded-lg font-mono hover:bg-white/10 hover:text-white/80 transition-all duration-300 transform hover:scale-105">
              INITIATE_CONTACT
            </button>
          </div>
        </div>


          





            <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 opacity-60 cursor-not-allowed">
              <div className="relative z-10">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-white/60 mb-4 font-mono">
                  CREATIVE_STUDIO_V2
                </h3>
                <p className="text-white/40 mb-6 leading-relaxed text-sm">
                  Next-generation design tools and creative workflow automation.
                </p>
                <div className="flex items-center text-blue-400 text-sm font-mono">
                  <span className="px-3 py-1 bg-blue-400/10 rounded-full border border-blue-400/20">PLANNED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mysterious Footer */}
        <div className="text-center mt-20 pt-8 border-t border-white/10">
          <p className="text-white/30 text-sm font-mono">
            <span className="text-purple-400">//</span> SCALEPAD_PLAYGROUND © 2024
          </p>
          <p className="text-white/20 text-xs font-mono mt-2">
            BUILT_WITH_NEXTJS_TYPESCRIPT_TAILWIND
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
      `}</style>
    </div>
  );
}
