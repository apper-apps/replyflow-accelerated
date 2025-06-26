import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const MessageBubble = ({ 
  message, 
  isAgent = false, 
  showAvatar = true, 
  showTimestamp = true,
  className = '' 
}) => {
  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: 'text-green-600',
      neutral: 'text-surface-600',
      negative: 'text-red-600'
    };
    return colors[sentiment] || colors.neutral;
  };

  const bubbleVariants = {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.9 }
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isAgent ? 'flex-row-reverse' : 'flex-row'} ${className}`}
    >
      {showAvatar && (
        <div className="flex-shrink-0">
          {isAgent ? (
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
          ) : (
            <Avatar name={message.sender} size="sm" />
          )}
        </div>
      )}

      <div className={`flex-1 max-w-xs lg:max-w-md ${isAgent ? 'items-end' : 'items-start'} flex flex-col`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className={`px-4 py-2.5 rounded-2xl shadow-sm ${
            isAgent
              ? 'bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-br-md'
              : 'bg-white border border-surface-200 text-surface-900 rounded-bl-md'
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
          
          {message.isAiSuggestion && (
            <div className="mt-2 pt-2 border-t border-white/20">
              <div className="flex items-center gap-1.5 text-xs text-white/80">
                <ApperIcon name="Sparkles" size={12} />
                AI Suggested
              </div>
            </div>
          )}
        </motion.div>

        {showTimestamp && (
          <div className={`mt-1 flex items-center gap-2 text-xs text-surface-500 ${isAgent ? 'flex-row-reverse' : 'flex-row'}`}>
            <span>{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</span>
            
            {message.sentiment && !isAgent && (
              <div className="flex items-center gap-1">
                <ApperIcon 
                  name={message.sentiment === 'positive' ? 'Smile' : message.sentiment === 'negative' ? 'Frown' : 'Meh'} 
                  size={12} 
                  className={getSentimentColor(message.sentiment)} 
                />
                <Badge variant={message.sentiment === 'positive' ? 'success' : message.sentiment === 'negative' ? 'danger' : 'default'} size="sm">
                  {message.sentiment}
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;