// Resume Service - Handles resume data storage and retrieval

// Initialize resume data in localStorage if it doesn't exist
const initializeResumeData = () => {
  if (!localStorage.getItem('resumeData')) {
    localStorage.setItem('resumeData', JSON.stringify([]));
  }
};

// Get all resume data
export const getAllResumes = () => {
  initializeResumeData();
  return JSON.parse(localStorage.getItem('resumeData')) || [];
};

// Add new resume
export const addResume = (resumeData) => {
  initializeResumeData();
  
  const currentResumes = getAllResumes();
  
  // Create a new resume object with ID and date
  const newResume = {
    ...resumeData,
    id: Date.now().toString(), // Simple ID generation
    submissionDate: new Date().toISOString(),
    status: 'pending' // Initial status
  };
  
  // Add to the beginning of the array (newest first)
  const updatedResumes = [newResume, ...currentResumes];
  
  // Save to localStorage
  localStorage.setItem('resumeData', JSON.stringify(updatedResumes));
  
  return newResume;
};

// Get resume by ID
export const getResumeById = (id) => {
  const allResumes = getAllResumes();
  return allResumes.find(resume => resume.id === id);
};

// Update resume status
export const updateResumeStatus = (id, status) => {
  const allResumes = getAllResumes();
  const updatedResumes = allResumes.map(resume => {
    if (resume.id === id) {
      return { ...resume, status };
    }
    return resume;
  });
  
  localStorage.setItem('resumeData', JSON.stringify(updatedResumes));
  return updatedResumes;
};

// Delete resume by ID
export const deleteResumeById = (id) => {
  const allResumes = getAllResumes();
  const updatedResumes = allResumes.filter(resume => resume.id !== id);
  localStorage.setItem('resumeData', JSON.stringify(updatedResumes));
  return updatedResumes;
};

// Clear all resumes (for testing)
export const clearAllResumes = () => {
  localStorage.setItem('resumeData', JSON.stringify([]));
};
