/**
 * Driver Form Component
 * Form for creating and editing drivers
 */

import React, { useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { CreateDriverRequest } from '@/types/driver';
import { US_STATES } from '@/types/common';
import { isValidEmail, isValidPhone, isValidLicenseNumber } from '@/utils/validators';

interface DriverFormProps {
  initialData?: Partial<CreateDriverRequest>;
  onSubmit: (data: CreateDriverRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DriverForm: React.FC<DriverFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateDriverRequest>({
    name: initialData?.name || '',
    license_number: initialData?.license_number || '',
    license_state: initialData?.license_state || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    date_of_birth: initialData?.date_of_birth || '',
    hire_date: initialData?.hire_date || '',
    home_terminal: initialData?.home_terminal || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.license_number.trim()) {
      newErrors.license_number = 'License number is required';
    } else if (!isValidLicenseNumber(formData.license_number)) {
      newErrors.license_number = 'Invalid license number format';
    }

    if (!formData.license_state) {
      newErrors.license_state = 'License state is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="John Doe"
        required
      />

      {/* License Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="License Number"
          name="license_number"
          value={formData.license_number}
          onChange={handleChange}
          error={errors.license_number}
          placeholder="DL123456"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            License State <span className="text-red-500">*</span>
          </label>
          <select
            name="license_state"
            value={formData.license_state}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select State</option>
            {US_STATES.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
          {errors.license_state && (
            <p className="mt-1 text-sm text-red-600">{errors.license_state}</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="john.doe@example.com"
          required
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="(555) 123-4567"
          required
        />
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date of Birth"
          name="date_of_birth"
          type="date"
          value={formData.date_of_birth}
          onChange={handleChange}
        />

        <Input
          label="Hire Date"
          name="hire_date"
          type="date"
          value={formData.hire_date}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Home Terminal"
        name="home_terminal"
        value={formData.home_terminal}
        onChange={handleChange}
        placeholder="Los Angeles, CA"
      />

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
          placeholder="Additional information..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Driver' : 'Create Driver'}
        </Button>
      </div>
    </form>
  );
};

export default DriverForm;