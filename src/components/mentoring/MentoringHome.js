import React, { useState } from 'react';
import { Card, Button, Row, Col, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import './Mentoring.css';

function MentoringHome() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginRole, setLoginRole] = useState('student');
  const navigate = useNavigate();

  const handleLoginClick = (role) => {
    setLoginRole(role);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    // Reload the page to show the appropriate mentoring interface
    window.location.reload();
  };

  return (
    <div className="mentoring-home-container">
      <div className="mentoring-hero">
        <h1>VNR Mentoring Program</h1>
        <p className="lead">Connect with experienced mentors to guide your academic and career journey</p>
      </div>

      <Container className="py-5">
        <Row className="mb-5">
          <Col md={6} className="mb-4 mb-md-0">
            <div className="info-card">
              <h2>For Students</h2>
              <p>Get guidance from experienced mentors who can help you navigate your academic and career path.</p>
              <ul>
                <li>Connect with mentors in your field of interest</li>
                <li>Ask questions and get personalized advice</li>
                <li>Receive guidance on career opportunities</li>
                <li>Get feedback on your academic progress</li>
              </ul>
              <Button 
                variant="primary" 
                className="mt-3"
                onClick={() => handleLoginClick('student')}
              >
                Login as Student
              </Button>
              <div className="mt-2">
                <small>
                  Don't have an account? <a href="#" onClick={() => navigate('/register?role=student')}>Register here</a>
                </small>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="info-card">
              <h2>For Mentors</h2>
              <p>Share your knowledge and experience to help students achieve their full potential.</p>
              <ul>
                <li>Guide students in your area of expertise</li>
                <li>Answer queries and provide valuable insights</li>
                <li>Help shape the next generation of professionals</li>
                <li>Build your mentorship portfolio</li>
              </ul>
              <Button 
                variant="secondary" 
                className="mt-3"
                onClick={() => handleLoginClick('mentor')}
              >
                Login as Mentor
              </Button>
              <div className="mt-2">
                <small>
                  Want to become a mentor? <a href="#" onClick={() => navigate('/register?role=mentor')}>Register here</a>
                </small>
              </div>
            </div>
          </Col>
        </Row>

        <div className="how-it-works mb-5">
          <h2 className="text-center mb-4">How It Works</h2>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Register & Login</h3>
                <p>Create an account as a student or mentor and log in to access the mentoring platform.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Connect</h3>
                <p>Students select a mentor based on their expertise and interests.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Collaborate</h3>
                <p>Ask questions, get answers, and receive guidance through the mentoring platform.</p>
              </div>
            </Col>
          </Row>
        </div>

        <Alert variant="info" className="text-center">
          <h4>Ready to get started?</h4>
          <p>Login or register to access the mentoring platform.</p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="primary" onClick={() => handleLoginClick('student')}>
              Student Login
            </Button>
            <Button variant="secondary" onClick={() => handleLoginClick('mentor')}>
              Mentor Login
            </Button>
          </div>
        </Alert>
      </Container>

      {/* Login Modal */}
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={loginRole}
      />
    </div>
  );
}

export default MentoringHome;
