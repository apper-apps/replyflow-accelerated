import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = 'md', 
  status,
  className = '' 
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-surface-400'
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  const avatarClasses = `${sizes[size]} rounded-full flex items-center justify-center font-medium ${className}`;

  return (
    <div className="relative inline-block">
      <motion.div
        className={avatarClasses}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt || name} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white">
            {name ? getInitials(name) : <ApperIcon name="User" size={size === 'sm' ? 14 : size === 'lg' ? 18 : size === 'xl' ? 24 : 16} />}
          </div>
        )}
      </motion.div>
      
      {status && (
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusColors[status]}`} />
      )}
    </div>
  );
};

export default Avatar;