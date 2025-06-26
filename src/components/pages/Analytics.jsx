import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import conversationService from '@/services/api/conversationService';

const Analytics = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const data = await conversationService.getAll();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics metrics
  const getMetrics = () => {
    const total = conversations.length;
    const open = conversations.filter(c => c.status === 'open').length;
    const pending = conversations.filter(c => c.status === 'pending').length;
    const resolved = conversations.filter(c => c.status === 'resolved').length;
    const highPriority = conversations.filter(c => c.priority === 3).length;

    const platformStats = {
      whatsapp: conversations.filter(c => c.platform === 'whatsapp').length,
      facebook: conversations.filter(c => c.platform === 'facebook').length,
      instagram: conversations.filter(c => c.platform === 'instagram').length,
      twitter: conversations.filter(c => c.platform === 'twitter').length
    };

    const avgResponseTime = '2.3 hours'; // Mock data
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    const customerSatisfaction = 4.6; // Mock data

    return {
      total,
      open,
      pending,
      resolved,
      highPriority,
      platformStats,
      avgResponseTime,
      resolutionRate,
      customerSatisfaction
    };
  };

  const metrics = getMetrics();

  // Chart configurations
  const statusChartOptions = {
    chart: {
      type: 'donut',
      height: 350,
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#EF4444', '#F59E0B', '#10B981'],
    labels: ['Open', 'Pending', 'Resolved'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    legend: {
      position: 'bottom'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        }
      }
    }]
  };

  const statusChartSeries = [metrics.open, metrics.pending, metrics.resolved];

  const platformChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#25D366', '#1877F2', '#E4405F', '#1DA1F2'],
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['WhatsApp', 'Facebook', 'Instagram', 'Twitter']
    },
    legend: {
      show: false
    }
  };

  const platformChartSeries = [{
    name: 'Messages',
    data: [
      metrics.platformStats.whatsapp,
      metrics.platformStats.facebook,
      metrics.platformStats.instagram,
      metrics.platformStats.twitter
    ]
  }];

  const responseTimeChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#7C3AED'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yaxis: {
      title: {
        text: 'Hours'
      }
    },
    grid: {
      borderColor: '#E5E7EB'
    }
  };

  const responseTimeChartSeries = [{
    name: 'Response Time',
    data: [2.1, 1.8, 2.5, 2.0, 2.3, 1.9, 2.7] // Mock data
  }];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: { opacity: 0, y: -20 }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 }
  };

  const MetricCard = ({ title, value, change, changeType, icon, color = 'primary' }) => (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white rounded-lg shadow-card border border-surface-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-surface-600">{title}</p>
          <p className="text-2xl font-bold text-surface-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <ApperIcon 
                name={changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
              />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${color}-100`}>
          <ApperIcon name={icon} size={24} className={`text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full bg-surface-50"
    >
      <div className="h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-surface-900">Analytics Dashboard</h1>
              <p className="text-surface-600 mt-1">Track your customer service performance</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {['7d', '30d', '90d'].map((range) => (
                  <Button
                    key={range}
                    size="sm"
                    variant={timeRange === range ? 'primary' : 'secondary'}
                    onClick={() => setTimeRange(range)}
                  >
                    {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                  </Button>
                ))}
              </div>
              <Button icon="Download" variant="secondary">
                Export
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <MetricCard
              title="Total Conversations"
              value={metrics.total}
              change="+12%"
              changeType="positive"
              icon="MessageSquare"
              color="primary"
            />
            <MetricCard
              title="Avg Response Time"
              value={metrics.avgResponseTime}
              change="-15%"
              changeType="positive"
              icon="Clock"
              color="accent"
            />
            <MetricCard
              title="Resolution Rate"
              value={`${metrics.resolutionRate}%`}
              change="+5%"
              changeType="positive"
              icon="CheckCircle"
              color="green"
            />
            <MetricCard
              title="Customer Satisfaction"
              value={metrics.customerSatisfaction}
              change="+0.2"
              changeType="positive"
              icon="Star"
              color="yellow"
            />
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-card border border-surface-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-900">Status Distribution</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="danger" size="sm">Open: {metrics.open}</Badge>
                  <Badge variant="warning" size="sm">Pending: {metrics.pending}</Badge>
                  <Badge variant="success" size="sm">Resolved: {metrics.resolved}</Badge>
                </div>
              </div>
              <Chart
                options={statusChartOptions}
                series={statusChartSeries}
                type="donut"
                height={350}
              />
            </motion.div>

            {/* Platform Performance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-card border border-surface-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-900">Platform Messages</h3>
                <Badge variant="primary" size="sm">Total: {metrics.total}</Badge>
              </div>
              <Chart
                options={platformChartOptions}
                series={platformChartSeries}
                type="bar"
                height={350}
              />
            </motion.div>
          </div>

          {/* Response Time Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-card border border-surface-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-surface-900">Response Time Trend</h3>
                <p className="text-sm text-surface-600">Average response time over the last 7 days</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-surface-600">Response Time</span>
              </div>
            </div>
            <Chart
              options={responseTimeChartOptions}
              series={responseTimeChartSeries}
              type="line"
              height={350}
            />
          </motion.div>

          {/* Priority & Urgency Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-card border border-surface-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-surface-900">High Priority</h4>
                  <p className="text-sm text-surface-600">Urgent conversations</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">{metrics.highPriority}</div>
              <p className="text-sm text-surface-600">
                {metrics.total > 0 ? Math.round((metrics.highPriority / metrics.total) * 100) : 0}% of total conversations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-card border border-surface-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" size={20} className="text-accent-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-surface-900">AI Assistance</h4>
                  <p className="text-sm text-surface-600">Responses suggested</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-accent-600 mb-2">87%</div>
              <p className="text-sm text-surface-600">AI suggestion accuracy rate</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-lg shadow-card border border-surface-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-surface-900">Active Agents</h4>
                  <p className="text-sm text-surface-600">Currently online</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
              <p className="text-sm text-surface-600">Handling conversations</p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;