import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import Home from './components/home/Home';
import Companies from './components/companies/Companies';
import Report from './components/placementData/data';
import Form from './components/placementForm/form';
import MedainPlacements from './components/medainPlacements/MedainPlacements';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import ResumeSubmission from './components/resume/ResumeSubmission';
import ResumeManagement from './components/resume/ResumeManagement';
import FeedbackForm from './components/feedback/FeedbackForm';
import FeedbackView from './components/feedback/FeedbackView';
import Mentoring from './components/mentoring/Mentoring';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorPage from './components/ErrorPage';
import './components/ErrorBoundary.css';
import './components/utils/responsive.css';
import './components/utils/touch.css';
import './components/utils/LoadingSpinner.css';


function App() {

  let router=createBrowserRouter([
      {
        path:'',
        element:<RootLayout/>,
        errorElement: <ErrorPage />,
        children:[
          {
            path:'',
            element:<Home/>
          },
          {
            path:'home',
            element:<Home/>
          },
          {
            path:'companies',
            element:<Companies/>
          },
          {
            path:'placementData',
            element:<ProtectedRoute><Report/></ProtectedRoute>
          },
          {
            path:'placementForm',
            element:<RoleProtectedRoute allowedRoles={['faculty', 'admin']}><Form/></RoleProtectedRoute>
          },
          {
            path:'medainPlacements',
            element:<MedainPlacements/>
          },
          {
            path:'login',
            element:<Login/>
          },
          {
            path:'register',
            element:<Register/>
          },
          {
            path:'profile',
            element:<ProtectedRoute><Profile/></ProtectedRoute>
          },
          {
            path:'resume-submission',
            element:<RoleProtectedRoute allowedRoles={['student']}><ResumeSubmission/></RoleProtectedRoute>
          },
          {
            path:'resume-management',
            element:<RoleProtectedRoute allowedRoles={['faculty', 'admin']}><ResumeManagement/></RoleProtectedRoute>
          },
          {
            path:'feedback',
            element:<RoleProtectedRoute allowedRoles={['mentor', 'student']}><FeedbackForm/></RoleProtectedRoute>
          },
          {
            path:'feedback-view',
            element:<RoleProtectedRoute allowedRoles={['faculty', 'admin']}><FeedbackView/></RoleProtectedRoute>
          },
          {
            path:'mentoring',
            element:<Mentoring />
          },
          {
            path:'mentoring/queries',
            element:<RoleProtectedRoute allowedRoles={['student', 'mentor']}><Mentoring view="queries" /></RoleProtectedRoute>
          },
        ]
      }
  ])



  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;