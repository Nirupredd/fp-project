import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './Auth.css';

function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get role from URL query parameter or default to student
  const [userRole, setUserRole] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('role') === 'mentor' ? 'mentor' : 'student';
  });

  // Get the redirect path from location state or default to home
  const from = location.state?.from || '/placementData';

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      // Add role to the data
      const registerData = {
        ...data,
        role: userRole
      };

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      // Show success message and redirect to login page
      setError('');

      // Create a success message to display on the login page
      const successMessage = `Registration successful! Please login with your credentials.${userRole === 'mentor' ? ' You will be redirected to the mentoring dashboard after login.' : ''}`;

      // Pass the role to the login page to pre-select it

      // Redirect to login page with success message and role information
      navigate('/login', {
        state: {
          successMessage,
          email: data.email,
          initialRole: userRole
        }
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="mb-4">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="role-info mb-4">
          <p className="text-center mb-3">
            {userRole === 'student' ? (
              <>
                <i className="bi bi-mortarboard me-2"></i>
                Registering as Student
              </>
            ) : (
              <>
                <i className="bi bi-person-badge me-2"></i>
                Registering as Mentor
              </>
            )}
          </p>
          <div className="alert alert-info" role="alert">
            <i className="bi bi-info-circle me-2"></i>
            {userRole === 'student' ?
              'Please fill in your details to register as a student.' :
              'Please fill in your details to register as a mentor. You will be able to help students with their queries.'}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person"></i></span>
              <input
                type="text"
                id="username"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                placeholder="Enter your username"
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  }
                })}
              />
              {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
            </div>
          </div>

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

          <div className="mb-3">
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

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-shield-lock"></i></span>
              <input
                type="password"
                id="confirmPassword"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirm your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === watch('password') || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="department" className="form-label">Department</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-building"></i></span>
              <select
                id="department"
                className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                {...register('department', {
                  required: 'Department is required'
                })}
              >
                <option value="">Select your department</option>
                <option value="CSE">Computer Science Engineering</option>
                <option value="IT">Information Technology</option>
                <option value="ECE">Electronics & Communication Engineering</option>
                <option value="EEE">Electrical & Electronics Engineering</option>
                <option value="MECH">Mechanical Engineering</option>
                <option value="CIVIL">Civil Engineering</option>
                <option value="CHEM">Chemical Engineering</option>
              </select>
              {errors.department && <div className="invalid-feedback">{errors.department.message}</div>}
            </div>
          </div>

          {userRole === 'mentor' && (
            <>
              <div className="mb-3">
                <label htmlFor="specialization" className="form-label">Specialization</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-award"></i></span>
                  <input
                    type="text"
                    id="specialization"
                    className={`form-control ${errors.specialization ? 'is-invalid' : ''}`}
                    placeholder="E.g., Machine Learning, Web Development"
                    {...register('specialization', {
                      required: 'Specialization is required for mentors'
                    })}
                  />
                  {errors.specialization && <div className="invalid-feedback">{errors.specialization.message}</div>}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="bio" className="form-label">Bio</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-file-person"></i></span>
                  <textarea
                    id="bio"
                    className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
                    placeholder="Tell students about yourself and your expertise"
                    rows="3"
                    {...register('bio', {
                      required: 'Bio is required for mentors'
                    })}
                  ></textarea>
                  {errors.bio && <div className="invalid-feedback">{errors.bio.message}</div>}
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Registering...' : `Register as ${userRole === 'student' ? 'Student' : 'Mentor'}`}
          </button>
        </form>

        <div className="mt-3 text-center">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
