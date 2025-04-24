import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { addFeedback } from '../../services/feedbackService';
import './FeedbackForm.css';

function FeedbackForm() {
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: '',
    rating: '',
    message: '',
    isAnonymous: false
  });

  // Get user info from localStorage when component mounts
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);

      // Pre-fill name and email if user is logged in and not anonymous
      if (!formData.isAnonymous) {
        setFormData(prevData => ({
          ...prevData,
          name: parsedUserInfo.username || '',
          email: parsedUserInfo.email || ''
        }));
      }
    }
  }, []);

  const [validated, setValidated] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ show: false, message: '', variant: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // Prepare feedback data
      const feedbackToSubmit = {
        ...formData,
        rating: parseInt(formData.rating),
        role: userInfo ? userInfo.role : 'anonymous',
        department: userInfo ? userInfo.department : '',
      };

      // Add feedback using the service
      addFeedback(feedbackToSubmit);

      // Show success message
      setSubmitStatus({
        show: true,
        message: 'Thank you for your feedback! Your input helps us improve our placement services.',
        variant: 'success'
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        feedbackType: '',
        rating: '',
        message: '',
        isAnonymous: false
      });
      setValidated(false);
    } catch (error) {
      // Show error message
      setSubmitStatus({
        show: true,
        message: 'There was an error submitting your feedback. Please try again.',
        variant: 'danger'
      });
    }
  };

  return (
    <Container className="feedback-container">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="feedback-card">
            <Card.Header className="text-center feedback-header">
              <h2>Feedback Form</h2>
              <p>Help us improve our placement services by sharing your feedback</p>
            </Card.Header>

            <Card.Body>
              {submitStatus.show && (
                <Alert
                  variant={submitStatus.variant}
                  onClose={() => setSubmitStatus({...submitStatus, show: false})}
                  dismissible
                >
                  {submitStatus.message}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required={!formData.isAnonymous}
                        disabled={formData.isAnonymous || (userInfo && userInfo.role === 'student')}
                        readOnly={userInfo && userInfo.role === 'student' && !formData.isAnonymous}
                      />
                      {userInfo && userInfo.role === 'student' && !formData.isAnonymous && (
                        <Form.Text className="text-muted">
                          Using your account name. Check "Submit anonymously" if you prefer not to share your identity.
                        </Form.Text>
                      )}
                      <Form.Control.Feedback type="invalid">
                        Please provide your name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required={!formData.isAnonymous}
                        disabled={formData.isAnonymous || (userInfo && userInfo.role === 'student')}
                        readOnly={userInfo && userInfo.role === 'student' && !formData.isAnonymous}
                      />
                      {userInfo && userInfo.role === 'student' && !formData.isAnonymous && (
                        <Form.Text className="text-muted">
                          Using your account email.
                        </Form.Text>
                      )}
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid email.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    label="Submit anonymously"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                    className="anonymous-checkbox"
                  />
                  <Form.Text className="text-muted">
                    Check this if you prefer to submit feedback without sharing your personal information.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Feedback Type</Form.Label>
                  <Form.Select
                    name="feedbackType"
                    value={formData.feedbackType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Feedback Type</option>
                    <option value="placement-process">Placement Process</option>
                    <option value="company-interactions">Company Interactions</option>
                    <option value="interview-preparation">Interview Preparation</option>
                    <option value="placement-portal">Placement Portal</option>
                    <option value="placement-cell">Placement Cell Staff</option>
                    {userInfo && userInfo.role === 'student' && (
                      <>
                        <option value="mentoring">Mentoring Experience</option>
                        <option value="campus-facilities">Campus Facilities</option>
                      </>
                    )}
                    <option value="other">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a feedback type.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Rating</Form.Label>
                  <div className="rating-container">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="rating-item">
                        <Form.Check
                          type="radio"
                          id={`rating-${value}`}
                          name="rating"
                          value={value}
                          checked={formData.rating === value.toString()}
                          onChange={handleChange}
                          required
                          className="visually-hidden"
                        />
                        <Form.Label
                          htmlFor={`rating-${value}`}
                          className={`rating-star ${formData.rating >= value ? 'selected' : ''}`}
                        >
                          ★
                        </Form.Label>
                        <span className="rating-label">{getRatingLabel(value)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="invalid-feedback d-block">
                    {validated && !formData.rating && 'Please provide a rating.'}
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Your Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Please share your experience, suggestions, or concerns..."
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide your feedback.
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" className="submit-button">
                    {userInfo && userInfo.role === 'student' ? 'Submit Student Feedback' : 'Submit Feedback'}
                  </Button>
                </div>

                {userInfo && userInfo.role === 'student' && (
                  <div className="mt-3 text-center">
                    <p className="text-muted small">
                      <i className="bi bi-info-circle me-1"></i>
                      Your feedback helps us improve our placement services. Thank you for taking the time to share your thoughts.
                    </p>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Helper function to get rating labels
function getRatingLabel(value) {
  switch(value) {
    case 1: return 'Poor';
    case 2: return 'Fair';
    case 3: return 'Good';
    case 4: return 'Very Good';
    case 5: return 'Excellent';
    default: return '';
  }
}

export default FeedbackForm;
