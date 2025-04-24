import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import MentorList from './MentorList';
import StudentQueries from './StudentQueries';
import MentorDashboard from './MentorDashboard';
import MentoringHome from './MentoringHome';
import './Mentoring.css';

function Mentoring({ view }) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // If user is not logged in, show the mentoring home page with login prompt
  if (!userInfo) {
    return <MentoringHome />;
  }

  // Render different components based on user role and view
  if (userInfo.role === 'mentor') {
    return <MentorDashboard />;
  } else if (userInfo.role === 'student') {
    if (view === 'queries') {
      return <StudentQueries />;
    } else {
      return <MentorList />;
    }
  } else if (userInfo.role === 'faculty' || userInfo.role === 'admin') {
    // For faculty (placement incharge), show admin view of mentor dashboard
    return <MentorDashboard adminView={true} />;
  } else {
    // For other roles, redirect to home
    return <Navigate to="/" />;
  }
}

export default Mentoring;
