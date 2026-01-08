/**
 * Sync Store
 * Global state management for sync operations
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { OfflineQueueItem } from '@/types/sync';

interface SyncStore {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  offlineQueue: OfflineQueueItem[];
  pendingUploads: number;
  
  // Actions
  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSyncTime: (time: string) => void;
  addToQueue: (item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retry_count'>) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  incrementRetry: (id: string) => void;
}

export const useSyncStore = create<SyncStore>()(
  persist(
    (set) => ({
      isOnline: true,
      isSyncing: false,
      lastSyncTime: null,
      offlineQueue: [],
      pendingUploads: 0,

      setOnline: (online) => set({ isOnline: online }),
      
      setSyncing: (syncing) => set({ isSyncing: syncing }),
      
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
      
      addToQueue: (item) =>
        set((state) => ({
          offlineQueue: [
            ...state.offlineQueue,
            {
              ...item,
              id: Math.random().toString(36).substring(2, 9),
              timestamp: new Date().toISOString(),
              retry_count: 0,
            },
          ],
          pendingUploads: state.pendingUploads + 1,
        })),
      
      removeFromQueue: (id) =>
        set((state) => ({
          offlineQueue: state.offlineQueue.filter((item) => item.id !== id),
          pendingUploads: Math.max(0, state.pendingUploads - 1),
        })),
      
      clearQueue: () =>
        set({
          offlineQueue: [],
          pendingUploads: 0,
        }),
      
      incrementRetry: (id) =>
        set((state) => ({
          offlineQueue: state.offlineQueue.map((item) =>
            item.id === id
              ? { ...item, retry_count: item.retry_count + 1 }
              : item
          ),
        })),
    }),
    {
      name: 'sync-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        offlineQueue: state.offlineQueue,
        pendingUploads: state.pendingUploads,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);