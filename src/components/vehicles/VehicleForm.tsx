/**
 * Vehicle Form Component
 * Form for creating and editing vehicles
 */

import React, { useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { CreateVehicleRequest } from '@/types/vehicle';
import { US_STATES } from '@/types/common';
import { isValidVIN, isValidLicensePlate } from '@/utils/validators';

interface VehicleFormProps {
  initialData?: Partial<CreateVehicleRequest>;
  onSubmit: (data: CreateVehicleRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateVehicleRequest>({
    vehicle_number: initialData?.vehicle_number || '',
    vin: initialData?.vin || '',
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    license_plate: initialData?.license_plate || '',
    license_plate_state: initialData?.license_plate_state || '',
    fuel_type: initialData?.fuel_type || 'diesel',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehicle_number.trim()) {
      newErrors.vehicle_number = 'Vehicle number is required';
    }

    if (!formData.vin.trim()) {
      newErrors.vin = 'VIN is required';
    } else if (!isValidVIN(formData.vin)) {
      newErrors.vin = 'Invalid VIN format (must be 17 characters)';
    }

    if (!formData.make.trim()) {
      newErrors.make = 'Make is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Invalid year';
    }

    if (!formData.license_plate.trim()) {
      newErrors.license_plate = 'License plate is required';
    } else if (!isValidLicensePlate(formData.license_plate)) {
      newErrors.license_plate = 'Invalid license plate format';
    }

    if (!formData.license_plate_state) {
      newErrors.license_plate_state = 'License plate state is required';
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
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Vehicle Number */}
      <Input
        label="Vehicle Number"
        name="vehicle_number"
        value={formData.vehicle_number}
        onChange={handleChange}
        error={errors.vehicle_number}
        placeholder="TRK-001"
        helperText="Internal identifier for this vehicle"
        required
      />

      {/* VIN */}
      <Input
        label="VIN (Vehicle Identification Number)"
        name="vin"
        value={formData.vin}
        onChange={handleChange}
        error={errors.vin}
        placeholder="1HGBH41JXMN109186"
        helperText="17-character VIN"
        required
      />

      {/* Make, Model, Year */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Make"
          name="make"
          value={formData.make}
          onChange={handleChange}
          error={errors.make}
          placeholder="Freightliner"
          required
        />

        <Input
          label="Model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          error={errors.model}
          placeholder="Cascadia"
          required
        />

        <Input
          label="Year"
          name="year"
          type="number"
          value={formData.year.toString()}
          onChange={handleChange}
          error={errors.year}
          min="1900"
          max={new Date().getFullYear() + 1}
          required
        />
      </div>

      {/* License Plate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="License Plate"
          name="license_plate"
          value={formData.license_plate}
          onChange={handleChange}
          error={errors.license_plate}
          placeholder="ABC1234"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            License Plate State <span className="text-red-500">*</span>
          </label>
          <select
            name="license_plate_state"
            value={formData.license_plate_state}
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
          {errors.license_plate_state && (
            <p className="mt-1 text-sm text-red-600">{errors.license_plate_state}</p>
          )}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Fuel Type
        </label>
        <select
          name="fuel_type"
          value={formData.fuel_type}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="diesel">Diesel</option>
          <option value="gasoline">Gasoline</option>
          <option value="electric">Electric</option>
          <option value="hybrid">Hybrid</option>
          <option value="cng">CNG (Compressed Natural Gas)</option>
        </select>
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
          placeholder="Additional vehicle information..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Vehicle' : 'Create Vehicle'}
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;