import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const PlatformBadge = ({ platform, count, showCount = true, size = 'md' }) => {
  const platformConfig = {
    whatsapp: {
      icon: 'MessageCircle',
      label: 'WhatsApp',
      variant: 'whatsapp',
      color: '#25D366'
    },
    facebook: {
      icon: 'Facebook',
      label: 'Facebook',
      variant: 'facebook',
      color: '#1877F2'
    },
    instagram: {
      icon: 'Instagram',
      label: 'Instagram', 
      variant: 'instagram',
      color: '#E4405F'
    },
    twitter: {
      icon: 'Twitter',
      label: 'Twitter',
      variant: 'twitter',
      color: '#1DA1F2'
    }
  };

  const config = platformConfig[platform];
  if (!config) return null;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2"
    >
      <Badge variant={config.variant} size={size}>
        <div className="flex items-center gap-1.5">
          <ApperIcon name={config.icon} size={size === 'sm' ? 12 : 14} />
          <span>{config.label}</span>
          {showCount && count > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
              {count}
            </span>
          )}
        </div>
      </Badge>
    </motion.div>
  );
};

export default PlatformBadge;