import axios from 'axios';

const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL || 'http://localhost:4000';
const DELIVERY_SERVICE_URL = process.env.REACT_APP_DELIVERY_SERVICE_URL || 'http://localhost:5003';

/**
 * Get tracking information for an order (authenticated)
 */
export const getOrderTrackingInfo = async (orderId) => {
  try {
    const response = await axios.get(
      `${ORDER_SERVICE_URL}/api/tracking/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching tracking info:', error);
    throw new Error(error.response?.data?.message || 'Failed to get tracking information');
  }
};

/**
 * Get public tracking information (no authentication)
 */
export const getPublicTrackingInfo = async (orderId) => {
  try {
    const response = await axios.get(
      `${ORDER_SERVICE_URL}/api/tracking/public/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching public tracking info:', error);
    throw new Error(error.response?.data?.message || 'Failed to get tracking information');
  }
};

/**
 * Get delivery driver location for an order
 */
export const getDriverLocation = async (orderId) => {
  try {
    const response = await axios.get(
      `${DELIVERY_SERVICE_URL}/api/location/order/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching driver location:', error);
    return null; // Return null instead of throwing to handle gracefully
  }
};
