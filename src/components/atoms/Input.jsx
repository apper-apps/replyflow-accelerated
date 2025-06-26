import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label,
  type = 'text',
  placeholder,
  error,
  icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  value,
  onChange,
  onFocus,
  onBlur,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e) => {
    setHasValue(Boolean(e.target.value));
    onChange?.(e);
  };

  const inputClasses = `
    w-full px-3 py-2.5 text-sm border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-surface-300'}
    ${disabled ? 'bg-surface-50 text-surface-500 cursor-not-allowed' : 'bg-white text-surface-900'}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className="relative">
      {label && (
        <motion.label
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            isFocused || hasValue || placeholder
              ? 'top-0 text-xs bg-white px-1 -translate-y-1/2'
              : 'top-1/2 text-sm -translate-y-1/2'
          } ${
            error ? 'text-red-600' : isFocused ? 'text-primary-600' : 'text-surface-500'
          }`}
          initial={false}
          animate={{
            fontSize: isFocused || hasValue || placeholder ? '0.75rem' : '0.875rem',
            color: error ? '#dc2626' : isFocused ? '#7c3aed' : '#6b7280'
          }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ApperIcon 
              name={icon} 
              size={16} 
              className={error ? 'text-red-400' : isFocused ? 'text-primary-500' : 'text-surface-400'} 
            />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ApperIcon 
              name={icon} 
              size={16} 
              className={error ? 'text-red-400' : isFocused ? 'text-primary-500' : 'text-surface-400'} 
            />
          </div>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;