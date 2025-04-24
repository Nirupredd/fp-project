import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function Form() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const formSubmission = async (data) => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      // Get user token from localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        throw new Error('You must be logged in to submit the form');
      }

      // Format data for API
      const formattedData = {
        ...data,
        campus: data.campus === 'onCampus' ? 'On Campus' : 'Off Campus',
        status: data.status === 'placed' ? 'Placed' :
                data.status === 'notPlaced' ? 'Not Placed' : 'Internship',
        companyType: 'Service Based' // Default value, can be updated if needed
      };

      // Send data to backend API
      const response = await fetch('http://localhost:5000/api/placement-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(formattedData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit form');
      }

      // Success
      setSuccess(true);
      reset();

      // Redirect to placement data page after 2 seconds
      setTimeout(() => {
        navigate('/placementData');
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container d-flex mt-4 justify-content-center align-items-center min-vh-100 bg-light">
      <form onSubmit={handleSubmit(formSubmission)} className="w-100 p-4 bg-white shadow rounded">
        <h2 className="mb-4">Placement Form</h2>

        {error && <div className="alert alert-danger mb-4">{error}</div>}
        {success && <div className="alert alert-success mb-4">Form submitted successfully! Redirecting...</div>}
        <div className="row">
          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="rollno" className="form-label">Roll No</label>
            <input type="text" id="rollno" name="rollno" className="form-control"
              {...register("rollno", { required: true })} />
            {errors.rollno?.type === "required" && <div className="alert alert-warning mt-1">Roll No is required</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="firstname" className="form-label">First Name</label>
            <input type="text" id="firstname" name="firstname" className="form-control"
              {...register("firstname", { required: true })} />
            {errors.firstname?.type === "required" && <div className="alert alert-warning mt-1">First Name is required</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="lastname" className="form-label">Last Name</label>
            <input type="text" id="lastname" name="lastname" className="form-control"
              {...register("lastname", { required: true })} />
            {errors.lastname?.type === "required" && <div className="alert alert-warning mt-1">Last Name is required</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="branch" className="form-label">Branch</label>
            <select id="branch" name="branch" className="form-select"
              {...register("branch", { required: true })}>
              <option value="">Select Branch</option>
              <option value="cse">CSE</option>
              <option value="csbs">CSBS</option>
              <option value="it">IT</option>
              <option value="cyber security">Cyber Security</option>
              <option value="aids or ds">AIDS or DS</option>
              <option value="aiml or iot">AIML or IoT</option>
              <option value="civil">Civil</option>
              <option value="automobile">Automobile</option>
              <option value="mechanical">Mechanical</option>
              <option value="eee">EEE</option>
              <option value="ece">ECE</option>
              <option value="eie">EIE</option>
            </select>
            {errors.branch?.type === "required" && <div className="alert alert-warning mt-1">Branch is required</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="mobilenumber1" className="form-label">Mobile Number 1</label>
            <input type="tel" id="mobilenumber1" name="mobilenumber1" className="form-control"
              {...register("mobilenumber1", { required: true })} />
            {errors.mobilenumber1?.type === "required" && <div className="alert alert-warning mt-1">Mobile Number 1 is required</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="mobilenumber2" className="form-label">Mobile Number 2</label>
            <input type="tel" id="mobilenumber2" name="mobilenumber2" className="form-control"
              {...register("mobilenumber2", { required: true })} />
            {errors.mobilenumber2?.type === "required" && <div className="alert alert-warning mt-1">Mobile Number 2 is required</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="collegeEmail" className="form-label">College Email</label>
            <input type="email" id="collegeEmail" name="collegeEmail" className="form-control"
              {...register("collegeEmail", { required: true })} />
            {errors.collegeEmail?.type === "required" && <div className="alert alert-warning mt-1">College Email is required</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="personalEmail" className="form-label">Personal Email</label>
            <input type="email" id="personalEmail" name="personalEmail" className="form-control"
              {...register("personalEmail", { required: true })} />
            {errors.personalEmail?.type === "required" && <div className="alert alert-warning mt-1">Personal Email is required</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="cgpa" className="form-label">CGPA</label>
            <input type="number" id="cgpa" name="cgpa" className="form-control"
              step="0.01" {...register("cgpa", { required: true })} />
            {errors.cgpa?.type === "required" && <div className="alert alert-warning mt-1">CGPA is required</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="companyPlaced" className="form-label">Company Placed</label>
            <input type="text" id="companyPlaced" name="companyPlaced" className="form-control"
              {...register("companyPlaced", { required: true })} />
            {errors.companyPlaced?.type === "required" && <div className="alert alert-warning mt-1">Company Placed is required</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="yearJoined" className="form-label">Year Joined</label>
            <input type="month" id="yearJoined" name="yearJoined" className="form-control"
              {...register("yearJoined", { required: true })} />
            {errors.yearJoined?.type === "required" && <div className="alert alert-warning mt-1">Year Joined is required</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="yearPlaced" className="form-label">Year Placed</label>
            <input type="month" id="yearPlaced" name="yearPlaced" className="form-control"
              {...register("yearPlaced", { required: true })} />
            {errors.yearPlaced?.type === "required" && <div className="alert alert-warning mt-1">Year Placed is required</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label className="form-label">On-Campus/Off-Campus</label>
            <div className="d-flex justify-content-center">
              <div className="form-check">
                <input type="radio" id="onCampus" value="onCampus" {...register("campus", { required: true })} className="form-check-input" />
                <label htmlFor="onCampus" className="form-check-label">On-Campus</label>
              </div>
              <div className="form-check">
                <input type="radio" id="offCampus" value="offCampus" {...register("campus", { required: true })} className="form-check-input" />
                <label htmlFor="offCampus" className="form-check-label">Off-Campus</label>
              </div>
            </div>
            {errors.campus?.type === "required" && <div className="alert alert-warning mt-1">Please select an option</div>}
          </div>

          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="status" className="form-label">Status</label>
            <select id="status" name="status" className="form-select"
              {...register("status", { required: true })}>
              <option value="">Select Status</option>
              <option value="placed">Placed</option>
              <option value="notPlaced">Not Placed</option>
              <option value="intern">Intern</option>
            </select>
            {errors.status?.type === "required" && <div className="alert alert-warning mt-1">Status is required</div>}
          </div>
          <div className="mb-3 col-12 col-md-6">
            <label htmlFor="package" className="form-label">Package (in LPA)</label>
            <input type="number" id="package" name="package" className="form-control"
              step="0.01" {...register("package", { required: true })} />
            {errors.package?.type === "required" && <div className="alert alert-warning mt-1">Package is required</div>}
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Form;
