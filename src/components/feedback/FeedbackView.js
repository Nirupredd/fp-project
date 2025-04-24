import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { getAllFeedback } from '../../services/feedbackService';
import { formatDate } from '../../utils/dateUtils';
import './FeedbackForm.css';

function FeedbackView() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showStudentOnly, setShowStudentOnly] = useState(false);

  useEffect(() => {
    // Fetch feedback data from the service
    const fetchFeedbacks = () => {
      setLoading(true);
      try {
        // Get feedback data from the service
        const feedbackData = getAllFeedback();
        setFeedbacks(feedbackData);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();

    // Set up an interval to refresh the feedback data every 30 seconds
    const intervalId = setInterval(fetchFeedbacks, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Filter feedbacks based on search term, filter type, and student filter
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch =
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feedback.name && feedback.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (feedback.email && feedback.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'all' || feedback.feedbackType === filterType;
    const matchesStudentFilter = !showStudentOnly || feedback.role === 'student';

    return matchesSearch && matchesType && matchesStudentFilter;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  return (
    <Container className="feedback-container">
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <Card className="feedback-card">
            <Card.Header className="text-center feedback-header">
              <h2>Student Feedback</h2>
              <p>View and analyze feedback submitted by students</p>
            </Card.Header>

            <Card.Body>
              <Row className="mb-4">
                <Col md={5}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search feedback..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    {searchTerm && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="bi bi-x"></i>
                      </Button>
                    )}
                  </InputGroup>
                </Col>
                <Col md={5}>
                  <Form.Select
                    value={filterType}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All Feedback Types</option>
                    <option value="placement-process">Placement Process</option>
                    <option value="company-interactions">Company Interactions</option>
                    <option value="interview-preparation">Interview Preparation</option>
                    <option value="placement-portal">Placement Portal</option>
                    <option value="placement-cell">Placement Cell Staff</option>
                    <option value="mentoring">Mentoring Experience</option>
                    <option value="campus-facilities">Campus Facilities</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Check
                    type="switch"
                    id="student-filter"
                    label="Student Only"
                    checked={showStudentOnly}
                    onChange={(e) => setShowStudentOnly(e.target.checked)}
                    className="mt-2"
                  />
                </Col>
              </Row>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Loading feedback data...</p>
                </div>
              ) : feedbacks.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                  <p className="mt-3">No feedback has been submitted yet.</p>
                  <p className="text-muted">Feedback submitted by students will appear here.</p>
                </div>
              ) : filteredFeedbacks.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-search display-1 text-muted"></i>
                  <p className="mt-3">No feedback found matching your criteria.</p>
                  <p className="text-muted">Try adjusting your search or filter settings.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="feedback-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Submitted By</th>
                        <th>Rating</th>
                        <th>Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFeedbacks.map((feedback, index) => (
                        <tr key={feedback.id || index}>
                          <td>{formatDate(feedback.date)}</td>
                          <td>
                            <Badge bg={getFeedbackTypeBadgeColor(feedback.feedbackType)}>
                              {getFeedbackTypeLabel(feedback.feedbackType)}
                            </Badge>
                            {feedback.role === 'student' && (
                              <Badge bg="info" className="ms-1">Student</Badge>
                            )}
                          </td>
                          <td>
                            {feedback.isAnonymous ? (
                              <span className="text-muted">Anonymous</span>
                            ) : (
                              <>
                                <div>{feedback.name}</div>
                                <small className="text-muted">{feedback.email}</small>
                              </>
                            )}
                          </td>
                          <td>
                            <div className="rating-display">
                              <span className="rating-value">{feedback.rating}</span>
                              <div className="rating-stars">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={i < feedback.rating ? 'star filled' : 'star'}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="feedback-message">
                              {feedback.message.length > 100
                                ? `${feedback.message.substring(0, 100)}...`
                                : feedback.message
                              }
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              <div className="mt-4 text-center">
                <p className="text-muted">
                  <i className="bi bi-info-circle me-2"></i>
                  As a placement incharge, you can view student feedback but cannot submit new feedback.
                </p>
                <p className="text-muted small">
                  <i className="bi bi-arrow-repeat me-1"></i>
                  Feedback data refreshes automatically every 30 seconds.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Helper functions
function getFeedbackTypeLabel(type) {
  switch(type) {
    case 'placement-process': return 'Placement Process';
    case 'company-interactions': return 'Company Interactions';
    case 'interview-preparation': return 'Interview Preparation';
    case 'placement-portal': return 'Placement Portal';
    case 'placement-cell': return 'Placement Cell Staff';
    case 'mentoring': return 'Mentoring Experience';
    case 'campus-facilities': return 'Campus Facilities';
    case 'other': return 'Other';
    default: return 'Unknown';
  }
}

function getFeedbackTypeBadgeColor(type) {
  switch(type) {
    case 'placement-process': return 'primary';
    case 'company-interactions': return 'success';
    case 'interview-preparation': return 'info';
    case 'placement-portal': return 'warning';
    case 'placement-cell': return 'danger';
    case 'mentoring': return 'purple'; // Custom color defined in CSS
    case 'campus-facilities': return 'teal'; // Custom color defined in CSS
    case 'other': return 'secondary';
    default: return 'dark';
  }
}



export default FeedbackView;
