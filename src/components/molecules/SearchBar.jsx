import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  onSearch, 
  onClear,
  placeholder = 'Search conversations...',
  showFilters = false,
  filters = {},
  onFilterChange,
  className = '' 
}) => {
  const [query, setQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleClear = () => {
    setQuery('');
    onClear?.();
  };

  const filterOptions = {
    platform: [
      { value: 'whatsapp', label: 'WhatsApp', color: 'whatsapp' },
      { value: 'facebook', label: 'Facebook', color: 'facebook' },
      { value: 'instagram', label: 'Instagram', color: 'instagram' },
      { value: 'twitter', label: 'Twitter', color: 'twitter' }
    ],
    status: [
      { value: 'open', label: 'Open', color: 'danger' },
      { value: 'pending', label: 'Pending', color: 'warning' },
      { value: 'resolved', label: 'Resolved', color: 'success' }
    ],
    priority: [
      { value: '3', label: 'High Priority', color: 'danger' },
      { value: '2', label: 'Medium Priority', color: 'warning' },
      { value: '1', label: 'Low Priority', color: 'success' }
    ]
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon="Search"
            iconPosition="left"
          />
        </div>
        
        <Button type="submit" variant="primary" icon="Search">
          Search
        </Button>
        
        {query && (
          <Button type="button" variant="ghost" icon="X" onClick={handleClear}>
            Clear
          </Button>
        )}
        
        {showFilters && (
          <Button
            type="button"
            variant="secondary"
            icon="Filter"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={showFilterPanel ? 'bg-primary-100 text-primary-700' : ''}
          >
            Filters
          </Button>
        )}
      </form>

      {showFilters && showFilterPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-surface-50 rounded-lg p-4 border border-surface-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(filterOptions).map(([filterKey, options]) => (
              <div key={filterKey}>
                <label className="block text-sm font-medium text-surface-700 mb-2 capitalize">
                  {filterKey}
                </label>
                <div className="space-y-2">
                  {options.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters[filterKey]?.includes(option.value) || false}
                        onChange={(e) => {
                          const currentValues = filters[filterKey] || [];
                          const newValues = e.target.checked
                            ? [...currentValues, option.value]
                            : currentValues.filter(v => v !== option.value);
                          onFilterChange?.({ ...filters, [filterKey]: newValues });
                        }}
                        className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-surface-600">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;