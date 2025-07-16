// utils/follow.js or hooks/follow.js
import axiosInstance from '../axiosInstance';

export const FollowBtnFunction = async (followerId, operation) => {
  if (!['addToSet', 'pull'].includes(operation)) {
    throw new Error('Invalid operation type');
  }

  try {
    const response = await axiosInstance.put(
      `/update/follower/${followerId}?operation=${operation}`
    );
    return response.data;
  } catch (error) {
    console.error('Follow operation failed:', error?.response?.data || error.message);
    throw error; // Let the caller handle it
  }
};
