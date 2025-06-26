import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('platforms');
  const [platforms, setPlatforms] = useState({
    whatsapp: { connected: true, token: '***...***', lastSync: '2 hours ago' },
    facebook: { connected: true, token: '***...***', lastSync: '1 hour ago' },
    instagram: { connected: false, token: '', lastSync: 'Never' },
    twitter: { connected: true, token: '***...***', lastSync: '30 minutes ago' }
  });
  
  const [notifications, setNotifications] = useState({
    newMessage: true,
    highPriority: true,
    mentions: true,
    dailyReport: false,
    weeklyReport: true
  });

  const [aiSettings, setAiSettings] = useState({
    enabled: true,
    confidence: 85,
    autoSuggest: true,
    learnFromResponses: true,
    language: 'en'
  });

  const [teamSettings, setTeamSettings] = useState({
    autoAssign: true,
    workingHours: '9:00-17:00',
    timezone: 'UTC-8',
    maxConversations: 10
  });

  const tabs = [
    { id: 'platforms', label: 'Platform Connections', icon: 'Link' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'ai', label: 'AI Assistant', icon: 'Bot' },
    { id: 'team', label: 'Team Settings', icon: 'Users' }
  ];

  const handlePlatformConnect = (platform) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        connected: !prev[platform].connected,
        lastSync: prev[platform].connected ? 'Never' : 'Just now'
      }
    }));
    
    const action = platforms[platform].connected ? 'disconnected' : 'connected';
    toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} ${action} successfully`);
  };

  const handleSaveSettings = (section) => {
    toast.success(`${section} settings saved successfully`);
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

  const tabContentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const PlatformCard = ({ platform, config, onToggle }) => {
    const platformInfo = {
      whatsapp: { name: 'WhatsApp', color: 'whatsapp', icon: 'MessageCircle' },
      facebook: { name: 'Facebook', color: 'facebook', icon: 'Facebook' },
      instagram: { name: 'Instagram', color: 'instagram', icon: 'Instagram' },
      twitter: { name: 'Twitter', color: 'twitter', icon: 'Twitter' }
    };

    const info = platformInfo[platform];

    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className="bg-white rounded-lg shadow-card border border-surface-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-${info.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
              <ApperIcon name={info.icon} size={20} className={`text-${info.color}`} />
            </div>
            <div>
              <h4 className="font-semibold text-surface-900">{info.name}</h4>
              <p className="text-sm text-surface-600">Last sync: {config.lastSync}</p>
            </div>
          </div>
          
          <Badge variant={config.connected ? 'success' : 'default'} size="sm">
            {config.connected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>

        {config.connected && (
          <div className="mb-4">
            <div className="bg-surface-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">API Token</span>
                <span className="text-sm font-mono text-surface-900">{config.token}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={config.connected ? 'danger' : 'primary'}
            onClick={() => onToggle(platform)}
            className="flex-1"
          >
            {config.connected ? 'Disconnect' : 'Connect'}
          </Button>
          
          {config.connected && (
            <Button size="sm" variant="secondary" icon="Settings">
              Configure
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'platforms':
        return (
          <motion.div
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Platform Connections</h3>
              <p className="text-surface-600 mb-6">
                Connect your social media and messaging platforms to receive messages in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(platforms).map(([platform, config]) => (
                <PlatformCard
                  key={platform}
                  platform={platform}
                  config={config}
                  onToggle={handlePlatformConnect}
                />
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Integration Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• WhatsApp Business API requires verification</li>
                    <li>• Facebook requires page admin permissions</li>
                    <li>• Instagram works through Facebook connection</li>
                    <li>• Twitter requires Developer Account</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Notification Preferences</h3>
              <p className="text-surface-600 mb-6">
                Customize when and how you receive notifications.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-card border border-surface-200 p-6">
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, enabled]) => {
                  const labels = {
                    newMessage: 'New Message Notifications',
                    highPriority: 'High Priority Alerts',
                    mentions: 'Mention Notifications',
                    dailyReport: 'Daily Summary Report',
                    weeklyReport: 'Weekly Analytics Report'
                  };

                  return (
                    <div key={key} className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="font-medium text-surface-900">{labels[key]}</h4>
                        <p className="text-sm text-surface-600">
                          {key === 'newMessage' && 'Get notified when new messages arrive'}
                          {key === 'highPriority' && 'Immediate alerts for urgent conversations'}
                          {key === 'mentions' && 'When your team mentions you in conversations'}
                          {key === 'dailyReport' && 'Daily performance summary via email'}
                          {key === 'weeklyReport' && 'Weekly analytics and insights'}
                        </p>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setNotifications(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-surface-200">
                <Button
                  variant="primary"
                  onClick={() => handleSaveSettings('Notification')}
                >
                  Save Notification Settings
                </Button>
              </div>
            </div>
          </motion.div>
        );

      case 'ai':
        return (
          <motion.div
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">AI Assistant Settings</h3>
              <p className="text-surface-600 mb-6">
                Configure how the AI assistant helps with your customer conversations.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-card border border-surface-200 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-surface-900">Enable AI Assistant</h4>
                  <p className="text-sm text-surface-600">Turn on AI-powered response suggestions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiSettings.enabled}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Confidence Threshold: {aiSettings.confidence}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={aiSettings.confidence}
                  onChange={(e) => setAiSettings(prev => ({ ...prev, confidence: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-surface-500 mt-1">
                  <span>Less Accurate</span>
                  <span>More Accurate</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Response Language
                </label>
                <select
                  value={aiSettings.language}
                  onChange={(e) => setAiSettings(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-surface-900">Auto-suggest Responses</h4>
                    <p className="text-sm text-surface-600">Automatically show suggestions for new messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiSettings.autoSuggest}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, autoSuggest: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-surface-900">Learn from Responses</h4>
                    <p className="text-sm text-surface-600">Improve suggestions based on your sent messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiSettings.learnFromResponses}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, learnFromResponses: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-200">
                <Button
                  variant="primary"
                  onClick={() => handleSaveSettings('AI')}
                >
                  Save AI Settings
                </Button>
              </div>
            </div>
          </motion.div>
        );

      case 'team':
        return (
          <motion.div
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Team Settings</h3>
              <p className="text-surface-600 mb-6">
                Configure team collaboration and workload distribution.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-card border border-surface-200 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-surface-900">Auto-assign Conversations</h4>
                  <p className="text-sm text-surface-600">Automatically distribute new conversations to available agents</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={teamSettings.autoAssign}
                    onChange={(e) => setTeamSettings(prev => ({ ...prev, autoAssign: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Working Hours"
                    type="text"
                    value={teamSettings.workingHours}
                    onChange={(e) => setTeamSettings(prev => ({ ...prev, workingHours: e.target.value }))}
                    placeholder="9:00-17:00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={teamSettings.timezone}
                    onChange={(e) => setTeamSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">GMT (UTC+0)</option>
                    <option value="UTC+1">Central European Time (UTC+1)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Max Conversations per Agent: {teamSettings.maxConversations}
                </label>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={teamSettings.maxConversations}
                  onChange={(e) => setTeamSettings(prev => ({ ...prev, maxConversations: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-surface-500 mt-1">
                  <span>5</span>
                  <span>25</span>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-200">
                <Button
                  variant="primary"
                  onClick={() => handleSaveSettings('Team')}
                >
                  Save Team Settings
                </Button>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
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
        {/* Settings Sidebar */}
        <div className="w-64 bg-white border-r border-surface-200 flex-shrink-0">
          <div className="p-6">
            <h2 className="text-xl font-bold text-surface-900 mb-6">Settings</h2>
            
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                    }
                  `}
                >
                  <ApperIcon name={tab.icon} size={18} />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;