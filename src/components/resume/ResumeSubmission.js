import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { addResume } from '../../services/resumeService';
import './ResumeSubmission.css';

function ResumeSubmission() {
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    rollNumber: '',
    branch: '',
    year: '',
    cgpa: '',
    resumeFile: null,
    coverLetter: '',
    linkedinProfile: '',
    githubProfile: '',
    portfolioWebsite: ''
  });

  const [validated, setValidated] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ show: false, message: '', variant: '' });
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user info from localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);

      // Pre-fill form with user data if available
      if (parsedUserInfo.username) {
        setFormData(prevData => ({
          ...prevData,
          fullName: parsedUserInfo.username || '',
          email: parsedUserInfo.email || '',
          branch: parsedUserInfo.department?.toLowerCase() || ''
        }));
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file type
      if (!file.name.match(/\.(pdf|doc|docx)$/)) {
        setFileError('Please upload a PDF, DOC, or DOCX file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFileError('File size should not exceed 5MB');
        return;
      }

      setFileError('');
      setFormData({
        ...formData,
        resumeFile: file
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false || fileError) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!formData.resumeFile) {
      setFileError('Please upload your resume');
      setValidated(true);
      return;
    }

    setLoading(true);

    // Create a reader to convert the file to base64 for storage
    const reader = new FileReader();
    reader.readAsDataURL(formData.resumeFile);

    reader.onload = () => {
      try {
        // Prepare resume data with file as base64
        const resumeToSubmit = {
          ...formData,
          resumeFile: {
            name: formData.resumeFile.name,
            type: formData.resumeFile.type,
            size: formData.resumeFile.size,
            data: reader.result
          },
          studentId: userInfo?.id || '',
          studentName: formData.fullName,
          studentEmail: formData.email,
          studentDepartment: formData.branch
        };

        // Add resume using the service
        addResume(resumeToSubmit);

        // Show success message
        setSubmitStatus({
          show: true,
          message: 'Your resume has been submitted successfully! The placement incharge will review it.',
          variant: 'success'
        });

        // Reset form after successful submission
        setFormData({
          fullName: userInfo?.username || '',
          email: userInfo?.email || '',
          phone: '',
          rollNumber: '',
          branch: userInfo?.department?.toLowerCase() || '',
          year: '',
          cgpa: '',
          resumeFile: null,
          coverLetter: '',
          linkedinProfile: '',
          githubProfile: '',
          portfolioWebsite: ''
        });
        setValidated(false);

        // Clear file input
        document.getElementById('resumeFile').value = '';
      } catch (error) {
        console.error('Error submitting resume:', error);
        setSubmitStatus({
          show: true,
          message: 'There was an error submitting your resume. Please try again.',
          variant: 'danger'
        });
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setSubmitStatus({
        show: true,
        message: 'There was an error processing your resume file. Please try again.',
        variant: 'danger'
      });
      setLoading(false);
    };
  };

  return (
    <Container className="resume-submission-container">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="resume-card">
            <Card.Header className="text-center resume-header">
              <h2>Resume Submission</h2>
              <p>Submit your resume for placement opportunities</p>
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
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your full name.
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
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid email.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{10}"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid 10-digit phone number.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Roll Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your roll number.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Branch</Form.Label>
                      <Form.Select
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Branch</option>
                        <option value="cse">Computer Science</option>
                        <option value="it">Information Technology</option>
                        <option value="ece">Electronics & Communication</option>
                        <option value="eee">Electrical & Electronics</option>
                        <option value="mechanical">Mechanical</option>
                        <option value="civil">Civil</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select your branch.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Year of Study</Form.Label>
                      <Form.Select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select your year of study.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>CGPA</Form.Label>
                      <Form.Control
                        type="number"
                        name="cgpa"
                        value={formData.cgpa}
                        onChange={handleChange}
                        required
                        min="0"
                        max="10"
                        step="0.01"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your CGPA (0-10).
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Resume Upload</Form.Label>
                  <Form.Control
                    type="file"
                    id="resumeFile"
                    onChange={handleFileChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Upload your resume in PDF, DOC, or DOCX format (max 5MB).
                  </Form.Text>
                  {fileError && <div className="text-danger mt-1">{fileError}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Cover Letter (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    placeholder="Briefly describe your skills, experience, and why you're a good fit for placement opportunities."
                  />
                </Form.Group>

                <div className="section-divider">
                  <span>Professional Profiles (Optional)</span>
                </div>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>LinkedIn Profile</Form.Label>
                      <Form.Control
                        type="url"
                        name="linkedinProfile"
                        value={formData.linkedinProfile}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>GitHub Profile</Form.Label>
                      <Form.Control
                        type="url"
                        name="githubProfile"
                        value={formData.githubProfile}
                        onChange={handleChange}
                        placeholder="https://github.com/yourusername"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Portfolio Website</Form.Label>
                      <Form.Control
                        type="url"
                        name="portfolioWebsite"
                        value={formData.portfolioWebsite}
                        onChange={handleChange}
                        placeholder="https://yourportfolio.com"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2 mt-4">
                  <Button variant="primary" type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Resume'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ResumeSubmission;
