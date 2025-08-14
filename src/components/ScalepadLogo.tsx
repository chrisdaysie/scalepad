import Image from 'next/image';
import Link from 'next/link';

interface ScalepadLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export default function ScalepadLogo({ 
  className = '', 
  showText = true, 
  size = 'md',
  variant = 'light'
}: ScalepadLogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-10',
    md: 'w-24 h-15', 
    lg: 'w-32 h-20'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const textColorClasses = {
    light: 'text-white',
    dark: 'text-gray-900'
  };

  return (
    <Link 
      href="/" 
      className={`flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 ${className}`}
    >
      <div className={`relative ${sizeClasses[size]}`}>
        <Image
          src="/scalepad-logo.png"
          alt="Scalepad"
          width={320}
          height={200}
          className={`w-full h-full object-contain ${variant === 'light' ? 'brightness-0 invert' : ''}`}
        />
      </div>
      {showText && (
        <span className={`font-semibold ${textColorClasses[variant]} ${textSizeClasses[size]}`}>
          Scalepad
        </span>
      )}
    </Link>
  );
}
