// client/src/components/common/Button.js
const Button = ({ children, type = 'button', variant = 'primary', className = '', onClick, disabled = false }) => {
    const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
      success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
      danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
      warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500',
      info: 'bg-info-600 text-white hover:bg-info-700 focus:ring-info-500',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary-500',
    };
  
    return (
      <button
        type={type}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };
  
  export default Button;