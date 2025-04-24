import React, { useState, useEffect } from "react";
import "./data.css"

function Report() {
  const [data, setData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlacementData = async () => {
      try {
        setLoading(true);
        setError('');

        // Get user token from localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
          throw new Error('You must be logged in to view this data');
        }

        // Fetch data from backend API
        const response = await fetch('http://localhost:5000/api/placement-data', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userInfo.token}`
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch placement data');
        }

        setData(result);
      } catch (error) {
        setError(error.message);
        // Fallback to local storage if API fails
        const details = localStorage.getItem('formData');
        if (details) {
          setData(JSON.parse(details));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlacementData();
  }, [])


  const handleRowClick = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseDetails = () => {
    setSelectedStudent(null);
  };
  // Add state for search and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('package');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter and sort data
  const filteredData = data.filter(student => {
    const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
    const rollNo = student.rollno.toLowerCase();
    const company = student.companyPlaced.toLowerCase();
    const search = searchTerm.toLowerCase();

    return fullName.includes(search) ||
           rollNo.includes(search) ||
           company.includes(search);
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField === 'name') {
      const nameA = `${a.firstname} ${a.lastname}`.toLowerCase();
      const nameB = `${b.firstname} ${b.lastname}`.toLowerCase();
      return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    } else if (sortField === 'package') {
      return sortDirection === 'asc' ? a.package - b.package : b.package - a.package;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="reportContainer">
      <div className="report-header">
        <div>
          <h1 className="report-title">Placement Data</h1>
          <p className="report-subtitle">View and explore student placement information</p>
        </div>
        <div className="report-actions">
          <button className="btn btn-outline-secondary">
            <i className="bi bi-download me-2"></i>Export
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border" style={{ color: 'rgb(135, 4, 4)' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading placement data...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="alert alert-info">No placement data available.</div>
      ) : (
        <>
          <div className="search-filter-container">
            <div className="search-box">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                placeholder="Search by name, roll no, or company..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
            <select
              className="form-select filter-dropdown"
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortField(field);
                setSortDirection(direction);
              }}
            >
              <option value="package-desc">Highest Package</option>
              <option value="package-asc">Lowest Package</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>

          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Sl.No</th>
                <th scope="col">Roll No</th>
                <th scope="col" onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Name {sortField === 'name' && (
                    <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                  )}
                </th>
                <th scope="col">Company</th>
                <th scope="col" onClick={() => handleSort('package')} style={{ cursor: 'pointer' }}>
                  Package (LPA) {sortField === 'package' && (
                    <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((student, index) => (
                <tr key={index} onClick={() => handleRowClick(student)}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{student.rollno}</td>
                  <td>{student.firstname} {student.lastname}</td>
                  <td>
                    <span className="company-badge">{student.companyPlaced}</span>
                  </td>
                  <td className="package-cell">₹{student.package}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="pagination-button"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`pagination-button ${currentPage === number + 1 ? 'active' : ''}`}
                >
                  {number + 1}
                </button>
              ))}

              <button
                className="pagination-button"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {selectedStudent && (
        <div className="modalBackdrop" onClick={handleCloseDetails}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Student Profile</h2>
              <button className="close" onClick={handleCloseDetails}>
                <i className="bi bi-x"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="student-detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Full Name</span>
                  <div className="detail-value">{selectedStudent.firstname} {selectedStudent.lastname}</div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Roll Number</span>
                  <div className="detail-value">{selectedStudent.rollno}</div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Branch</span>
                  <div className="detail-value">{selectedStudent.branch.toUpperCase()}</div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">CGPA</span>
                  <div className="detail-value">{selectedStudent.cgpa}</div>
                </div>
              </div>

              <hr />

              <h4 className="mb-3">Placement Information</h4>
              <div className="student-detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Company</span>
                  <div className="detail-value">
                    <span className="company-badge">{selectedStudent.companyPlaced}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Package</span>
                  <div className="detail-value detail-highlight">₹{selectedStudent.package} LPA</div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <div className="detail-value">
                    <span className={`status-badge ${selectedStudent.status === 'Placed' ? 'status-placed' :
                                      selectedStudent.status === 'Not Placed' ? 'status-not-placed' : 'status-intern'}`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Company Type</span>
                  <div className="detail-value">{selectedStudent.companyType}</div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Year Joined</span>
                  <div className="detail-value">{selectedStudent.yearJoined}</div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Year Placed</span>
                  <div className="detail-value">{selectedStudent.yearPlaced}</div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Placement Type</span>
                  <div className="detail-value">{selectedStudent.campus}</div>
                </div>
              </div>

              <hr />

              <h4 className="mb-3">Contact Information</h4>
              <div className="student-detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Primary Contact</span>
                  <div className="detail-value">{selectedStudent.mobilenumber1}</div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Secondary Contact</span>
                  <div className="detail-value">{selectedStudent.mobilenumber2 || 'N/A'}</div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Personal Email</span>
                  <div className="detail-value">{selectedStudent.personalEmail}</div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">College Email</span>
                  <div className="detail-value">{selectedStudent.collegeEmail}</div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseDetails}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Report;
