import { memo } from 'react';

const LoadingSpinner = memo(function LoadingSpinner({ size = 'md', className = '', text = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
      {text && <span className="ml-2 text-gray-600">{text}</span>}
    </div>
  );
});

export default LoadingSpinner;