// Feedback Service - Handles feedback data storage and retrieval

// Initialize feedback data in localStorage if it doesn't exist
const initializeFeedbackData = () => {
  if (!localStorage.getItem('feedbackData')) {
    localStorage.setItem('feedbackData', JSON.stringify([]));
  }
};

// Get all feedback data
export const getAllFeedback = () => {
  initializeFeedbackData();
  return JSON.parse(localStorage.getItem('feedbackData')) || [];
};

// Add new feedback
export const addFeedback = (feedbackData) => {
  initializeFeedbackData();
  
  const currentFeedback = getAllFeedback();
  
  // Create a new feedback object with ID and date
  const newFeedback = {
    ...feedbackData,
    id: Date.now().toString(), // Simple ID generation
    date: new Date().toISOString(),
  };
  
  // Add to the beginning of the array (newest first)
  const updatedFeedback = [newFeedback, ...currentFeedback];
  
  // Save to localStorage
  localStorage.setItem('feedbackData', JSON.stringify(updatedFeedback));
  
  return newFeedback;
};

// Get feedback by ID
export const getFeedbackById = (id) => {
  const allFeedback = getAllFeedback();
  return allFeedback.find(feedback => feedback.id === id);
};

// Delete feedback by ID
export const deleteFeedbackById = (id) => {
  const allFeedback = getAllFeedback();
  const updatedFeedback = allFeedback.filter(feedback => feedback.id !== id);
  localStorage.setItem('feedbackData', JSON.stringify(updatedFeedback));
  return updatedFeedback;
};

// Clear all feedback (for testing)
export const clearAllFeedback = () => {
  localStorage.setItem('feedbackData', JSON.stringify([]));
};
