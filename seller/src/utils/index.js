import AsyncStorage from "@react-native-async-storage/async-storage";

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Helper function to get store ID
export const getStoreId = async () => {
  try {
    const storeId = await AsyncStorage.getItem('user_id');
    const storeStr = await AsyncStorage.getItem('store');
    // console.log("storeId 32: ", storeId, storeStr);
    if (storeId) {

      return storeId || '';
    } else if (storeStr) {
      const store = JSON.parse(storeStr);
      return store.id || '';
    }
    return '';
  } catch (error) {
    console.error('Error getting store ID:', error);
    return '';
  }
};
export const STORE_ID = "69c7038c9ba19787f70b3547"
