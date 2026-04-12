import apiConfig from '../../config/api.config';
import { BASE_URL } from './client';

// Upload image first (can happen early)
export const uploadImage = async (storeId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'store'); // Optional
    formData.append('storeId', storeId || 'temp'); // If you have it

    try {
        const res = await fetch(`${BASE_URL}/upload/image`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data', // Try adding this
                'X-Requested-With': 'XMLHttpRequest', // Sometimes helps
            },
        });
        const data = await res.json();
        return data.url; // {success, url: '..}
    } catch (error) {
        console.log("error: ", (error));
        throw new error.message
    }
};
export const uploadImages = async (storeId, files) => {
  const formData = new FormData();

  // Append each file correctly for React Native
  files.forEach((file) => {
    formData.append('images', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
  });

  // Optional metadata (check what your backend expects)
  formData.append('folder', 'store');
  formData.append('storeId', storeId || 'temp');

  try {
    const response = await fetch(`${BASE_URL}/upload/images`, {
      method: 'POST',
      body: formData,
      headers: {
        // Do NOT set Content-Type manually; fetch will set it with boundary
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json(); // Parse JSON
    console.log('Upload success:', result);
    return result.images; // Adjust based on your backend response
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};
