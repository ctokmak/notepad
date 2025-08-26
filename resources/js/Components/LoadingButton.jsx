import { memo } from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingButton = memo(function LoadingButton({ 
  children, 
  loading = false, 
  disabled = false, 
  className = '', 
  loadingText = '',
  ...props 
}) {
  const isDisabled = disabled || loading;
  
  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        relative
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `.trim()}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <span className={loading ? 'invisible' : 'visible'}>
        {loading && loadingText ? loadingText : children}
      </span>
    </button>
  );
});

export default LoadingButton;