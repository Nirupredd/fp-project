import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import LoginModal from '../auth/LoginModal';
import { ThemeContext } from '../../context/ThemeContext';
import './Navbar.css';

function CustomNavbar() {
  const [userInfo, setUserInfo] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    // Function to check and update user info
    const updateUserInfo = () => {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      } else {
        setUserInfo(null);
      }
    };

    // Check if user is logged in initially
    updateUserInfo();

    // Add event listeners for storage changes and custom auth events
    window.addEventListener('storage', updateUserInfo);
    window.addEventListener('userLogin', updateUserInfo);
    window.addEventListener('userLogout', updateUserInfo);

    return () => {
      window.removeEventListener('storage', updateUserInfo);
      window.removeEventListener('userLogin', updateUserInfo);
      window.removeEventListener('userLogout', updateUserInfo);
    };
  }, []);

  const handleLogout = () => {
    // Clear user info from localStorage
    localStorage.removeItem('userInfo');
    setUserInfo(null);

    // Dispatch a custom event to notify components about the logout
    window.dispatchEvent(new Event('userLogout'));

    // Redirect to home page
    navigate('/');
  };

  const handlePlacementsClick = () => {
    if (!userInfo) {
      // Show login modal if user is not logged in
      setShowLoginModal(true);
    } else {
      // Navigate to placement data if user is logged in
      navigate('/placementData');
    }
  };



  const handleLoginSuccess = () => {
    // Reload user info after successful login
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  };

  return (
    <>
      <Navbar expand="lg" className={`custom-navbar ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <Navbar.Brand className="ms-4 brand-logo">
          <img src="https://vnrvjiet.ac.in/assets/images/VNR.png" alt="VNR Logo" className="vnr-logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" className="navbar-toggler-custom" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to="/" className="nav-item">
              <i className="bi bi-house-door nav-icon"></i>
              <span>Home</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/companies" className="nav-item">
              <i className="bi bi-building nav-icon"></i>
              <span>Companies</span>
            </Nav.Link>
            {!userInfo && (
              <Nav.Link onClick={handlePlacementsClick} className="nav-item cursor-pointer">
                <i className="bi bi-briefcase nav-icon"></i>
                <span>Placements Data</span>
              </Nav.Link>
            )}
            <Nav.Link as={NavLink} to="/medainPlacements" className="nav-item">
              <i className="bi bi-graph-up nav-icon"></i>
              <span>Placement Info</span>
            </Nav.Link>

            {/* Show Feedback link for mentors, students, and non-logged in users */}
            {!userInfo || (userInfo.role === 'mentor') ? (
              <Nav.Link as={NavLink} to="/feedback" className="nav-item">
                <i className="bi bi-chat-square-text nav-icon"></i>
                <span>Feedback</span>
              </Nav.Link>
            ) : null}

            {!userInfo && (
              <Nav.Link as={NavLink} to="/mentoring" className="nav-item">
                <i className="bi bi-people nav-icon"></i>
                <span>Mentoring</span>
              </Nav.Link>
            )}

            {userInfo && (
              <>
                {/* Show Placement Data link to students and faculty */}
                {userInfo.role !== 'mentor' && (
                  <Nav.Link as={NavLink} to="/placementData" className="nav-item">
                    <i className="bi bi-table nav-icon"></i>
                    <span>Placement Data</span>
                  </Nav.Link>
                )}

                {/* Show Placement Form only to faculty/placement incharge */}
                {userInfo.role === 'faculty' && (
                  <>
                    <Nav.Link as={NavLink} to="/placementForm" className="nav-item">
                      <i className="bi bi-file-earmark-text nav-icon"></i>
                      <span>Placement Form</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/resume-management" className="nav-item">
                      <i className="bi bi-file-earmark-person nav-icon"></i>
                      <span>Resume Management</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/feedback-view" className="nav-item">
                      <i className="bi bi-chat-square-text nav-icon"></i>
                      <span>View Feedback</span>
                    </Nav.Link>
                  </>
                )}

                {/* Show Resume Submission and Feedback only to students */}
                {userInfo.role === 'student' && (
                  <>
                    <Nav.Link as={NavLink} to="/resume-submission" className="nav-item">
                      <i className="bi bi-file-earmark-person nav-icon"></i>
                      <span>Submit Resume</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/feedback" className="nav-item">
                      <i className="bi bi-chat-square-text nav-icon"></i>
                      <span>Submit Feedback</span>
                    </Nav.Link>
                  </>
                )}

                {/* Show Mentoring section for students and mentors */}
                {(userInfo.role === 'student' || userInfo.role === 'mentor') && (
                  <Nav.Link as={NavLink} to="/mentoring" className="nav-item">
                    <i className="bi bi-people nav-icon"></i>
                    <span>Mentoring</span>
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>

          <Nav className="ms-auto me-3">
            <Button
              variant="outline-light"
              className="theme-toggle-btn me-2"
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'}`}></i>
            </Button>

            {userInfo ? (
              <div className="d-flex align-items-center">
                <Dropdown align="end">
                  <Dropdown.Toggle as="div" className="nav-username dropdown-toggle-no-caret">
                    <div className="user-avatar">
                      {userInfo.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <span className="username">{userInfo.username}</span>
                      <span className="user-role-badge">
                        {userInfo.role === 'faculty' ? 'Placement Incharge' :
                         userInfo.role === 'mentor' ? 'Mentor' : 'Student'}
                      </span>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="profile-dropdown-menu">
                    <Dropdown.Item as={NavLink} to="/profile">
                      <i className="bi bi-person me-2"></i>
                      View Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              <Button variant="outline-light" className="login-btn" onClick={() => setShowLoginModal(true)}>
                <i className="bi bi-box-arrow-in-right me-1"></i> Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Login Modal */}
      <LoginModal
        show={showLoginModal}
        onHide={() => {
          setShowLoginModal(false);
          setLoginSuccessMessage('');
        }}
        onLoginSuccess={handleLoginSuccess}
        successMessage={loginSuccessMessage}
      />
    </>
  );
}

export default CustomNavbar;
