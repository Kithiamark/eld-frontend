/**
 * Dashboard Page
 * Main overview page with statistics and recent activity
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Truck, AlertTriangle, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Badge from '@/components/common/Badge';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  total_drivers: number;
  active_drivers: number;
  total_vehicles: number;
  active_vehicles: number;
  violations_count: number;
  compliance_rate: number;
  pending_inspections: number;
}

const Dashboard: React.FC = () => {
  // Mock data - replace with actual API call
  const stats: DashboardStats = {
    total_drivers: 45,
    active_drivers: 38,
    total_vehicles: 52,
    active_vehicles: 47,
    violations_count: 3,
    compliance_rate: 94.5,
    pending_inspections: 5,
  };

  const weeklyHours = [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 9.2 },
    { day: 'Wed', hours: 7.8 },
    { day: 'Thu', hours: 10.1 },
    { day: 'Fri', hours: 8.9 },
    { day: 'Sat', hours: 6.5 },
    { day: 'Sun', hours: 5.2 },
  ];

  const statusDistribution = [
    { name: 'Active', value: 38, color: '#10B981' },
    { name: 'Off Duty', value: 5, color: '#6B7280' },
    { name: 'Inactive', value: 2, color: '#EF4444' },
  ];

  const recentActivity = [
    { id: 1, driver: 'John Doe', action: 'Started driving', time: '2 minutes ago', type: 'driving' },
    { id: 2, driver: 'Jane Smith', action: 'Completed inspection', time: '15 minutes ago', type: 'inspection' },
    { id: 3, driver: 'Mike Johnson', action: 'Went off duty', time: '1 hour ago', type: 'off_duty' },
    { id: 4, driver: 'Sarah Williams', action: 'Vehicle maintenance', time: '2 hours ago', type: 'maintenance' },
  ];

  const statCards = [
    {
      title: 'Total Drivers',
      value: stats.total_drivers,
      subtitle: `${stats.active_drivers} active`,
      icon: Users,
      color: 'blue',
      trend: '+5%',
    },
    {
      title: 'Total Vehicles',
      value: stats.total_vehicles,
      subtitle: `${stats.active_vehicles} active`,
      icon: Truck,
      color: 'green',
      trend: '+2%',
    },
    {
      title: 'Violations',
      value: stats.violations_count,
      subtitle: 'Needs attention',
      icon: AlertTriangle,
      color: 'red',
      trend: '-3%',
    },
    {
      title: 'Compliance Rate',
      value: `${stats.compliance_rate}%`,
      subtitle: 'Above target',
      icon: CheckCircle,
      color: 'green',
      trend: '+1.2%',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Overview of your fleet operations
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
              green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
              red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
            };

            return (
              <Card key={index} hover>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">{stat.trend}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">vs last week</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Hours Chart */}
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Driving Hours This Week
              </h2>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="hours" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>

          {/* Driver Status Distribution */}
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Driver Status Distribution
              </h2>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <Card.Header>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {activity.driver}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.action}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 text-left bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                  <p className="font-medium text-blue-900 dark:text-blue-100">Add Driver</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Create new driver profile</p>
                </button>

                <button className="w-full px-4 py-3 text-left bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                  <p className="font-medium text-green-900 dark:text-green-100">Add Vehicle</p>
                  <p className="text-sm text-green-600 dark:text-green-300">Register new vehicle</p>
                </button>

                <button className="w-full px-4 py-3 text-left bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                  <p className="font-medium text-purple-900 dark:text-purple-100">View Reports</p>
                  <p className="text-sm text-purple-600 dark:text-purple-300">Generate compliance reports</p>
                </button>

                <button className="w-full px-4 py-3 text-left bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors">
                  <p className="font-medium text-orange-900 dark:text-orange-100">Inspections</p>
                  <p className="text-sm text-orange-600 dark:text-orange-300">{stats.pending_inspections} pending</p>
                </button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;