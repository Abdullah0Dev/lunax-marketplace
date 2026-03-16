import apiConfig from '../../config/api.config';
import { STORE_ID } from '../../utils';

// Upload image first (can happen early)
export const uploadImage = async (storeId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'store'); // Optional
    formData.append('storeId', storeId || 'temp'); // If you have it

    try {
        const res = await fetch(`http://localhost:4000/api/upload/image`, {
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
    console.log("files: ", files);

    // Append each file to the form data
    files.forEach((file, index) => {
        formData.append('images', file); // 'images' matches backend field name
    });

    // Optional: Add metadata
    formData.append('folder', 'store');
    formData.append('storeId', storeId || 'temp'); // If you have it

    try {
        const response = await fetch(`http://localhost:4000/api/upload/images`, {
            method: 'POST',
            body: formData, 
        });
        console.log("response: ", response);

        // Assuming your backend returns array of uploaded images
        return response.data.images; // { success: true, images: [{ url, publicId, thumbnailUrl }] }
    } catch (error) {
        console.log("error uploading images: ", error);
        throw error;
    }
};
