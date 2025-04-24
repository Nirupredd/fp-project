import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Spinner, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Mentoring.css';

function MentorList() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [assignedMentor, setAssignedMentor] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);

      // Only proceed if user is a student
      if (parsedUserInfo.role === 'student') {
        // First check if student already has an assigned mentor
        checkAssignedMentor().then(hasAssignedMentor => {
          // Only fetch mentors if student doesn't have an assigned mentor
          if (!hasAssignedMentor) {
            fetchMentors();
          }
        });
      } else {
        // If not a student, show appropriate message
        setError('Only students can access the mentor selection page');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError('');

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        throw new Error('You must be logged in to view mentors');
      }

      const response = await fetch('http://localhost:5000/api/mentoring/mentors', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch mentors');
      }

      setMentors(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkAssignedMentor = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        return false;
      }

      console.log('Checking for assigned mentor...');

      // First check if assignedMentor is already in the user info
      if (userInfo.assignedMentor) {
        console.log('Assigned mentor found in user info');

        // Fetch the mentor details to display
        const response = await fetch('http://localhost:5000/api/mentoring/my-mentor', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo.token}`
          }
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Assigned mentor details fetched:', result);
          setAssignedMentor(result);
          return true;
        } else if (result.message.includes('not found')) {
          // Mentor ID exists but mentor not found in database
          console.error('Assigned mentor not found:', result.message);
          setError('Your assigned mentor could not be found. Please contact an administrator.');
          return true; // Still return true to prevent showing mentor selection
        }
      } else {
        // If not in user info, check via API
        const response = await fetch('http://localhost:5000/api/mentoring/my-mentor', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo.token}`
          }
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Assigned mentor found:', result);
          setAssignedMentor(result);
          return true;
        } else if (response.status === 404) {
          // No mentor assigned
          return false;
        } else {
          // Other errors
          console.error('Error checking mentor:', result.message);
          setError('Error checking mentor status: ' + result.message);
          return false;
        }
      }
    } catch (error) {
      console.error('Error checking assigned mentor:', error);
      setError('Error checking mentor status: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMentor = (mentor) => {
    setSelectedMentor(mentor);
    setShowConfirmModal(true);
  };

  const handleConfirmSelection = async () => {
    try {
      setLoading(true);
      setError('');

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        throw new Error('You must be logged in to select a mentor');
      }

      if (!selectedMentor || !selectedMentor._id) {
        throw new Error('Invalid mentor selection');
      }

      console.log('Sending mentor assignment request with ID:', selectedMentor._id);

      const response = await fetch('http://localhost:5000/api/mentoring/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({ mentorId: selectedMentor._id })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to assign mentor');
      }

      console.log('Mentor assignment successful:', result);

      // Update local state with the selected mentor
      // This ensures we have all the mentor data even if the backend response doesn't include it
      setAssignedMentor({
        ...selectedMentor,
        _id: selectedMentor._id // Ensure the ID is set correctly
      });

      // Close modal
      setShowConfirmModal(false);

      // Show success message
      setError('');
      setSuccess('Mentor assigned successfully! Redirecting to queries page...');

      // Navigate to student queries page after a short delay
      setTimeout(() => {
        navigate('/mentoring/queries');
      }, 2000);
    } catch (error) {
      console.error('Error in mentor assignment:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading && mentors.length === 0) {
    return (
      <div className="mentoring-container d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="mentoring-container">
      <h2 className="text-center mb-4">Mentoring Program</h2>

      {error && (
        <Alert variant={error.includes('not found') ? 'warning' : 'danger'}>
          {error.includes('not found') ? (
            <div className="text-center">
              <i className="bi bi-exclamation-triangle-fill display-4 mb-3"></i>
              <h4>Mentor Not Found</h4>
              <p>{error}</p>
            </div>
          ) : (
            error
          )}
        </Alert>
      )}
      {success && <Alert variant="success">{success}</Alert>}

      {assignedMentor ? (
        <div className="assigned-mentor-section">
          <Alert variant="success">
            <h4>Your Assigned Mentor</h4>
            <p>You have already selected a mentor. You can now ask questions and get guidance.</p>
          </Alert>

          <Card className="mentor-card assigned">
            <Card.Body>
              <Row>
                <Col md={3} className="text-center">
                  <div className="mentor-avatar">
                    {assignedMentor.username.charAt(0).toUpperCase()}
                  </div>
                </Col>
                <Col md={9}>
                  <Card.Title>{assignedMentor.username}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{assignedMentor.department}</Card.Subtitle>
                  <Card.Text>
                    <strong>Specialization:</strong> {assignedMentor.specialization}
                  </Card.Text>
                  <Card.Text>{assignedMentor.bio}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/mentoring/queries')}
                  >
                    View My Queries
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <>
          <div className="mentor-instructions mb-4">
            <Alert variant="info">
              <h4>Select a Mentor</h4>
              <p>Choose a mentor who can guide you through your academic and career journey. Once selected, you cannot change your mentor.</p>
            </Alert>
          </div>

          <Row>
            {mentors.map(mentor => (
              <Col md={6} lg={4} key={mentor._id} className="mb-4">
                <Card className="mentor-card h-100">
                  <Card.Body>
                    <div className="text-center mb-3">
                      <div className="mentor-avatar">
                        {mentor.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <Card.Title className="text-center">{mentor.username}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted text-center">{mentor.department}</Card.Subtitle>
                    <Card.Text>
                      <strong>Specialization:</strong> {mentor.specialization}
                    </Card.Text>
                    <Card.Text className="mentor-bio">{mentor.bio}</Card.Text>
                    <div className="text-center mt-3">
                      <Button
                        variant="primary"
                        onClick={() => handleSelectMentor(mentor)}
                      >
                        Select as Mentor
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {mentors.length === 0 && !loading && (
            <Alert variant="warning">
              <div className="text-center">
                <i className="bi bi-exclamation-triangle-fill display-4 mb-3"></i>
                <h4>No Mentors Found</h4>
                <p>No mentors are available at the moment. Please check back later.</p>
              </div>
            </Alert>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Mentor Selection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to select <strong>{selectedMentor?.username}</strong> as your mentor?</p>
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            This action cannot be undone. You will not be able to change your mentor later.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmSelection} disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm Selection'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MentorList;
