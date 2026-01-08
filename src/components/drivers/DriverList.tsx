/**
 * Driver List Component
 * Displays drivers in a table format with actions
 */

import React from 'react';
import { Eye, Edit, UserX, UserCheck } from 'lucide-react';
import { Driver } from '@/types/driver';
import { DriverStatusBadge } from '@/components/common/Badge';
import { formatDate, formatPhone } from '@/utils/formatters';

interface DriverListProps {
  drivers: Driver[];
  onView: (driver: Driver) => void;
  onEdit: (driver: Driver) => void;
  onSuspend: (driver: Driver) => void;
  onReinstate: (driver: Driver) => void;
  isLoading?: boolean;
}

const DriverList: React.FC<DriverListProps> = ({
  drivers,
  onView,
  onEdit,
  onSuspend,
  onReinstate,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No drivers found</p>
      </div>
    );
  }

  return (
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
            <tr key={driver.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {driver.name.charAt(0).toUpperCase()}
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
                    onClick={() => onView(driver)}
                    className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(driver)}
                    className="p-2 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit driver"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {driver.status === 'suspended' ? (
                    <button
                      onClick={() => onReinstate(driver)}
                      className="p-2 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Reinstate driver"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onSuspend(driver)}
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
  );
};

export default DriverList;