import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import './Footer.css';

function Footer() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <footer className={`site-footer ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Container>
        <Row className="footer-content">
          <Col md={4} className="footer-section">
            <h5 className="footer-heading">Placement Portal</h5>
            <p className="footer-description">
              Connecting students with opportunities and helping them build successful careers through our comprehensive placement services.
            </p>
            <div className="social-icons">
              <a href="https://www.facebook.com" className="social-link" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.twitter.com" className="social-link" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://www.linkedin.com" className="social-link" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://www.instagram.com" className="social-link" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </Col>

          <Col md={4} className="footer-section">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/companies">Companies</Link></li>
              <li><Link to="/medainPlacemnts">Placement Info</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
              <li><Link to="/placementData">Placement Data</Link></li>
            </ul>
          </Col>

          <Col md={4} className="footer-section">
            <h5 className="footer-heading">Contact Us</h5>
            <address className="footer-contact">
              <p><i className="bi bi-geo-alt"></i> 123 College Road, Education City</p>
              <p><i className="bi bi-envelope"></i> vnrvjiet@gmail.com</p>
              <p><i className="bi bi-telephone"></i> +1234567890</p>
              <p><i className="bi bi-clock"></i> Mon-Fri: 9:00 AM - 5:00 PM</p>
            </address>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <Row className="footer-bottom">
          <Col md={6} className="copyright">
            <p>&copy; {new Date().getFullYear()} Placement Portal. All rights reserved.</p>
          </Col>
          <Col md={6} className="footer-bottom-links">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Cookie Policy</Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
