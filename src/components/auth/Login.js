import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './Auth.css';

function Login() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(location.state?.initialRole || 'student');

  // Get the redirect path from location state or determine based on role
  const getRedirectPath = (role) => {
    // If there's a specific path in location state, use that
    if (location.state?.from) {
      return location.state.from;
    }

    // Otherwise, redirect based on role
    switch (role) {
      case 'mentor':
        return '/mentoring?firstLogin=true'; // Mentors go to mentoring page with first login parameter
      case 'faculty':
        return '/placementData'; // Faculty go to placement data
      case 'student':
      default:
        return '/placementData'; // Students go to placement data
    }
  };

  // Check if there's a success message from registration
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccess(location.state.successMessage);

      // If initialRole is provided from registration, use it
      if (location.state.initialRole) {
        setUserRole(location.state.initialRole);
      }

      // Pre-fill email if provided
      if (location.state.email) {
        const emailField = document.getElementById('email');
        if (emailField) {
          emailField.value = location.state.email;
        }
      }
    }
  }, [location.state]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Add role to the data
      const loginData = {
        ...data,
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

      // Determine redirect path based on user role
      const redirectPath = getRedirectPath(result.role);

      // Force a page reload to ensure all components update with the new login state
      window.location.href = redirectPath;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="role-selector mb-4">
          <p className="text-center mb-3">I am a:</p>
          <div className="role-buttons">
            <button
              type="button"
              className={`role-button ${userRole === 'student' ? 'active' : ''}`}
              onClick={() => setUserRole('student')}
            >
              <i className="bi bi-mortarboard me-2"></i>
              Student
            </button>
            <button
              type="button"
              className={`role-button ${userRole === 'mentor' ? 'active' : ''}`}
              onClick={() => setUserRole('mentor')}
            >
              <i className="bi bi-person-badge me-2"></i>
              Mentor
            </button>
            <button
              type="button"
              className={`role-button ${userRole === 'faculty' ? 'active' : ''}`}
              onClick={() => setUserRole('faculty')}
            >
              <i className="bi bi-person-workspace me-2"></i>
              Placement Incharge
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope"></i></span>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder={userRole === 'student' ? 'student@example.com' : 'faculty@example.com'}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock"></i></span>
              <input
                type="password"
                id="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : `Login as ${userRole === 'student' ? 'Student' : userRole === 'mentor' ? 'Mentor' : 'Placement Incharge'}`}
          </button>
        </form>

        <div className="mt-3 text-center">
          {userRole === 'student' && (
            <p>Don't have a student account? <Link to="/register?role=student">Register</Link></p>
          )}
          {userRole === 'mentor' && (
            <p>Don't have a mentor account? <Link to="/register?role=mentor">Register</Link></p>
          )}
          {userRole === 'faculty' && (
            <div className="faculty-note mt-2">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Placement Incharge accounts are created by administrators.
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
