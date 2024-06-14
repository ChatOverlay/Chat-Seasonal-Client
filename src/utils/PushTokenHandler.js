// utils/pushTokenHandler.js
export const savePushToken = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/saveExpoPushToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        throw new Error('Failed to save push token');
      }
      console.log('Push token saved successfully');
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  };
  