import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError('');

        // Get user token from localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
          throw new Error('You must be logged in to view your profile');
        }

        // Fetch profile data from backend API
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userInfo.token}`
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch profile data');
        }

        setUserProfile(result);
      } catch (error) {
        setError(error.message);
        // If there's an error, use the data from localStorage as fallback
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
          setUserProfile({
            username: userInfo.username,
            email: userInfo.email,
            role: userInfo.role
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
    window.location.reload(); // Force reload to update navbar state
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="profile-header">
          <div className="profile-avatar">
            {userProfile?.username?.charAt(0).toUpperCase()}
          </div>
          <h2>{userProfile?.username}</h2>
          <span className="profile-role">
            {userProfile?.role === 'faculty' ? 'Placement Incharge' :
             userProfile?.role === 'admin' ? 'Administrator' :
             userProfile?.role === 'mentor' ? 'Mentor' : 'Student'}
          </span>
        </div>

        <div className="profile-details">
          <div className="profile-detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{userProfile?.email}</span>
          </div>

          <div className="profile-detail-item">
            <span className="detail-label">Account Type:</span>
            <span className="detail-value">
              {userProfile?.role === 'admin' ? 'Administrator' :
               userProfile?.role === 'faculty' ? 'Placement Incharge' :
               userProfile?.role === 'mentor' ? 'Mentor' : 'Student'}
            </span>
          </div>

          <div className="profile-detail-item">
            <span className="detail-label">Account Created:</span>
            <span className="detail-value">
              {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          {/* Role-specific information */}
          {userProfile?.role === 'faculty' && (
            <div className="role-specific-info">
              <h3 className="section-title">Placement Incharge Dashboard</h3>
              <div className="dashboard-stats">
                <div className="stat-card">
                  <i className="bi bi-file-earmark-text stat-icon"></i>
                  <div className="stat-info">
                    <h4>Placement Forms</h4>
                    <p>Manage student placement information</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate('/placementForm')}
                    >
                      Go to Forms
                    </button>
                  </div>
                </div>

                <div className="stat-card">
                  <i className="bi bi-table stat-icon"></i>
                  <div className="stat-info">
                    <h4>Placement Data</h4>
                    <p>View and analyze placement statistics</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate('/placementData')}
                    >
                      View Data
                    </button>
                  </div>
                </div>

                <div className="stat-card">
                  <i className="bi bi-chat-square-text stat-icon"></i>
                  <div className="stat-info">
                    <h4>Student Feedback</h4>
                    <p>View feedback from students about placement services</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate('/feedback')}
                    >
                      View Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {userProfile?.role === 'mentor' && (
            <div className="role-specific-info">
              <h3 className="section-title">Mentor Dashboard</h3>
              <div className="dashboard-stats">
                <div className="stat-card">
                  <i className="bi bi-people stat-icon"></i>
                  <div className="stat-info">
                    <h4>Mentoring Dashboard</h4>
                    <p>View your assigned students and respond to queries</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate('/mentoring')}
                    >
                      Go to Mentoring
                    </button>
                  </div>
                </div>

                <div className="stat-card">
                  <i className="bi bi-chat-dots stat-icon"></i>
                  <div className="stat-info">
                    <h4>Student Queries</h4>
                    <p>View and respond to student queries</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate('/mentoring/queries')}
                    >
                      View Queries
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {userProfile?.role === 'student' && (
            <div className="role-specific-info">
              <h3 className="section-title">Student Dashboard</h3>
              <div className="dashboard-stats">
                <div className="stat-card">
                  <i className="bi bi-table stat-icon"></i>
                  <div className="stat-info">
                    <h4>Placement Data</h4>
                    <p>View placement opportunities and statistics</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate('/placementData')}
                    >
                      View Placements
                    </button>
                  </div>
                </div>

                <div className="stat-card">
                  <i className="bi bi-graph-up stat-icon"></i>
                  <div className="stat-info">
                    <h4>Placement Info</h4>
                    <p>Explore detailed placement statistics</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate('/medainPlacemnts')}
                    >
                      View Stats
                    </button>
                    <div className="public-badge mt-2">
                      <i className="bi bi-globe2 me-1"></i> Publicly Available
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <i className="bi bi-file-earmark-person stat-icon"></i>
                  <div className="stat-info">
                    <h4>Resume Submission</h4>
                    <p>Submit your resume for placement opportunities</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate('/resume-submission')}
                    >
                      Submit Resume
                    </button>
                  </div>
                </div>

                <div className="stat-card">
                  <i className="bi bi-chat-square-text stat-icon"></i>
                  <div className="stat-info">
                    <h4>Feedback</h4>
                    <p>Share your feedback about placement services</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate('/feedback')}
                    >
                      Give Feedback
                    </button>
                  </div>
                </div>

                <div className="stat-card">
                  <i className="bi bi-people stat-icon"></i>
                  <div className="stat-info">
                    <h4>Mentoring</h4>
                    <p>Connect with mentors for guidance</p>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate('/mentoring')}
                    >
                      View Mentors
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/')}>Back to Home</button>
          <button className="btn btn-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
