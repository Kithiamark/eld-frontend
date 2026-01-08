// src/components/drivers/DriverDetail.tsx
// ===============================================
import { Driver } from '@/types/driver';
import Card from '@/components/common/Card';
import { formatDate, formatPhone } from '@/utils/formatters';

export const DriverDetail: React.FC<{ driver: Driver }> = ({ driver }) => (
  <Card>
    <Card.Header>
      <h2 className="text-xl font-semibold">Driver Information</h2>
    </Card.Header>
    <Card.Body>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt className="text-sm text-gray-600 dark:text-gray-400">Name</dt>
          <dd className="text-base font-medium text-gray-900 dark:text-white">{driver.name}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600 dark:text-gray-400">Email</dt>
          <dd className="text-base font-medium text-gray-900 dark:text-white">{driver.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600 dark:text-gray-400">Phone</dt>
          <dd className="text-base font-medium text-gray-900 dark:text-white">{formatPhone(driver.phone)}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600 dark:text-gray-400">License</dt>
          <dd className="text-base font-medium text-gray-900 dark:text-white">{driver.license_number} ({driver.license_state})</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600 dark:text-gray-400">Status</dt>
          <dd className="text-base font-medium text-gray-900 dark:text-white capitalize">{driver.status}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600 dark:text-gray-400">Joined</dt>
          <dd className="text-base font-medium text-gray-900 dark:text-white">{formatDate(driver.created_at)}</dd>
        </div>
      </dl>
    </Card.Body>
  </Card>
);
