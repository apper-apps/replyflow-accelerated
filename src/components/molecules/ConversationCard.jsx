import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
import PlatformBadge from '@/components/molecules/PlatformBadge';
import ApperIcon from '@/components/ApperIcon';

const ConversationCard = ({ 
  conversation, 
  isActive = false, 
  onClick,
  className = '' 
}) => {
  const getPriorityColor = (priority) => {
    const colors = {
      3: 'danger',
      2: 'warning', 
      1: 'success'
    };
    return colors[priority] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'danger',
      pending: 'warning',
      resolved: 'success'
    };
    return colors[status] || 'default';
  };

  const getLastMessage = () => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 'No messages yet';
    }
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.content.length > 60 
      ? `${lastMessage.content.substring(0, 60)}...` 
      : lastMessage.content;
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02, y: -2 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ duration: 0.2 }}
      onClick={() => onClick?.(conversation)}
      className={`
        p-4 rounded-lg cursor-pointer transition-all duration-200 border
        ${isActive 
          ? 'bg-primary-50 border-primary-200 shadow-md' 
          : 'bg-white border-surface-200 hover:border-surface-300 hover:shadow-card-hover'
        }
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 relative">
          <Avatar name={conversation.customerName} size="md" />
          {conversation.unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            >
              <span className="text-xs font-bold text-white">{conversation.unreadCount}</span>
            </motion.div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-surface-900 truncate">
              {conversation.customerName}
            </h3>
            <div className="flex items-center gap-1.5">
              {conversation.priority === 3 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ApperIcon name="AlertCircle" size={14} className="text-red-500" />
                </motion.div>
              )}
              <PlatformBadge 
                platform={conversation.platform} 
                showCount={false} 
                size="sm" 
              />
            </div>
          </div>

          <p className="text-sm text-surface-600 line-clamp-2 leading-relaxed">
            {getLastMessage()}
          </p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={getStatusColor(conversation.status)} size="sm">
                {conversation.status}
              </Badge>
              <Badge variant={getPriorityColor(conversation.priority)} size="sm">
                {conversation.priority === 3 ? 'High' : conversation.priority === 2 ? 'Medium' : 'Low'}
              </Badge>
            </div>
            
            <span className="text-xs text-surface-500">
              {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationCard;