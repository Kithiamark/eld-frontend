/**
 * Inspections Page
 * DVIR management and tracking
 */

import React, { useState } from 'react';
import { Plus, Download, Filter, FileText } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import { useInspections, useInspectionSummary } from '@/hooks/useInspections';
import { formatDate } from '@/utils/formatters';

const Inspections: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  const { inspections, isLoading } = useInspections(filters);
  const { data: summary } = useInspectionSummary(
    undefined,
    undefined,
    filters.start_date,
    filters.end_date
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'passed':
        return 'success';
      case 'failed':
        return 'danger';
      case 'defects_noted':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Vehicle Inspections
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              DVIR reports and vehicle safety checks
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" leftIcon={<Download className="w-5 h-5" />}>
              Export
            </Button>
            <Button
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              New Inspection
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card padding="sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summary.total_inspections}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              </div>
            </Card>
            <Card padding="sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{summary.passed}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Passed</p>
              </div>
            </Card>
            <Card padding="sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{summary.failed}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
              </div>
            </Card>
            <Card padding="sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{summary.defects_noted}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Defects</p>
              </div>
            </Card>
            <Card padding="sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {summary.compliance_rate}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Compliance</p>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Status</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="defects_noted">Defects Noted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </Card>

        {/* Inspections List */}
        <Card padding="none">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : inspections.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No inspections found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Vehicle
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Driver
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Defects
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {inspections.map((inspection) => (
                    <tr key={inspection.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {formatDate(inspection.inspection_date)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {inspection.inspection_type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        Vehicle #{inspection.vehicle_id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        Driver #{inspection.driver_id}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusVariant(inspection.status)}>
                          {inspection.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {inspection.defects?.length || 0}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="secondary" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Create Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="New Inspection"
          size="lg"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Inspection form will be implemented here
          </p>
        </Modal>
      </div>
    </Layout>
  );
};

export default Inspections;