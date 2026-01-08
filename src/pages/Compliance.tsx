/**
 * Compliance Page
 * Fleet-wide compliance monitoring and reports
 */

import React, { useState } from 'react';
import { Download, AlertTriangle, CheckCircle, FileText, TrendingUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDate } from '@/utils/formatters';

const Compliance: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  // Mock compliance data
  const complianceRate = 94.5;
  const totalViolations = 12;
  const criticalViolations = 2;
  const resolvedViolations = 8;

  const complianceTrend = [
    { week: 'Week 1', compliant: 95, violations: 5 },
    { week: 'Week 2', compliant: 92, violations: 8 },
    { week: 'Week 3', compliant: 97, violations: 3 },
    { week: 'Week 4', compliant: 94, violations: 6 },
  ];

  const violationTypes = [
    { name: 'Drive Time', value: 5, color: '#EF4444' },
    { name: 'Shift Time', value: 3, color: '#F59E0B' },
    { name: 'Break Required', value: 2, color: '#3B82F6' },
    { name: 'Form & Manner', value: 2, color: '#8B5CF6' },
  ];

  const recentViolations = [
    {
      id: '1',
      driver: 'John Doe',
      type: 'Drive Time Exceeded',
      date: '2024-01-15',
      severity: 'critical',
      status: 'open',
    },
    {
      id: '2',
      driver: 'Jane Smith',
      type: '30-min Break Required',
      date: '2024-01-14',
      severity: 'major',
      status: 'resolved',
    },
    {
      id: '3',
      driver: 'Mike Johnson',
      type: 'Missing Log Entry',
      date: '2024-01-13',
      severity: 'minor',
      status: 'open',
    },
  ];

  const driverCompliance = [
    { name: 'John Doe', rate: 98, violations: 1 },
    { name: 'Jane Smith', rate: 96, violations: 2 },
    { name: 'Mike Johnson', rate: 92, violations: 4 },
    { name: 'Sarah Williams', rate: 99, violations: 0 },
    { name: 'Tom Brown', rate: 88, violations: 6 },
  ];

  const handleExportReport = () => {
    // Implement export logic
    console.log('Exporting compliance report...');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Compliance Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor fleet-wide HOS compliance
            </p>
          </div>
          <Button
            leftIcon={<Download className="w-5 h-5" />}
            onClick={handleExportReport}
          >
            Export Report
          </Button>
        </div>

        {/* Date Range Filter */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Compliance Rate</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{complianceRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600">+2.5%</span>
              <span className="text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Violations</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{totalViolations}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-300" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {criticalViolations} critical, {totalViolations - criticalViolations} minor
            </p>
          </Card>

          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{resolvedViolations}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {Math.round((resolvedViolations / totalViolations) * 100)}% resolution rate
            </p>
          </Card>

          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Open Cases</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {totalViolations - resolvedViolations}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Requires attention
            </p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance Trend */}
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Compliance Trend
              </h2>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={complianceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="week" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="compliant"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Compliant %"
                  />
                  <Line
                    type="monotone"
                    dataKey="violations"
                    stroke="#EF4444"
                    strokeWidth={2}
                    name="Violations"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>

          {/* Violation Types */}
          <Card>
            <Card.Header>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Violation Types
              </h2>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={violationTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {violationTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </div>

        {/* Driver Compliance Table */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Driver Compliance Rates
            </h2>
          </Card.Header>
          <Card.Body padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Driver
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Compliance Rate
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Violations
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {driverCompliance.map((driver, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {driver.name}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[150px]">
                            <div
                              className={`h-2 rounded-full ${
                                driver.rate >= 95
                                  ? 'bg-green-500'
                                  : driver.rate >= 90
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${driver.rate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {driver.rate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {driver.violations}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            driver.rate >= 95
                              ? 'success'
                              : driver.rate >= 90
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {driver.rate >= 95 ? 'Excellent' : driver.rate >= 90 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>

        {/* Recent Violations */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Violations
            </h2>
          </Card.Header>
          <Card.Body padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Driver
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Violation Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Severity
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentViolations.map((violation) => (
                    <tr key={violation.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {violation.driver}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {violation.type}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(violation.date)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            violation.severity === 'critical'
                              ? 'danger'
                              : violation.severity === 'major'
                              ? 'warning'
                              : 'info'
                          }
                        >
                          {violation.severity}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={violation.status === 'resolved' ? 'success' : 'warning'}
                        >
                          {violation.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Layout>
  );
};

export default Compliance;