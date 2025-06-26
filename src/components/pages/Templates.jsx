import { useState } from 'react';
import { motion } from 'framer-motion';
import TemplateGrid from '@/components/organisms/TemplateGrid';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const categories = [
    { key: 'all', label: 'All Templates', icon: 'FileText', count: 12 },
    { key: 'orders', label: 'Orders', icon: 'Package', count: 3 },
    { key: 'products', label: 'Products', icon: 'ShoppingBag', count: 2 },
    { key: 'technical', label: 'Technical', icon: 'Settings', count: 2 },
    { key: 'billing', label: 'Billing', icon: 'CreditCard', count: 2 },
    { key: 'general', label: 'General', icon: 'MessageSquare', count: 3 }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleCopyTemplate = (template) => {
    navigator.clipboard.writeText(template.content);
    // Toast notification would be shown here
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

  const sidebarVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  };

  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full bg-surface-50"
    >
      <div className="h-full flex">
        {/* Categories Sidebar */}
        <motion.div
          variants={sidebarVariants}
          className="w-64 bg-white border-r border-surface-200 flex-shrink-0"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-surface-900 mb-6">Template Library</h2>
            
            <nav className="space-y-2">
              {categories.map((category) => (
                <motion.button
                  key={category.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`
                    w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${selectedCategory === category.key
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <ApperIcon name={category.icon} size={18} />
                    <span>{category.label}</span>
                  </div>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-semibold
                    ${selectedCategory === category.key
                      ? 'bg-primary-200 text-primary-800'
                      : 'bg-surface-200 text-surface-600'
                    }
                  `}>
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="p-6 border-t border-surface-200">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Sparkles" size={16} className="text-primary-600" />
                <span className="text-sm font-medium text-primary-700">Pro Tip</span>
              </div>
              <p className="text-xs text-primary-600">
                Use variables like {`{{customerName}}`} to personalize your templates automatically.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Templates Content */}
        <motion.div
          variants={contentVariants}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6">
            <TemplateGrid
              selectedCategory={selectedCategory}
              onTemplateSelect={handleTemplateSelect}
            />
          </div>
        </motion.div>
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTemplate(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">
                {selectedTemplate.title}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                icon="X"
                onClick={() => setSelectedTemplate(null)}
              />
            </div>

            <div className="space-y-4">
              <div className="bg-surface-50 rounded-lg p-4">
                <p className="text-sm text-surface-700 leading-relaxed whitespace-pre-wrap">
                  {selectedTemplate.content}
                </p>
              </div>

              {selectedTemplate.variables?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-surface-900 mb-2">Variables:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium"
                      >
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  icon="Copy"
                  onClick={() => handleCopyTemplate(selectedTemplate)}
                  className="flex-1"
                >
                  Copy Template
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedTemplate(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Templates;