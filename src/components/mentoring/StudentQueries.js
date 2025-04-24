import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Spinner, Modal, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Mentoring.css';

function StudentQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [assignedMentor, setAssignedMentor] = useState(null);
  const [showNewQueryModal, setShowNewQueryModal] = useState(false);
  const [queryTitle, setQueryTitle] = useState('');
  const [queryQuestion, setQueryQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showQueryDetailModal, setShowQueryDetailModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }

    // Check if student has an assigned mentor
    checkAssignedMentor();

    // Fetch queries
    fetchQueries();
  }, []);

  const checkAssignedMentor = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        navigate('/login');
        return;
      }

      console.log('Checking for assigned mentor in StudentQueries...');

      // First check if assignedMentor is already in the user info
      if (!userInfo.assignedMentor) {
        console.error('No mentor assigned in user info');
        // Show error message before redirecting
        setError('You need to select a mentor first');
        setTimeout(() => {
          // If no mentor is assigned, redirect to mentor list
          navigate('/mentoring');
        }, 2000);
        return;
      }

      // Fetch mentor details to display
      const response = await fetch('http://localhost:5000/api/mentoring/my-mentor', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Assigned mentor found in StudentQueries:', result);
        setAssignedMentor(result);
      } else if (response.status === 404) {
        if (result.message === 'No mentor assigned') {
          console.error('No mentor assigned:', result.message);
          // Show error message before redirecting
          setError('You need to select a mentor first');
          setTimeout(() => {
            // If no mentor is assigned, redirect to mentor list
            navigate('/mentoring');
          }, 2000);
        } else if (result.message.includes('not found')) {
          console.error('Assigned mentor not found:', result.message);
          // Show error message for mentor not found
          setError('Your assigned mentor could not be found. Please contact an administrator.');
          setLoading(false);
        }
      } else {
        // Other errors
        console.error('Error checking mentor:', result.message);
        setError('Error checking mentor: ' + result.message);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking assigned mentor:', error);
      setError('Error checking mentor: ' + error.message);
      setTimeout(() => {
        navigate('/mentoring');
      }, 2000);
    }
  };

  const fetchQueries = async () => {
    try {
      setLoading(true);
      setError('');

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        throw new Error('You must be logged in to view queries');
      }

      const response = await fetch('http://localhost:5000/api/mentoring/queries', {
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

  const handleSubmitQuery = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        throw new Error('You must be logged in to submit a query');
      }

      const response = await fetch('http://localhost:5000/api/mentoring/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          title: queryTitle,
          question: queryQuestion
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit query');
      }

      // Add new query to the list
      setQueries([result, ...queries]);

      // Reset form
      setQueryTitle('');
      setQueryQuestion('');

      // Close modal
      setShowNewQueryModal(false);

      // Show success message
      setSuccess('Your query has been submitted successfully!');

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
      setShowQueryDetailModal(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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

  if (loading && queries.length === 0) {
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
      <h2 className="text-center mb-4">My Queries</h2>

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

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button
          variant="outline-secondary"
          onClick={() => navigate('/mentoring')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Mentor Profile
        </Button>

        <Button
          variant="primary"
          onClick={() => setShowNewQueryModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          New Query
        </Button>
      </div>

      {queries.length === 0 ? (
        <Alert variant="info">
          <div className="text-center">
            <i className="bi bi-chat-square-text display-4 mb-3"></i>
            <h4>No Queries Yet</h4>
            <p>You haven't submitted any queries to your mentor yet. Click the "New Query" button to get started.</p>
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
                      Submitted on {formatDate(query.createdAt)}
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
                  variant="outline-primary"
                  onClick={() => handleViewQuery(query._id)}
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* New Query Modal */}
      <Modal show={showNewQueryModal} onHide={() => setShowNewQueryModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Query</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitQuery}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a brief title for your query"
                value={queryTitle}
                onChange={(e) => setQueryTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Describe your question or concern in detail"
                value={queryQuestion}
                onChange={(e) => setQueryQuestion(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowNewQueryModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Query'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Query Detail Modal */}
      <Modal
        show={showQueryDetailModal}
        onHide={() => setShowQueryDetailModal(false)}
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
                    Submitted on {formatDate(selectedQuery.createdAt)}
                  </small>
                </div>
                <div className="query-content">
                  <h5>Your Question:</h5>
                  <div className="query-text p-3 mb-4 bg-light rounded">
                    {selectedQuery.question}
                  </div>

                  {selectedQuery.status === 'answered' && (
                    <div className="query-response">
                      <h5>Mentor's Response:</h5>
                      <div className="response-text p-3 bg-light rounded">
                        {selectedQuery.response}
                      </div>
                      <div className="response-metadata mt-2">
                        <small className="text-muted">
                          Answered on {formatDate(selectedQuery.updatedAt)}
                        </small>
                      </div>
                    </div>
                  )}

                  {selectedQuery.status === 'pending' && (
                    <Alert variant="info">
                      <i className="bi bi-hourglass-split me-2"></i>
                      Your mentor hasn't responded to this query yet. Please check back later.
                    </Alert>
                  )}
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQueryDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default StudentQueries;
