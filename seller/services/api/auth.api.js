// store/thunks/auth.thunks.js (or in your component)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authActions } from '../store/slices/auth.slice';
import { BASE_URL } from './client';

// Login function with API call
export const loginUser = (username, password) => async (dispatch) => {
  try {
    // Set loading state
    dispatch(authActions.setLoading(true));
    dispatch(authActions.clearError());
    const login_url = BASE_URL + "/stores/login"
    // Make API call to your backend
    const response = await fetch(login_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error messages
      if (data.message === 'User not found') {
        dispatch(authActions.setError('Username not found'));
      } else if (data.message === 'Invalid password') {
        dispatch(authActions.setError('Incorrect password'));
      } else {
        dispatch(authActions.setError(data.message || 'Login failed'));
      }
      return;
    }

    // Login successful - store credentials
    dispatch(authActions.setCredentials({
      token: data.token,
      user: data.user,
      store: data.store || null,
    }));

    // Optionally store token in localStorage
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user_id', data.user.id);
    await AsyncStorage.setItem('store', JSON.stringify(data.store));


  } catch (error) {
    dispatch(authActions.setError('Network error. Please try again.'));
  }
};

// Add this to your auth.api.js file
export const logoutUser = () => async (dispatch) => {
  try {
    // Clear Redux state
    dispatch(authActions.logout());

    // Clear AsyncStorage
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user_id');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('store');

    // Clear localStorage if you're using it (for web)
    localStorage.removeItem('token');
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, still clear local data
    dispatch(authActions.logout());
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user_id');
  }
};