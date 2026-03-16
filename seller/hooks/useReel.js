// hooks/useReel.js
import { useState } from 'react';
import reelService from '../services/reel.service';

export const useReelUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadReel = async (params) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate progress (since fetch doesn't provide progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await reelService.uploadReel(params);
      
      clearInterval(progressInterval);
      setProgress(100);
      setUploading(false);
      
      return result;
    } catch (err) {
      setError(err.message);
      setUploading(false);
      throw err;
    }
  };

  return { uploadReel, uploading, progress, error };
};

export const useReelFeed = (page = 1, limit = 20) => {
  const [feed, setFeed] = useState({ reels: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFeed = async (pageNum = page) => {
    setLoading(true);
    try {
      const data = await reelService.getFeed(pageNum, limit);
      setFeed(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [page, limit]);

  return { feed, loading, error, loadMore: () => loadFeed(feed.page + 1) };
};