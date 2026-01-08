/**
 * Vehicles Page
 * Vehicle fleet management
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Grid, List, Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicleService';
import { useToast } from '@/hooks/useToast';
import { Vehicle } from '@/types/vehicle';

const Vehicles: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch vehicles
  const { data: vehiclesData, isLoading } = useQuery({
    queryKey: ['vehicles', statusFilter],
    queryFn: () => vehicleService.getAll(statusFilter),
  });

  // Create vehicle mutation
  const createMutation = useMutation({
    mutationFn: vehicleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      addToast('Vehicle created successfully', 'success');
      setIsCreateModalOpen(false);
    },
    onError: () => {
      addToast('Failed to create vehicle', 'error');
    },
  });

  const vehicles = vehiclesData?.vehicles || [];

  // Filter vehicles by search
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicle_number.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.license_plate.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateVehicle = (data: any) => {
    createMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vehicles</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your fleet vehicles
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add Vehicle
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <Input
                placeholder="Search vehicles..."
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
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>

        {/* Vehicles Display */}
        {isLoading ? (
          <LoadingSpinner />
        ) : filteredVehicles.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No vehicles found</p>
            </div>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                viewMode={viewMode}
                onView={() => navigate(`/vehicles/${vehicle.id}`)}
              />
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card padding="sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {vehicles.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Vehicles</p>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {vehicles.filter((v) => v.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {vehicles.filter((v) => v.status === 'maintenance').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Maintenance</p>
            </div>
          </Card>
          <Card padding="sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {vehicles.filter((v) => v.status === 'inactive').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Inactive</p>
            </div>
          </Card>
        </div>

        {/* Create Vehicle Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Add New Vehicle"
          size="lg"
        >
          <VehicleForm
            onSubmit={handleCreateVehicle}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createMutation.isPending}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Vehicles;