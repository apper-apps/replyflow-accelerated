import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from '@/components/molecules/MessageBubble';
import AISuggestionCard from '@/components/molecules/AISuggestionCard';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import PlatformBadge from '@/components/molecules/PlatformBadge';
import ApperIcon from '@/components/ApperIcon';
import conversationService from '@/services/api/conversationService';
import { toast } from 'react-toastify';

const ChatView = ({ 
  conversation,
  onStatusChange,
  className = '' 
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiPanel, setShowAiPanel] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages || []);
      generateAiSuggestions();
      scrollToBottom();
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAiSuggestions = async () => {
    if (!conversation || !conversation.messages?.length) return;

    // Mock AI suggestions based on conversation context
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const suggestions = [];

    if (lastMessage.sentiment === 'negative') {
      suggestions.push({
        text: `Hi ${conversation.customerName}, I sincerely apologize for the inconvenience you're experiencing. Let me personally look into this matter and provide you with a solution right away.`,
        confidence: 92,
        type: 'empathy'
      });
      suggestions.push({
        text: `Thank you for bringing this to our attention, ${conversation.customerName}. This is definitely not the experience we want for our valued customers. I'm escalating this to our priority queue for immediate resolution.`,
        confidence: 87,
        type: 'escalation'
      });
    } else if (lastMessage.sentiment === 'positive') {
      suggestions.push({
        text: `Thank you so much for your kind words, ${conversation.customerName}! We're thrilled to hear about your positive experience. Is there anything else I can help you with today?`,
        confidence: 95,
        type: 'appreciation'
      });
    } else {
      suggestions.push({
        text: `Hi ${conversation.customerName}, thank you for reaching out! I'm here to help you with your inquiry. Let me get the information you need right away.`,
        confidence: 88,
        type: 'general'
      });
    }

    setAiSuggestions(suggestions);
  };

  const handleSendMessage = async (messageText = newMessage) => {
    if (!messageText.trim() || !conversation) return;

    setSending(true);
    try {
      const message = {
        sender: 'agent',
        content: messageText.trim(),
        isAiSuggestion: messageText !== newMessage,
        sentiment: 'neutral'
      };

      const savedMessage = await conversationService.addMessage(conversation.Id, message);
      setMessages(prev => [...prev, savedMessage]);
      setNewMessage('');
      
      // Update conversation status if needed
      if (conversation.status === 'open') {
        await conversationService.updateStatus(conversation.Id, 'pending');
        onStatusChange?.(conversation.Id, 'pending');
      }

      toast.success('Message sent successfully');
      
      // Generate new AI suggestions after sending
      setTimeout(generateAiSuggestions, 1000);
      
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleUseAiSuggestion = (suggestion) => {
    setNewMessage(suggestion.text);
    inputRef.current?.focus();
  };

  const handleCustomizeAiSuggestion = (suggestion) => {
    setNewMessage(suggestion.text);
    setShowAiPanel(false);
    inputRef.current?.focus();
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await conversationService.updateStatus(conversation.Id, newStatus);
      onStatusChange?.(conversation.Id, newStatus);
      toast.success(`Conversation ${newStatus}`);
    } catch (err) {
      toast.error(`Failed to update status`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center bg-surface-50">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="MessageSquare" size={64} className="text-surface-300 mx-auto" />
          </motion.div>
          <div>
            <h3 className="text-xl font-medium text-surface-900">Select a conversation</h3>
            <p className="text-surface-600 mt-2">Choose a conversation from the sidebar to start replying</p>
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3, staggerChildren: 0.1 }
    }
  };

  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`h-full flex flex-col ${className}`}
    >
      {/* Chat Header */}
      <div className="flex-shrink-0 bg-white border-b border-surface-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={conversation.customerName} size="md" />
            <div>
              <h3 className="font-semibold text-surface-900">{conversation.customerName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <PlatformBadge platform={conversation.platform} showCount={false} size="sm" />
                <Badge 
                  variant={conversation.status === 'open' ? 'danger' : conversation.status === 'pending' ? 'warning' : 'success'}
                  size="sm"
                >
                  {conversation.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              icon="Eye"
              onClick={() => setShowAiPanel(!showAiPanel)}
              className={showAiPanel ? 'bg-primary-100 text-primary-700' : ''}
            >
              AI Panel
            </Button>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={conversation.status === 'pending' ? 'accent' : 'secondary'}
                onClick={() => handleStatusChange('pending')}
                disabled={conversation.status === 'pending'}
              >
                Pending
              </Button>
              <Button
                size="sm"
                variant={conversation.status === 'resolved' ? 'accent' : 'secondary'}
                onClick={() => handleStatusChange('resolved')}
                disabled={conversation.status === 'resolved'}
              >
                Resolve
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.Id}
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: index * 0.05 }}
                >
                  <MessageBubble
                    message={message}
                    isAgent={message.sender === 'agent'}
                    showAvatar={true}
                    showTimestamp={true}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex-shrink-0 bg-white border-t border-surface-200 p-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sending}
                />
              </div>
              <Button
                variant="accent"
                icon="Send"
                loading={sending}
                disabled={!newMessage.trim()}
                onClick={() => handleSendMessage()}
              >
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* AI Suggestions Panel */}
        <AnimatePresence>
          {showAiPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 bg-surface-50 border-l border-surface-200 overflow-hidden"
            >
              <div className="h-full flex flex-col">
                <div className="flex-shrink-0 p-4 border-b border-surface-200 bg-white">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-surface-900">AI Suggestions</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="X"
                      onClick={() => setShowAiPanel(false)}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {aiSuggestions.length === 0 ? (
                    <div className="text-center py-8">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <ApperIcon name="Sparkles" size={32} className="text-surface-300 mx-auto mb-3" />
                      </motion.div>
                      <p className="text-sm text-surface-500">AI analyzing conversation...</p>
                    </div>
                  ) : (
                    aiSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <AISuggestionCard
                          suggestion={suggestion.text}
                          confidence={suggestion.confidence}
                          onUse={handleUseAiSuggestion}
                          onCustomize={handleCustomizeAiSuggestion}
                        />
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChatView;