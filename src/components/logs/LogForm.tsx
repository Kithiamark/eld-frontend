/**
 * Log Form Component
 * Form for creating and editing log entries
 */

import React, { useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { CreateLogRequest, DutyStatus } from '@/types/log';
import { DUTY_STATUS_LABELS } from '@/utils/constants';

interface LogFormProps {
  initialData?: Partial<CreateLogRequest>;
  onSubmit: (data: CreateLogRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const LogForm: React.FC<LogFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateLogRequest>({
    driver_id: initialData?.driver_id || '',
    vehicle_id: initialData?.vehicle_id || '',
    duty_status: initialData?.duty_status || 'off_duty',
    start_time: initialData?.start_time || new Date().toISOString(),
    location: initialData?.location || {
      latitude: 0,
      longitude: 0,
      city: '',
      state: '',
    },
    odometer: initialData?.odometer || 0,
    engine_hours: initialData?.engine_hours,
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const dutyStatusOptions = Object.entries(DUTY_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.driver_id) {
      newErrors.driver_id = 'Driver is required';
    }

    if (!formData.vehicle_id) {
      newErrors.vehicle_id = 'Vehicle is required';
    }

    if (!formData.odometer || formData.odometer < 0) {
      newErrors.odometer = 'Valid odometer reading is required';
    }

    if (!formData.location.city) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'odometer' || name === 'engine_hours' ? parseFloat(value) : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Duty Status */}
      <Select
        label="Duty Status"
        name="duty_status"
        value={formData.duty_status}
        onChange={handleChange}
        options={dutyStatusOptions}
        required
      />

      {/* Date and Time */}
      <Input
        label="Date and Time"
        name="start_time"
        type="datetime-local"
        value={formData.start_time.slice(0, 16)}
        onChange={handleChange}
        required
      />

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="City"
          name="location.city"
          value={formData.location.city}
          onChange={handleChange}
          error={errors.location}
          placeholder="Los Angeles"
          required
        />
        <Input
          label="State"
          name="location.state"
          value={formData.location.state}
          onChange={handleChange}
          placeholder="CA"
          required
        />
      </div>

      {/* Odometer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Odometer (miles)"
          name="odometer"
          type="number"
          value={formData.odometer.toString()}
          onChange={handleChange}
          error={errors.odometer}
          min="0"
          step="0.1"
          required
        />
        <Input
          label="Engine Hours (optional)"
          name="engine_hours"
          type="number"
          value={formData.engine_hours?.toString() || ''}
          onChange={handleChange}
          min="0"
          step="0.1"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional notes about this log entry..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Log' : 'Create Log'}
        </Button>
      </div>
    </form>
  );
};

export default LogForm;