/**
 * Driver Stats Component
 * Display driver statistics and performance metrics
 */

import React from 'react';
import { Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '@/components/common/Card';
import { DriverStats as DriverStatsType } from '@/types/driver';
import { formatHours } from '@/utils/formatters';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DriverStatsProps {
  stats: DriverStatsType;
  isLoading?: boolean;
}

const DriverStats: React.FC<DriverStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-32 animate-pulse bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    );
  }

  const chartData = stats.last_7_days.map((day) => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    driving: day.driving_hours,
    onDuty: day.on_duty_hours,
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Driving Hours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatHours(stats.total_driving_hours)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">On-Duty Hours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatHours(stats.total_on_duty_hours)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Violations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.total_violations}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Compliance Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.compliance_rate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </Card>
      </div>

      {/* HOS Status */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current HOS Status
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Drive Time Remaining</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.current_hos.drive_remaining.toFixed(1)}h
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">of 11 hours</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Shift Time Remaining</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.current_hos.shift_remaining.toFixed(1)}h
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">of 14 hours</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cycle Remaining</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.current_hos.cycle_remaining.toFixed(1)}h
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">of 70 hours</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Weekly Trend */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Last 7 Days Activity
          </h3>
        </Card.Header>
        <Card.Body>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="driving"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Driving"
              />
              <Line
                type="monotone"
                dataKey="onDuty"
                stroke="#10B981"
                strokeWidth={2}
                name="On-Duty"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DriverStats;