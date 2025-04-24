import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Spinner, Modal, Badge, Tabs, Tab, Row, Col } from 'react-bootstrap';
import './Mentoring.css';

function MentorDashboard({ adminView = false }) {
  const [queries, setQueries] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('queries');

  useEffect(() => {
    // Get user info from localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);

      // Check if this is a first login (based on URL parameter)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('firstLogin') === 'true') {
        setIsFirstLogin(true);
        setSuccess(`Welcome to your Mentor Dashboard, ${parsedUserInfo.username}! Here you can manage your assigned students and respond to their queries.`);

        // Remove the parameter from URL without page refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);

        // Clear the welcome message after 10 seconds
        setTimeout(() => {
          setSuccess('');
        }, 10000);
      }
    }

    // Fetch queries and students
    fetchQueries();
    fetchStudents();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      setError('');

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        throw new Error('You must be logged in to view queries');
      }

      const response = await fetch('http://localhost:5000/api/mentoring/mentor-queries', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch queries');
      }

      setQueries(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        throw new Error('You must be logged in to view students');
      }

      const response = await fetch('http://localhost:5000/api/mentoring/my-students', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch students');
      }

      setStudents(result);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleViewQuery = async (queryId) => {
    try {
      setLoading(true);
      setError('');

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        throw new Error('You must be logged in to view query details');
      }

      const response = await fetch(`http://localhost:5000/api/mentoring/query/${queryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch query details');
      }

      setSelectedQuery(result);
      setResponse(result.response || '');
      setShowResponseModal(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        throw new Error('You must be logged in to submit a response');
      }

      const responseText = response; // Store the response text in a separate variable

      const apiResponse = await fetch(`http://localhost:5000/api/mentoring/query/${selectedQuery._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({ response: responseText })
      });

      const result = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(result.message || 'Failed to submit response');
      }

      console.log('Response submitted successfully:', result);

      // Update query in the list
      const updatedQueries = queries.map(q => {
        if (q._id === result._id) {
          return {
            ...result,
            student: q.student // Ensure we keep the student data
          };
        }
        return q;
      });

      setQueries(updatedQueries);

      // Close modal
      setShowResponseModal(false);

      // Show success message
      setSuccess('Your response has been submitted successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'answered':
        return <Badge bg="success">Answered</Badge>;
      case 'closed':
        return <Badge bg="secondary">Closed</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && queries.length === 0 && students.length === 0) {
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
      <h2 className="text-center mb-4">
        {adminView ? 'Placement Incharge - Mentoring Dashboard' : 'Mentor Dashboard'}
      </h2>

      {adminView && (
        <Alert variant="info" className="mb-4">
          <i className="bi bi-info-circle me-2"></i>
          As a Placement Incharge, you can view all mentors and their assigned students, as well as manage the mentoring program.
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        {adminView && (
          <Tab eventKey="mentors" title="All Mentors">
            <div className="admin-section mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Registered Mentors</h3>
                <Button variant="outline-primary" size="sm">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Mentor
                </Button>
              </div>

              <div className="mentor-admin-list">
                <Alert variant="info">
                  <div className="text-center py-3">
                    <i className="bi bi-people display-4 mb-3"></i>
                    <h4>Mentor Management</h4>
                    <p>This feature allows placement incharge to manage mentors and their assignments.</p>
                    <Button variant="primary" size="sm" className="mt-2">
                      <i className="bi bi-gear me-2"></i>
                      Configure Mentoring Program
                    </Button>
                  </div>
                </Alert>
              </div>
            </div>
          </Tab>
        )}
        <Tab eventKey="queries" title="Student Queries">
          {queries.length === 0 ? (
            <Alert variant="info">
              <div className="text-center">
                <i className="bi bi-chat-square-text display-4 mb-3"></i>
                <h4>No Queries Yet</h4>
                <p>You don't have any queries from students yet.</p>
              </div>
            </Alert>
          ) : (
            <div className="queries-list">
              {queries.map(query => (
                <Card key={query._id} className="query-card mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Card.Title>{query.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          From: {query.student.username} • Received on {formatDate(query.createdAt)}
                        </Card.Subtitle>
                      </div>
                      <div>
                        {getStatusBadge(query.status)}
                      </div>
                    </div>
                    <Card.Text className="query-preview">
                      {query.question.length > 150
                        ? `${query.question.substring(0, 150)}...`
                        : query.question}
                    </Card.Text>
                    <Button
                      variant={query.status === 'pending' ? 'primary' : 'outline-primary'}
                      onClick={() => handleViewQuery(query._id)}
                    >
                      {query.status === 'pending' ? 'Respond' : 'View Details'}
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Tab>
        <Tab eventKey="students" title="My Students">
          {students.length === 0 ? (
            <Alert variant="info">
              <div className="text-center">
                <i className="bi bi-people display-4 mb-3"></i>
                <h4>No Students Yet</h4>
                <p>You don't have any students assigned to you yet.</p>
              </div>
            </Alert>
          ) : (
            <Row>
              {students.map(student => (
                <Col md={6} lg={4} key={student._id} className="mb-4">
                  <Card className="student-card h-100">
                    <Card.Body>
                      <div className="text-center mb-3">
                        <div className="student-avatar">
                          {student.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <Card.Title className="text-center">{student.username}</Card.Title>
                      <Card.Subtitle className="mb-3 text-muted text-center">{student.department}</Card.Subtitle>
                      <Card.Text>
                        <strong>Email:</strong> {student.email}
                      </Card.Text>
                      <div className="text-center mt-3">
                        <Badge bg="info" className="me-2">
                          {queries.filter(q => q.student && q.student._id === student._id).length} Queries
                        </Badge>
                        <Badge bg="success">
                          {queries.filter(q => q.student && q.student._id === student._id && q.status === 'answered').length} Answered
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>
      </Tabs>

      {/* Query Response Modal */}
      <Modal
        show={showResponseModal}
        onHide={() => {
          setShowResponseModal(false);
          // Reset response state when closing modal
          if (selectedQuery && selectedQuery.response) {
            setResponse(selectedQuery.response);
          } else {
            setResponse('');
          }
        }}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedQuery?.title}
            <span className="ms-2">{selectedQuery && getStatusBadge(selectedQuery.status)}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuery && (
            <>
              <div className="query-details mb-4">
                <div className="query-metadata mb-3">
                  <small className="text-muted">
                    From: <strong>{selectedQuery.student.username}</strong> •
                    Submitted on {formatDate(selectedQuery.createdAt)}
                  </small>
                </div>
                <div className="query-content">
                  <h5>Student's Question:</h5>
                  <div className="query-text p-3 mb-4 bg-light rounded">
                    {selectedQuery.question}
                  </div>

                  <Form onSubmit={handleSubmitResponse}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Response:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Type your response here..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        required
                        disabled={selectedQuery.status === 'answered'}
                      />
                    </Form.Group>

                    {selectedQuery.status === 'pending' && (
                      <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit" disabled={submitting}>
                          {submitting ? 'Submitting...' : 'Submit Response'}
                        </Button>
                      </div>
                    )}
                  </Form>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowResponseModal(false);
            // Reset response state when closing modal
            if (selectedQuery && selectedQuery.response) {
              setResponse(selectedQuery.response);
            } else {
              setResponse('');
            }
          }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MentorDashboard;
