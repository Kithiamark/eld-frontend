/**
 * Vehicles Hook
 * Provides vehicle CRUD operations and queries
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicleService';
import { CreateVehicleRequest, UpdateVehicleRequest } from '@/types/vehicle';
import { useToast } from './useToast';

export const useVehicles = (statusFilter?: string) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Fetch vehicles list
  const vehiclesQuery = useQuery({
    queryKey: ['vehicles', statusFilter],
    queryFn: () => vehicleService.getAll(statusFilter),
    staleTime: 30000,
  });

  // Create vehicle mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateVehicleRequest) => vehicleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      addToast('Vehicle created successfully', 'success');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to create vehicle';
      addToast(message, 'error');
    },
  });

  // Update vehicle mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVehicleRequest }) =>
      vehicleService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', variables.id] });
      addToast('Vehicle updated successfully', 'success');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update vehicle';
      addToast(message, 'error');
    },
  });

  // Delete vehicle mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => vehicleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      addToast('Vehicle deleted successfully', 'success');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete vehicle';
      addToast(message, 'error');
    },
  });

  // Assign driver mutation
  const assignDriverMutation = useMutation({
    mutationFn: ({ vehicleId, driverId }: { vehicleId: string; driverId: string }) =>
      vehicleService.assignDriver(vehicleId, driverId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', variables.vehicleId] });
      addToast('Driver assigned successfully', 'success');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to assign driver';
      addToast(message, 'error');
    },
  });

  return {
    vehicles: vehiclesQuery.data?.vehicles || [],
    total: vehiclesQuery.data?.total || 0,
    isLoading: vehiclesQuery.isLoading,
    error: vehiclesQuery.error,
    createVehicle: createMutation.mutate,
    updateVehicle: updateMutation.mutate,
    deleteVehicle: deleteMutation.mutate,
    assignDriver: assignDriverMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Hook for single vehicle
export const useVehicle = (id: string) => {
  const vehicleQuery = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleService.getById(id),
    enabled: !!id,
  });

  const inspectionsQuery = useQuery({
    queryKey: ['vehicleInspections', id],
    queryFn: () => vehicleService.getInspections(id),
    enabled: !!id,
  });

  return {
    vehicle: vehicleQuery.data,
    inspections: inspectionsQuery.data || [],
    isLoading: vehicleQuery.isLoading || inspectionsQuery.isLoading,
    error: vehicleQuery.error || inspectionsQuery.error,
  };
};