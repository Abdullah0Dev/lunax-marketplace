// store/middleware/offline.middleware.js
import NetInfo from '@react-native-community/netinfo';
import { offlineActions } from '../slices/offline.slice';
import { api } from '../../api/client';

export const offlineMiddleware = (store) => (next) => async (action) => {
  // Skip if not an API mutation
  if (!action.type?.startsWith('api/executeMutation')) {
    return next(action);
  } 

  const result = next(action);
  
  // Check if it was queued (offline)
  if (result?.data?.queued) {
    store.dispatch(offlineActions.addToQueue(action.meta.arg));
  }

  // When coming back online, process queue
  const netInfo = await NetInfo.fetch();
  if (netInfo.isConnected) {
    const state = store.getState();
    const queue = state.offline.queue;
    
    if (queue.length > 0) {
      store.dispatch(offlineActions.processQueue());
      
      // Process each queued action
      for (const queuedAction of queue) {
        try {
          await store.dispatch(api.endpoints[queuedAction.endpoint].initiate(queuedAction));
          store.dispatch(offlineActions.removeFromQueue(queuedAction.timestamp));
        } catch (error) {
          console.error('Failed to sync offline action:', error);
        }
      }
    }
  }

  return result;
};