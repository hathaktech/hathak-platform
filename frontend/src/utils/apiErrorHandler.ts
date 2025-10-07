// Utility function to handle API response errors properly
export const handleApiResponseError = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const errorData = await response.json();
    return errorData;
  } else {
    // If it's HTML (like a 404 page), return a proper error response
    return {
      success: false,
      error: {
        message: `Server error: ${response.status} ${response.statusText}. Please check if the backend server is running.`,
        statusCode: response.status
      }
    };
  }
};
