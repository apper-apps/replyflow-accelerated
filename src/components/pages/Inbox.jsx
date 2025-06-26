import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ConversationList from "@/components/organisms/ConversationList";
import ChatView from "@/components/organisms/ChatView";
import conversationService from "@/services/api/conversationService";
import ApperIcon from "@/components/ApperIcon";
const Inbox = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleStatusChange = async (conversationId, newStatus) => {
    if (selectedConversation?.Id === conversationId) {
      setSelectedConversation(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full bg-surface-50"
    >
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full">
        <div className="w-96 border-r border-surface-200 bg-white">
          <ConversationList
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
          />
        </div>
        <div className="flex-1">
          <ChatView
            conversation={selectedConversation}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-full">
        {!selectedConversation ? (
          <ConversationList
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
          />
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 bg-white border-b border-surface-200 p-4">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                <motion.div whileTap={{ scale: 0.95 }}>
                  <ApperIcon name="ArrowLeft" size={20} />
                </motion.div>
                <span className="font-medium">Back to conversations</span>
              </button>
            </div>
            <div className="flex-1">
              <ChatView
                conversation={selectedConversation}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Inbox;