import Inbox from '@/components/pages/Inbox';
import Templates from '@/components/pages/Templates';
import Analytics from '@/components/pages/Analytics';
import Settings from '@/components/pages/Settings';

export const routes = {
  inbox: {
    id: 'inbox',
    label: 'Inbox',
    path: '/',
    icon: 'MessageSquare',
    component: Inbox
  },
  templates: {
    id: 'templates',
    label: 'Templates',
    path: '/templates',
    icon: 'FileText',
    component: Templates
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: 'BarChart3',
    component: Analytics
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;