import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import templateService from '@/services/api/templateService';
import { toast } from 'react-toastify';

const TemplateGrid = ({ 
  onTemplateSelect,
  selectedCategory = 'all',
  className = '' 
}) => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    content: '',
    category: 'general',
    variables: []
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const categories = [
    { key: 'all', label: 'All Templates', icon: 'FileText' },
    { key: 'orders', label: 'Orders', icon: 'Package' },
    { key: 'products', label: 'Products', icon: 'ShoppingBag' },
    { key: 'technical', label: 'Technical', icon: 'Settings' },
    { key: 'billing', label: 'Billing', icon: 'CreditCard' },
    { key: 'general', label: 'General', icon: 'MessageSquare' }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, selectedCategory]);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (err) {
      setError(err.message || 'Failed to load templates');
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    if (selectedCategory === 'all') {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(templates.filter(t => t.category === selectedCategory));
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.title.trim() || !newTemplate.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const created = await templateService.create(newTemplate);
      setTemplates(prev => [...prev, created]);
      setNewTemplate({ title: '', content: '', category: 'general', variables: [] });
      setShowCreateForm(false);
      toast.success('Template created successfully');
    } catch (err) {
      toast.error('Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async (id, data) => {
    setLoading(true);
    try {
      const updated = await templateService.update(id, data);
      setTemplates(prev => prev.map(t => t.Id === id ? updated : t));
      setEditingTemplate(null);
      toast.success('Template updated successfully');
    } catch (err) {
      toast.error('Failed to update template');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    setLoading(true);
    try {
      await templateService.delete(id);
      setTemplates(prev => prev.filter(t => t.Id !== id));
      toast.success('Template deleted successfully');
    } catch (err) {
      toast.error('Failed to delete template');
    } finally {
      setLoading(false);
    }
  };

  const extractVariables = (content) => {
    const matches = content.match(/{{(\w+)}}/g) || [];
    return matches.map(match => match.replace(/[{}]/g, ''));
  };

  const getCategoryInfo = (category) => {
    return categories.find(c => c.key === category) || categories[0];
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  if (loading && templates.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-surface-200 rounded-lg h-40"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error && templates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <ApperIcon name="AlertCircle" size={48} className="text-red-400 mx-auto" />
          <div>
            <h3 className="text-lg font-medium text-surface-900">Failed to load templates</h3>
            <p className="text-surface-600 mt-2">{error}</p>
          </div>
          <Button onClick={loadTemplates} variant="primary">
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
      className={className}
    >
      {/* Create Template Button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-surface-900">
          {selectedCategory === 'all' ? 'All Templates' : getCategoryInfo(selectedCategory).label}
        </h3>
        <Button
          icon="Plus"
          onClick={() => setShowCreateForm(true)}
          variant="primary"
        >
          Create Template
        </Button>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center h-64"
        >
          <div className="text-center space-y-4">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="FileText" size={48} className="text-surface-300 mx-auto" />
            </motion.div>
            <div>
              <h3 className="text-lg font-medium text-surface-900">No templates found</h3>
              <p className="text-surface-600 mt-2">
                {selectedCategory === 'all' 
                  ? "Create your first template to get started"
                  : `No ${getCategoryInfo(selectedCategory).label.toLowerCase()} templates yet`
                }
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} variant="primary">
              Create Template
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.Id}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white rounded-lg shadow-card border border-surface-200 p-4 cursor-pointer transition-all duration-200"
                onClick={() => onTemplateSelect?.(template)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <ApperIcon 
                        name={getCategoryInfo(template.category).icon} 
                        size={16} 
                        className="text-primary-600" 
                      />
                      <Badge variant="secondary" size="sm">
                        {getCategoryInfo(template.category).label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTemplate(template);
                        }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Trash2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template.Id);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-surface-900 line-clamp-1">
                      {template.title}
                    </h4>
                    <p className="text-sm text-surface-600 mt-1 line-clamp-3">
                      {template.content}
                    </p>
                  </div>

                  {template.variables?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable, idx) => (
                        <Badge key={idx} variant="default" size="sm">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Template Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCreateForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-surface-900">Create Template</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon="X"
                    onClick={() => setShowCreateForm(false)}
                  />
                </div>

                <div className="space-y-4">
                  <Input
                    label="Template Title"
                    placeholder="Enter template title..."
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                  />

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {categories.filter(c => c.key !== 'all').map(category => (
                        <option key={category.key} value={category.key}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Template Content
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Enter your template content... Use {{variableName}} for variables"
                      value={newTemplate.content}
                      onChange={(e) => {
                        const content = e.target.value;
                        const variables = extractVariables(content);
                        setNewTemplate(prev => ({ ...prev, content, variables }));
                      }}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                    {newTemplate.variables.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-surface-500 mb-1">Variables found:</p>
                        <div className="flex flex-wrap gap-1">
                          {newTemplate.variables.map((variable, idx) => (
                            <Badge key={idx} variant="primary" size="sm">
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="primary"
                      onClick={handleCreateTemplate}
                      loading={loading}
                      disabled={!newTemplate.title.trim() || !newTemplate.content.trim()}
                      className="flex-1"
                    >
                      Create Template
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TemplateGrid;