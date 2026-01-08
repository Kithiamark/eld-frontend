/**
 * Sync Hook
 * Provides mobile synchronization operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { syncService } from '@/services/syncService';
import { SyncUploadRequest } from '@/types/sync';
import { useToast } from './useToast';

export const useSync = (deviceId?: string) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Fetch sync status
  const statusQuery = useQuery({
    queryKey: ['syncStatus', deviceId],
    queryFn: () => syncService.getStatus(deviceId!),
    enabled: !!deviceId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Upload data mutation
  const uploadMutation = useMutation({
    mutationFn: (data: SyncUploadRequest) => syncService.upload(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['syncStatus'] });
      addToast(
        `Synced ${response.uploaded_logs} logs, ${response.uploaded_inspections} inspections`,
        'success'
      );
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Sync failed';
      addToast(message, 'error');
    },
  });

  // Force sync mutation
  const forceSyncMutation = useMutation({
    mutationFn: (deviceId: string) => syncService.forceSync(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syncStatus'] });
      addToast('Force sync completed', 'success');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Force sync failed';
      addToast(message, 'error');
    },
  });

  return {
    syncStatus: statusQuery.data,
    isLoading: statusQuery.isLoading,
    error: statusQuery.error,
    uploadData: uploadMutation.mutate,
    forceSync: forceSyncMutation.mutate,
    isUploading: uploadMutation.isPending,
    isSyncing: forceSyncMutation.isPending,
  };
};

// Hook for all sync statuses
export const useSyncStatuses = (driverId?: string) => {
  return useQuery({
    queryKey: ['syncStatuses', driverId],
    queryFn: () => syncService.getAllStatuses(driverId),
    refetchInterval: 60000, // Refresh every minute
  });
};