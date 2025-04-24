import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Modal, Alert, Spinner } from 'react-bootstrap';
import { getAllResumes, updateResumeStatus } from '../../services/resumeService';
import { formatDate } from '../../utils/dateUtils';
import './ResumeManagement.css';

function ResumeManagement() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user info from localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      
      // Check if user is faculty/placement incharge
      if (parsedUserInfo.role !== 'faculty' && parsedUserInfo.role !== 'admin') {
        setError('You do not have permission to access this page');
        setLoading(false);
        return;
      }
    }

    // Fetch resumes
    fetchResumes();

    // Set up an interval to refresh the resumes data every 30 seconds
    const intervalId = setInterval(fetchResumes, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchResumes = () => {
    setLoading(true);
    try {
      // Get resumes data from the service
      const resumeData = getAllResumes();
      setResumes(resumeData);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setError('Failed to load resume data');
    } finally {
      setLoading(false);
    }
  };

  // Filter resumes based on search term, status, and branch
  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = 
      (resume.studentName && resume.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resume.studentEmail && resume.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resume.rollNumber && resume.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || resume.status === filterStatus;
    const matchesBranch = filterBranch === 'all' || resume.branch === filterBranch;
    
    return matchesSearch && matchesStatus && matchesBranch;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleBranchFilterChange = (e) => {
    setFilterBranch(e.target.value);
  };

  const handleViewResume = (resume) => {
    setSelectedResume(resume);
    setShowResumeModal(true);
  };

  const handleUpdateStatus = (id, newStatus) => {
    try {
      updateResumeStatus(id, newStatus);
      
      // Update local state
      setResumes(prevResumes => 
        prevResumes.map(resume => 
          resume.id === id ? { ...resume, status: newStatus } : resume
        )
      );
      
      // If a resume is currently selected in the modal, update its status too
      if (selectedResume && selectedResume.id === id) {
        setSelectedResume({ ...selectedResume, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating resume status:', error);
    }
  };

  const handleDownloadResume = (resume) => {
    try {
      // Create a link element
      const link = document.createElement('a');
      
      // Set link properties
      link.href = resume.resumeFile.data;
      link.download = resume.resumeFile.name || `${resume.studentName}_resume.pdf`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending Review</Badge>;
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      case 'shortlisted':
        return <Badge bg="info">Shortlisted</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getBranchName = (branchCode) => {
    switch (branchCode) {
      case 'cse': return 'Computer Science';
      case 'it': return 'Information Technology';
      case 'ece': return 'Electronics & Communication';
      case 'eee': return 'Electrical & Electronics';
      case 'mechanical': return 'Mechanical';
      case 'civil': return 'Civil';
      default: return branchCode;
    }
  };

  if (error) {
    return (
      <Container className="resume-management-container">
        <Alert variant="danger" className="text-center">
          <i className="bi bi-exclamation-triangle-fill display-4 mb-3"></i>
          <h4>Access Denied</h4>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="resume-management-container">
      <Card className="resume-management-card">
        <Card.Header className="resume-management-header">
          <h2>Student Resume Management</h2>
          <p>Review and manage student resume submissions</p>
        </Card.Header>
        
        <Card.Body>
          <Row className="mb-4">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by name, email, or roll number..."
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
            <Col md={4}>
              <Form.Select 
                value={filterStatus} 
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="shortlisted">Shortlisted</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select 
                value={filterBranch} 
                onChange={handleBranchFilterChange}
              >
                <option value="all">All Branches</option>
                <option value="cse">Computer Science</option>
                <option value="it">Information Technology</option>
                <option value="ece">Electronics & Communication</option>
                <option value="eee">Electrical & Electronics</option>
                <option value="mechanical">Mechanical</option>
                <option value="civil">Civil</option>
              </Form.Select>
            </Col>
          </Row>

          {loading && resumes.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading resume data...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-file-earmark-person display-1 text-muted"></i>
              <p className="mt-3">No resumes have been submitted yet.</p>
              <p className="text-muted">When students submit resumes, they will appear here.</p>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted"></i>
              <p className="mt-3">No resumes found matching your criteria.</p>
              <p className="text-muted">Try adjusting your search or filter settings.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="resume-table">
                <thead>
                  <tr>
                    <th>Submission Date</th>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Branch</th>
                    <th>CGPA</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResumes.map((resume) => (
                    <tr key={resume.id}>
                      <td>{formatDate(resume.submissionDate)}</td>
                      <td>
                        <div>{resume.studentName || resume.fullName}</div>
                        <small className="text-muted">{resume.studentEmail || resume.email}</small>
                      </td>
                      <td>{resume.rollNumber}</td>
                      <td>{getBranchName(resume.branch)}</td>
                      <td>{resume.cgpa}</td>
                      <td>{getStatusBadge(resume.status)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewResume(resume)}
                          >
                            <i className="bi bi-eye"></i> View
                          </Button>
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleDownloadResume(resume)}
                          >
                            <i className="bi bi-download"></i> Download
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-muted small">
              <i className="bi bi-arrow-repeat me-1"></i>
              Resume data refreshes automatically every 30 seconds.
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Resume Detail Modal */}
      <Modal
        show={showResumeModal}
        onHide={() => setShowResumeModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Resume Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResume && (
            <div className="resume-details">
              <div className="resume-status-bar mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5>Status: {getStatusBadge(selectedResume.status)}</h5>
                  <div className="status-actions">
                    <Button 
                      variant="outline-success" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleUpdateStatus(selectedResume.id, 'approved')}
                      disabled={selectedResume.status === 'approved'}
                    >
                      <i className="bi bi-check-circle"></i> Approve
                    </Button>
                    <Button 
                      variant="outline-info" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleUpdateStatus(selectedResume.id, 'shortlisted')}
                      disabled={selectedResume.status === 'shortlisted'}
                    >
                      <i className="bi bi-star"></i> Shortlist
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedResume.id, 'rejected')}
                      disabled={selectedResume.status === 'rejected'}
                    >
                      <i className="bi bi-x-circle"></i> Reject
                    </Button>
                  </div>
                </div>
              </div>

              <Row>
                <Col md={6}>
                  <div className="detail-group">
                    <h6>Personal Information</h6>
                    <div className="detail-item">
                      <span className="detail-label">Full Name:</span>
                      <span className="detail-value">{selectedResume.fullName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedResume.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{selectedResume.phone}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-group">
                    <h6>Academic Information</h6>
                    <div className="detail-item">
                      <span className="detail-label">Roll Number:</span>
                      <span className="detail-value">{selectedResume.rollNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Branch:</span>
                      <span className="detail-value">{getBranchName(selectedResume.branch)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Year:</span>
                      <span className="detail-value">{selectedResume.year}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">CGPA:</span>
                      <span className="detail-value">{selectedResume.cgpa}</span>
                    </div>
                  </div>
                </Col>
              </Row>

              {selectedResume.coverLetter && (
                <div className="detail-group mt-3">
                  <h6>Cover Letter</h6>
                  <div className="cover-letter-box p-3 bg-light rounded">
                    {selectedResume.coverLetter}
                  </div>
                </div>
              )}

              <div className="detail-group mt-3">
                <h6>Professional Profiles</h6>
                <div className="detail-item">
                  <span className="detail-label">LinkedIn:</span>
                  <span className="detail-value">
                    {selectedResume.linkedinProfile ? (
                      <a href={selectedResume.linkedinProfile} target="_blank" rel="noopener noreferrer">
                        {selectedResume.linkedinProfile}
                      </a>
                    ) : (
                      <span className="text-muted">Not provided</span>
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">GitHub:</span>
                  <span className="detail-value">
                    {selectedResume.githubProfile ? (
                      <a href={selectedResume.githubProfile} target="_blank" rel="noopener noreferrer">
                        {selectedResume.githubProfile}
                      </a>
                    ) : (
                      <span className="text-muted">Not provided</span>
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Portfolio:</span>
                  <span className="detail-value">
                    {selectedResume.portfolioWebsite ? (
                      <a href={selectedResume.portfolioWebsite} target="_blank" rel="noopener noreferrer">
                        {selectedResume.portfolioWebsite}
                      </a>
                    ) : (
                      <span className="text-muted">Not provided</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="resume-file-section mt-4">
                <h6>Resume File</h6>
                <div className="d-flex align-items-center">
                  <div className="file-info me-3">
                    <i className="bi bi-file-earmark-pdf file-icon"></i>
                    <span className="file-name">{selectedResume.resumeFile.name}</span>
                    <span className="file-size text-muted ms-2">
                      ({Math.round(selectedResume.resumeFile.size / 1024)} KB)
                    </span>
                  </div>
                  <Button 
                    variant="primary"
                    onClick={() => handleDownloadResume(selectedResume)}
                  >
                    <i className="bi bi-download me-2"></i>
                    Download Resume
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResumeModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ResumeManagement;
