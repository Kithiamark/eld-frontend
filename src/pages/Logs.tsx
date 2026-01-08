/**
 * Logs Page
 * Driver log viewing and management with HOS compliance
 */

import React, { useState } from 'react';
import { Download, Filter, Plus, Calendar } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { HOSClockGroup } from '@/components/logs/HOSClock';
import Badge from '@/components/common/Badge';
import { useQuery } from '@tanstack/react-query';
import { logService } from '@/services/logService';
import { driverService } from '@/services/driverService';
import { DUTY_STATUS_LABELS, DUTY_STATUS_COLORS } from '@/utils/constants';
import { formatDate, formatTime, formatHours } from '@/utils/formatters';
import { LogEntry } from '@/types/log';

const Logs: React.FC = () => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  // Fetch drivers for selection
  const { data: driversData } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => driverService.getAll(1, 100),
  });

  // Fetch logs for selected driver
  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['logs', selectedDriverId, dateRange],
    queryFn: () => logService.getByDriver(selectedDriverId, dateRange.start, dateRange.end),
    enabled: !!selectedDriverId,
  });

  // Fetch compliance data
  const { data: complianceData, isLoading: complianceLoading } = useQuery({
    queryKey: ['compliance', selectedDriverId],
    queryFn: () => logService.getCompliance(selectedDriverId),
    enabled: !!selectedDriverId,
  });

  const drivers = driversData?.drivers || [];
  const logs = logsData?.logs || [];
  const compliance = complianceData;

  // Mock HOS data if not available
  const hosData = compliance?.hours_summary || {
    drive_remaining: 6.5,
    shift_remaining: 10.2,
    cycle_remaining: 45.5,
    break_required_in: 180,
  };

  const handleExportLogs = async () => {
    if (!selectedDriverId) return;
    try {
      const blob = await logService.exportCSV(
        selectedDriverId,
        dateRange.start,
        dateRange.end
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_${selectedDriverId}_${dateRange.start}_${dateRange.end}.csv`;
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Driver Logs</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and manage hours of service
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              leftIcon={<Download className="w-5 h-5" />}
              onClick={handleExportLogs}
              disabled={!selectedDriverId}
            >
              Export
            </Button>
            <Button leftIcon={<Plus className="w-5 h-5" />}>
              Add Log Entry
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Driver
              </label>
              <select
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a driver...</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
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

            <div>
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

        {selectedDriverId ? (
          <>
            {/* HOS Clocks */}
            {complianceLoading ? (
              <LoadingSpinner message="Loading compliance data..." />
            ) : (
              <Card>
                <Card.Header>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Hours of Service Status
                  </h2>
                </Card.Header>
                <Card.Body>
                  <HOSClockGroup
                    driveRemaining={hosData.drive_remaining}
                    shiftRemaining={hosData.shift_remaining}
                    cycleRemaining={hosData.cycle_remaining}
                  />

                  {/* Break Required Notice */}
                  {hosData.break_required_in !== undefined && hosData.break_required_in <= 60 && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          30-minute break required in {hosData.break_required_in} minutes
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Violations */}
                  {compliance?.violations && compliance.violations.length > 0 && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                        Active Violations ({compliance.violations.length})
                      </h3>
                      <ul className="space-y-1">
                        {compliance.violations.map((violation, index) => (
                          <li key={index} className="text-sm text-red-700 dark:text-red-300">
                            • {violation.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Log Entries */}
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Log Timeline
                </h2>
              </Card.Header>
              <Card.Body>
                {logsLoading ? (
                  <LoadingSpinner />
                ) : logs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No log entries found for this period
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {logs.map((log, index) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {/* Timeline Connector */}
                        <div className="flex flex-col items-center">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"
                            style={{
                              backgroundColor: DUTY_STATUS_COLORS[log.duty_status],
                            }}
                          />
                          {index < logs.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2" />
                          )}
                        </div>

                        {/* Log Details */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Badge
                                variant={
                                  log.duty_status === 'driving'
                                    ? 'success'
                                    : log.duty_status === 'off_duty'
                                    ? 'default'
                                    : 'info'
                                }
                              >
                                {DUTY_STATUS_LABELS[log.duty_status]}
                              </Badge>
                              {log.edited && (
                                <Badge variant="warning" size="sm">
                                  Edited
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formatTime(log.start_time)}
                              {log.end_time && ` - ${formatTime(log.end_time)}`}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Location:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {log.location.city}, {log.location.state}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Odometer:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {log.odometer.toLocaleString()} mi
                              </p>
                            </div>
                          </div>

                          {log.duration_minutes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              Duration: {formatHours(log.duration_minutes / 60)}
                            </p>
                          )}

                          {log.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                              {log.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </>
        ) : (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Select a driver to view their logs
              </p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Logs;