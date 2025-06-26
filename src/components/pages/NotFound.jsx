import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  const pageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    exit: { opacity: 0, scale: 1.1 }
  };

  const iconVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 10, -10, 0],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full flex items-center justify-center bg-surface-50"
    >
      <div className="text-center space-y-6 max-w-md px-4">
        <motion.div
          variants={iconVariants}
          initial="initial"
          animate="animate"
          className="flex justify-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
            <ApperIcon name="MessageSquareX" size={48} className="text-primary-600" />
          </div>
        </motion.div>

        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-surface-900"
          >
            404
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-surface-700"
          >
            Page Not Found
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-surface-600 leading-relaxed"
          >
            The conversation you're looking for seems to have wandered off. 
            Let's get you back to handling customer messages.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            variant="primary"
            icon="MessageSquare"
            onClick={() => navigate('/')}
          >
            Go to Inbox
          </Button>
          
          <Button
            variant="secondary"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-surface-500"
        >
          Need help? Our AI assistant is always ready to help you navigate.
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;