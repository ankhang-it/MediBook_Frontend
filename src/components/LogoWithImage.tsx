import { Heart } from 'lucide-react';

interface LogoWithImageProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  logoSrc?: string;
  logoAlt?: string;
}

export function LogoWithImage({ 
  size = 'md', 
  showText = true, 
  className = '',
  logoSrc = '/logo.jpg', // Đường dẫn đến logo của bạn
  logoAlt = 'MediBook Logo'
}: LogoWithImageProps) {
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
      <div className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-lg overflow-hidden`}>
        {logoSrc ? (
          <img 
            src={logoSrc} 
            alt={logoAlt}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              // Fallback to Heart icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
              }
            }}
          />
        ) : (
          <Heart className="w-6 h-6 text-white" />
        )}
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold text-primary-dark`}>
            MediBook
          </h1>
          <p className="text-xs text-muted-foreground">
            Hệ thống đặt lịch khám
          </p>
        </div>
      )}
    </div>
  );
}

// Component chỉ hiển thị icon logo
export function LogoIconWithImage({ 
  size = 'md', 
  className = '',
  logoSrc = '/logo.jpg', // Đường dẫn đến logo icon của bạn
  logoAlt = 'MediBook'
}: Omit<LogoWithImageProps, 'showText'>) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10', 
    xl: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark rounded-lg shadow-md overflow-hidden ${className}`}>
      {logoSrc ? (
        <img 
          src={logoSrc} 
          alt={logoAlt}
          className="w-full h-full object-contain p-0.5"
          onError={(e) => {
            // Fallback to Heart icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
            }
          }}
        />
      ) : (
        <Heart className="w-4 h-4 text-white" />
      )}
    </div>
  );
}
