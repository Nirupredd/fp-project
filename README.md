# Placement Portal

A comprehensive web application for managing college placements, mentoring, and student career development.

## Features

- **Authentication System**: Role-based authentication for students, mentors, and placement incharge
- **Placement Data**: View and manage placement statistics and student placement records
- **Companies Information**: Information about recruiting companies
- **Mentoring System**: Student-mentor interaction platform
- **Resume Submission**: Students can submit resumes for review
- **Feedback System**: Collect feedback from students
- **Dark/Light Theme**: Toggle between dark and light themes

## Tech Stack

- **Frontend**: React, React Router, React Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd placement-portal
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   JWT_SECRET=your_secure_jwt_secret_key
   MONGODB_URI=mongodb://localhost:27017/placement-portal
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend development server (in a new terminal):
   ```
   npm start
   ```

3. Access the application at `http://localhost:3000`

## User Roles

- **Student**: Can view placement data, select mentors, submit queries, upload resumes, and provide feedback
- **Mentor**: Can view assigned students and respond to their queries
- **Placement Incharge**: Can add placement data, view statistics, and manage the placement process

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.
