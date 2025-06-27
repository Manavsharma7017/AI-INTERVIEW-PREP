import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Users,
  BookOpen,
  MessageSquare,
  BarChart3,
  Shield,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { AdminDomains } from '../components/admin/AdminDomains';
import { AdminQuestions } from '../components/admin/AdminQuestions';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminUsers } from '../components/admin/AdminUsers';

export const AdminPage: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      path: '/app/admin',
      label: 'Dashboard',
      icon: BarChart3,
      exact: true,
    },
    {
      path: '/app/admin/domains',
      label: 'Domains',
      icon: BookOpen,
    },
    {
      path: '/app/admin/questions',
      label: 'Questions',
      icon: MessageSquare,
    },
    {
      path: '/app/admin/users',
      label: 'Users',
      icon: Users,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="p-2 bg-white/20 rounded-lg">
            <Shield className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
            <p className="text-sm sm:text-lg text-blue-100">
              Manage your interview platform and help candidates succeed
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? currentPath === item.path
              : currentPath.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Routed Admin Content */}
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="domains" element={<AdminDomains />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="users" element={<AdminUsers />} />
      </Routes>
    </div>
  );
};
