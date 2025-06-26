import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const AISuggestionCard = ({ 
  suggestion, 
  confidence = 85,
  onUse,
  onCustomize,
  className = '' 
}) => {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 70) return 'warning';
    return 'default';
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    hover: { scale: 1.02 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.3 }}
      className={`gradient-border rounded-lg p-4 bg-white shadow-sm ${className}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <ApperIcon name="Sparkles" size={16} className="text-primary-600" />
            </motion.div>
            <span className="text-sm font-medium text-surface-900">AI Suggestion</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={getConfidenceColor(confidence)} size="sm">
              {confidence}% match
            </Badge>
          </div>
        </div>

        <div className="bg-surface-50 rounded-lg p-3">
          <p className="text-sm text-surface-700 leading-relaxed">
            {suggestion}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="accent"
            icon="Send"
            onClick={() => onUse?.(suggestion)}
            className="flex-1"
          >
            Use Response
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            icon="Edit"
            onClick={() => onCustomize?.(suggestion)}
          >
            Customize
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AISuggestionCard;