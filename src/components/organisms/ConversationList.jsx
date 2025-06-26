import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationCard from '@/components/molecules/ConversationCard';
import SearchBar from '@/components/molecules/SearchBar';
import PlatformBadge from '@/components/molecules/PlatformBadge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import conversationService from '@/services/api/conversationService';
import { toast } from 'react-toastify';

const ConversationList = ({ 
  selectedConversation,
  onConversationSelect,
  className = '' 
}) => {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchFilters, setSearchFilters] = useState({});

  useEffect(() => {
    loadConversations();
    loadUnreadCounts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [conversations, activeFilter, searchFilters]);

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await conversationService.getAll();
      setConversations(data);
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCounts = async () => {
    try {
      const counts = await conversationService.getUnreadCounts();
      setUnreadCounts(counts);
    } catch (err) {
      console.error('Failed to load unread counts:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...conversations];

    // Platform filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(conv => conv.platform === activeFilter);
    }

    // Search filters
    if (searchFilters.platform?.length) {
      filtered = filtered.filter(conv => searchFilters.platform.includes(conv.platform));
    }
    if (searchFilters.status?.length) {
      filtered = filtered.filter(conv => searchFilters.status.includes(conv.status));
    }
    if (searchFilters.priority?.length) {
      filtered = filtered.filter(conv => searchFilters.priority.includes(conv.priority.toString()));
    }

    // Sort by last message time and priority
    filtered.sort((a, b) => {
      // High priority first
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      // Then by last message time
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });

    setFilteredConversations(filtered);
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      applyFilters();
      return;
    }

    setLoading(true);
    try {
      const results = await conversationService.searchConversations(query);
      setFilteredConversations(results);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    applyFilters();
  };

  const handleConversationClick = async (conversation) => {
    onConversationSelect?.(conversation);
    
    // Mark as read if it has unread messages
    if (conversation.unreadCount > 0) {
      try {
        await conversationService.markAsRead(conversation.Id);
        loadConversations();
        loadUnreadCounts();
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }
  };

  const platforms = [
    { key: 'all', label: 'All Messages', count: unreadCounts.total },
    { key: 'whatsapp', label: 'WhatsApp', count: unreadCounts.whatsapp },
    { key: 'facebook', label: 'Facebook', count: unreadCounts.facebook },
    { key: 'instagram', label: 'Instagram', count: unreadCounts.instagram },
    { key: 'twitter', label: 'Twitter', count: unreadCounts.twitter }
  ];

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-surface-200 rounded-lg h-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && conversations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <ApperIcon name="AlertCircle" size={48} className="text-red-400 mx-auto" />
          <div>
            <h3 className="text-lg font-medium text-surface-900">Failed to load conversations</h3>
            <p className="text-surface-600 mt-2">{error}</p>
          </div>
          <Button onClick={loadConversations} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`h-full flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-surface-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">Conversations</h2>
          <Button size="sm" variant="ghost" icon="RefreshCw" onClick={loadConversations}>
            Refresh
          </Button>
        </div>

        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          showFilters={true}
          filters={searchFilters}
          onFilterChange={setSearchFilters}
          placeholder="Search conversations..."
        />
      </div>

      {/* Platform Filters */}
      <div className="flex-shrink-0 p-4 bg-surface-50 border-b border-surface-200">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {platforms.map((platform) => (
            <motion.button
              key={platform.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(platform.key)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-shrink-0
                ${activeFilter === platform.key
                  ? 'bg-primary-100 text-primary-700 shadow-sm'
                  : 'bg-white text-surface-600 hover:bg-surface-100'
                }
              `}
            >
              {platform.key === 'all' ? (
                <ApperIcon name="MessageSquare" size={16} />
              ) : (
                <PlatformBadge platform={platform.key} showCount={false} size="sm" />
              )}
              <span className="whitespace-nowrap">{platform.label}</span>
              {platform.count > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs font-semibold">
                  {platform.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="h-full flex items-center justify-center p-6"
          >
            <div className="text-center space-y-4">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="MessageSquare" size={48} className="text-surface-300 mx-auto" />
              </motion.div>
              <div>
                <h3 className="text-lg font-medium text-surface-900">No conversations found</h3>
                <p className="text-surface-600 mt-2">
                  {activeFilter === 'all' 
                    ? "No conversations to display yet" 
                    : `No ${activeFilter} conversations found`
                  }
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="p-4 space-y-3">
            <AnimatePresence>
              {filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.Id}
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ConversationCard
                    conversation={conversation}
                    isActive={selectedConversation?.Id === conversation.Id}
                    onClick={handleConversationClick}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ConversationList;