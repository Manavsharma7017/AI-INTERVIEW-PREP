import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  MessageSquare,
  BarChart3,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { adminService } from '../../services/admin';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDomains: 0,
    totalQuestions: 0,
    totalSessions: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const fetchedStats = await adminService.getAdminStats();
    console.log('Fetched Stats:', fetchedStats);
    setStats({
      totalUsers: fetchedStats.totalUsers || 0,
      totalDomains: fetchedStats.totalDomains || 0,
      totalQuestions: fetchedStats.totalQuestions || 0,
      totalSessions: fetchedStats.totalSessions || 0,
    });
  };

  return (
    <div className="space-y-8 px-4 md:px-6 lg:px-8 py-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-green-600 mt-1">↗ +12% this month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Domains</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDomains}</p>
              <p className="text-sm text-blue-600 mt-1">All operational</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
              <p className="text-sm text-purple-600 mt-1">Across all domains</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
              <p className="text-sm text-teal-600 mt-1">All time</p>
            </div>
            <div className="p-3 bg-teal-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Status</span>
              <Badge variant="success">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <Badge variant="success">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">AI Service</span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Response Time</span>
              <Badge variant="info">145ms</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-semibold text-green-600">94.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">User Satisfaction</span>
              <span className="font-semibold text-blue-600">4.7/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold text-purple-600">87.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Avg. Session Time</span>
              <span className="font-semibold text-teal-600">24 min</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};