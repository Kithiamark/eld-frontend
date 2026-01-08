/**
 * Drivers Page
 * Driver management with list, search, and CRUD operations
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, UserX, UserCheck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { DriverStatusBadge } from '@/components/common/Badge';
import { useDrivers } from '@/hooks/useDrivers';
import { useDebounce } from '@/hooks/useDebounce';
import DriverForm from '@/components/drivers/DriverForm';
import { Driver } from '@/types/driver';
import { formatDate, formatPhone } from '@/utils/formatters';

const Drivers: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const {
    drivers,
    total,
    totalPages,
    isLoading,
    createDriver,
    suspendDriver,
    reinstateDriver,
    isCreating,
  } = useDrivers(page, 10, debouncedSearch, statusFilter);

  const handleCreateDriver = async (data: any) => {
    createDriver(data);
    setIsCreateModalOpen(false);
  };

  const handleSuspend = (driver: Driver) => {
    if (window.confirm(`Are you sure you want to suspend ${driver.name}?`)) {
      suspendDriver({
        id: driver.id,
        data: { reason: 'Manual suspension from admin panel' },
      });
    }
  };

  const handleReinstate = (driver: Driver) => {
    if (window.confirm(`Are you sure you want to reinstate ${driver.name}?`)) {
      reinstateDriver(driver.id);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Drivers</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your fleet drivers
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add Driver
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, license, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </Card>

        {/* Drivers Table */}
        <Card padding="none">
          {isLoading ? (
            <LoadingSpinner />
          ) : drivers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No drivers found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Driver
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        License
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Joined
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {drivers.map((driver) => (
                      <tr
                        key={driver.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                              {driver.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {driver.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {driver.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-900 dark:text-white font-mono">
                            {driver.license_number}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {driver.license_state}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {driver.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatPhone(driver.phone)}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <DriverStatusBadge status={driver.status} />
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(driver.created_at)}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/drivers/${driver.id}`)}
                              className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Edit driver"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {driver.status === 'suspended' ? (
                              <button
                                onClick={() => handleReinstate(driver)}
                                className="p-2 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Reinstate driver"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSuspend(driver)}
                                className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Suspend driver"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {drivers.length} of {total} drivers
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="px-3 py-1.5 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Create Driver Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Add New Driver"
          size="lg"
        >
          <DriverForm
            onSubmit={handleCreateDriver}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isCreating}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Drivers;