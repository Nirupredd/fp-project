import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import './LoginModal.css';

function LoginModal({ show, onHide, onLoginSuccess, initialRole, successMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRole, setUserRole] = useState(initialRole || 'student');
  const navigate = useNavigate();

  // Set success message if provided
  useEffect(() => {
    if (successMessage) {
      setSuccess(successMessage);
    }
  }, [successMessage]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Add role to the data
      const loginData = {
        email,
        password,
        role: userRole
      };

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Store user data in localStorage
      localStorage.setItem('userInfo', JSON.stringify(result));

      // Dispatch a custom event to notify components about the login
      window.dispatchEvent(new Event('userLogin'));

      // Call the success callback
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Close the modal
      onHide();

      // Determine redirect path based on user role
      let redirectPath;
      switch (result.role) {
        case 'mentor':
          redirectPath = '/mentoring?firstLogin=true'; // Mentors go to mentoring page with first login parameter
          break;
        case 'faculty':
          redirectPath = '/placementData'; // Faculty go to placement data
          break;
        case 'student':
        default:
          redirectPath = window.location.pathname; // Stay on current page for students
      }

      // Redirect to the appropriate page based on role
      if (redirectPath !== window.location.pathname) {
        window.location.href = redirectPath;
      } else {
        // If staying on the same page, just reload to refresh components
        window.location.reload();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    onHide();
    navigate('/register');
  };

  return (
    <Modal show={show} onHide={onHide} centered className="login-modal">
      <Modal.Header closeButton>
        <Modal.Title>Login Required</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center mb-3">
          {window.location.pathname.includes('mentoring')
            ? 'You need to be logged in to access mentoring features.'
            : 'You need to be logged in to access placement information.'}
        </p>

        <div className="role-info-box mb-3">
          <div className="role-info-header">
            <i className="bi bi-info-circle me-2"></i>
            Role-specific Access
          </div>
          <div className="role-info-content">
            <p><strong>Public Access:</strong></p>
            <ul>
              <li>Home</li>
              <li>Companies</li>
              <li>Placement Info <span className="public-badge"><i className="bi bi-globe2"></i> Public</span></li>
            </ul>
            <p><strong>Students</strong> can additionally access:</p>
            <ul>
              <li>Placement Data</li>
              <li>Mentoring (select mentors, ask queries)</li>
            </ul>
            <p><strong>Mentors</strong> can access:</p>
            <ul>
              <li>Mentoring Dashboard</li>
              <li>Student Queries</li>
            </ul>
            <p><strong>Placement Incharge</strong> can additionally access:</p>
            <ul>
              <li>Placement Form</li>
              <li>Placement Data</li>
            </ul>
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div className="role-selector mb-4">
          <p className="text-center mb-2">I am a:</p>
          <div className="role-buttons">
            <Button
              variant={userRole === 'student' ? 'primary' : 'outline-secondary'}
              className="role-btn"
              onClick={() => setUserRole('student')}
            >
              <i className="bi bi-mortarboard me-2"></i>
              Student
            </Button>
            <Button
              variant={userRole === 'mentor' ? 'primary' : 'outline-secondary'}
              className="role-btn"
              onClick={() => setUserRole('mentor')}
            >
              <i className="bi bi-person-badge me-2"></i>
              Mentor
            </Button>
            <Button
              variant={userRole === 'faculty' ? 'primary' : 'outline-secondary'}
              className="role-btn"
              onClick={() => setUserRole('faculty')}
            >
              <i className="bi bi-person-workspace me-2"></i>
              Placement Incharge
            </Button>
          </div>
        </div>

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <div className="input-with-icon">
              <i className="bi bi-envelope input-icon"></i>
              <Form.Control
                type="email"
                placeholder={userRole === 'student' ? 'student@example.com' : 'faculty@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <div className="input-with-icon">
              <i className="bi bi-lock input-icon"></i>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </Form.Group>

          <div className="d-grid gap-2 mt-4">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : `Login as ${userRole === 'student' ? 'Student' : userRole === 'mentor' ? 'Mentor' : 'Placement Incharge'}`}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-center flex-column">
        <div className="d-flex align-items-center mb-2">
          {userRole === 'student' && (
            <>
              <p className="mb-0 me-2">Don't have a student account?</p>
              <Button variant="link" className="p-0" onClick={() => { onHide(); navigate('/register?role=student'); }}>Register</Button>
            </>
          )}
          {userRole === 'mentor' && (
            <>
              <p className="mb-0 me-2">Don't have a mentor account?</p>
              <Button variant="link" className="p-0" onClick={() => { onHide(); navigate('/register?role=mentor'); }}>Register</Button>
            </>
          )}
          {userRole === 'faculty' && (
            <div className="faculty-note">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Placement Incharge accounts are created by administrators.
              </small>
            </div>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginModal;
