import React from 'react';
import { Heart } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl', 
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <div className={`${sizeClasses[size]} flex items-center justify-center bg-white rounded-xl shadow-lg overflow-hidden border-2 border-primary/20`}>
        <img 
          src="/logo.jpg" 
          alt="Trung tâm Y khoa Phúc Khang Đà Nẵng" 
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            // Fallback to Heart icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '<svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
            }
          }}
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-extrabold text-primary-dark`}>
            Phúc Khang
          </h1>
          <p className="text-xs font-semibold text-muted-foreground">
            Trung tâm Y khoa Đà Nẵng
          </p>
        </div>
      )}
    </div>
  );
}

// Component chỉ hiển thị icon logo
export function LogoIcon({ size = 'md', className = '' }: Omit<LogoProps, 'showText'>) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10', 
    xl: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center bg-white rounded-lg shadow-md overflow-hidden border border-primary/20 ${className}`}>
      <img 
        src="/logo.jpg" 
        alt="Phúc Khang" 
        className="w-full h-full object-contain p-0.5"
        onError={(e) => {
          // Fallback to Heart icon if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = '<svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
          }
        }}
      />
    </div>
  );
}
