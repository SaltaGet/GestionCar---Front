
type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

interface LoadingProps {
  size?: LoadingSize;
  color?: string;
  className?: string;
}

const getSizeClasses = (size: LoadingSize = 'md') => {
  if (typeof size === 'number') {
    return { width: size, height: size };
  }
  
  const sizes = {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64
  };
  
  return { width: sizes[size], height: sizes[size] };
};

// 1. Spinner (clásico)
export const Spinner = ({ size = 'md', color = 'text-blue-500', className = '' }: LoadingProps) => {
  const { width, height } = getSizeClasses(size);
  
  return (
    <svg
      className={`animate-spin ${color} ${className}`}
      style={{ width, height }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

// 2. Bouncing Dots
export const Dots = ({ size = 'md', color = 'text-gray-600', className = '' }: LoadingProps) => {
  const { width } = getSizeClasses(size);
  const dotSize = Math.max(4, width / 3);
  
  return (
    <div 
      className={`flex items-center justify-center gap-1 ${className}`}
      style={{ height: width }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${color} rounded-full`}
          style={{
            width: dotSize,
            height: dotSize,
            animation: `bounce 1.5s infinite ${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
};

// 3. Barra de progreso
export const Bar = ({ 
  size = 'md', 
  color = 'bg-blue-500', 
  className = '',
  width = 'w-64'
}: LoadingProps & { width?: string }) => {
  const heights = {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 10
  };
  
  const height = typeof size === 'number' ? size : heights[size];
  
  return (
    <div className={`${width} bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`${color} animate-progress`}
        style={{ 
          height,
          transformOrigin: '0% 50%',
          animationTimingFunction: 'cubic-bezier(0.65, 0.05, 0.36, 1)'
        }}
      />
    </div>
  );
};

// 4. Esqueleto (Skeleton)
export const Skeleton = ({ size = 'md', className = '' }: Omit<LoadingProps, 'color'>) => {
  const { width, height } = getSizeClasses(size);
  
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ width, height }}
    />
  );
};