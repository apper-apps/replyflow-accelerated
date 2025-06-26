import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="h-full flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="MessageSquare" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-surface-900">ReplyFlow</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-surface-600">
              <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
              Live Updates
            </div>
            <div className="w-8 h-8 bg-surface-100 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={18} className="text-surface-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-surface-50 border-r border-surface-200 flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={18} />
                {route.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-surface-200">
            <div className="flex items-center gap-3 text-sm text-surface-500">
              <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Zap" size={12} className="text-accent-600" />
              </div>
              AI Assistant Active
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={overlayVariants}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariants}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50 lg:hidden flex flex-col"
              >
                <div className="h-16 flex items-center justify-between px-4 border-b border-surface-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                      <ApperIcon name="MessageSquare" size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-surface-900">ReplyFlow</h1>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-50 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                  {routeArray.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                          isActive
                            ? 'bg-primary-100 text-primary-700 shadow-sm'
                            : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} size={18} />
                      {route.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="p-4 border-t border-surface-200">
                  <div className="flex items-center gap-3 text-sm text-surface-500">
                    <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="Zap" size={12} className="text-accent-600" />
                    </div>
                    AI Assistant Active
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;