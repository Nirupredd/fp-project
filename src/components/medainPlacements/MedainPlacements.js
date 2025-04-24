import React, { useState, useEffect } from 'react';
import image1 from "../images/image1.png";
import image2 from "../images/image2.png";
import image3 from "../images/image3.png";
import image4 from "../images/image4.png";
import image5 from "../images/image5.png";
import image6 from "../images/image6.png";
import './MedainPlacements.css';

function MedainPlacements() {
  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [yearWiseData, setYearWiseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch stats from backend API (no auth required for public endpoints)
        const statsResponse = await fetch('http://localhost:5000/api/more-info/stats');

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log('Stats data fetched successfully:', statsData);
          setStats(statsData);
        } else {
          console.error('Failed to fetch stats:', await statsResponse.text());
          setError('Failed to fetch placement statistics');
        }

        // Fetch companies data
        const companiesResponse = await fetch('http://localhost:5000/api/more-info/companies');

        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          console.log('Companies data fetched successfully:', companiesData);
          setCompanies(companiesData);
        } else {
          console.error('Failed to fetch companies:', await companiesResponse.text());
        }

        // Fetch year-wise data
        const yearWiseResponse = await fetch('http://localhost:5000/api/more-info/year-wise');

        if (yearWiseResponse.ok) {
          const yearWiseData = await yearWiseResponse.json();
          setYearWiseData(yearWiseData);
        } else {
          console.error('Failed to fetch year-wise data:', await yearWiseResponse.text());
        }
      } catch (error) {
        console.error('Error fetching placement data:', error);
        setError('Error fetching placement data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up an interval to refresh data every 5 minutes
    const refreshInterval = setInterval(fetchData, 5 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(refreshInterval);
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading placement statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h1 className="text-center mb-2">Placement Statistics</h1>
        <div className="public-access-indicator mb-4">
          <i className="bi bi-globe2"></i> Publicly Available Information
        </div>

        <div className="no-data-container">
          <div className="no-data-message text-center">
            <i className="bi bi-bar-chart-line no-data-icon"></i>
            <h3>Placement Statistics</h3>
            <p>Our placement statistics are currently being updated.</p>
            <p className="sub-message">Data will be available once placements are recorded in the system.</p>

            <div className="placeholder-stats mt-4">
              <div className="placeholder-stat">
                <div className="placeholder-icon">
                  <i className="bi bi-people"></i>
                </div>
                <div className="placeholder-text">
                  <span>Students Placed</span>
                </div>
              </div>

              <div className="placeholder-stat">
                <div className="placeholder-icon">
                  <i className="bi bi-currency-rupee"></i>
                </div>
                <div className="placeholder-text">
                  <span>Highest Package</span>
                </div>
              </div>

              <div className="placeholder-stat">
                <div className="placeholder-icon">
                  <i className="bi bi-building"></i>
                </div>
                <div className="placeholder-text">
                  <span>Recruiting Companies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have any meaningful data to display
  const hasData = stats?.totalPlaced > 0 || (companies && companies.length > 0) || (yearWiseData && yearWiseData.length > 0);

  if (!hasData) {
    return (
      <div className="container mt-4">
        <h1 className="text-center mb-2">Placement Info</h1>
        <div className="public-access-indicator mb-4">
          <i className="bi bi-globe2"></i> Publicly Available Information
        </div>

        <div className="no-data-container">
          <div className="no-data-message text-center">
            <i className="bi bi-bar-chart-line no-data-icon"></i>
            <h3>No Placement Data Available</h3>
            <p>Placement statistics will be displayed here once data is added.</p>
            <p className="sub-message">Please check back after placement records have been added to the system.</p>

            <div className="placeholder-stats mt-4">
              <div className="placeholder-stat">
                <div className="placeholder-icon">
                  <i className="bi bi-people"></i>
                </div>
                <div className="placeholder-text">
                  <span>Students Placed</span>
                </div>
              </div>

              <div className="placeholder-stat">
                <div className="placeholder-icon">
                  <i className="bi bi-currency-rupee"></i>
                </div>
                <div className="placeholder-text">
                  <span>Highest Package</span>
                </div>
              </div>

              <div className="placeholder-stat">
                <div className="placeholder-icon">
                  <i className="bi bi-building"></i>
                </div>
                <div className="placeholder-text">
                  <span>Recruiting Companies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-2">Placement Info</h1>
      <div className="public-access-indicator mb-4">
        <i className="bi bi-globe2"></i> Publicly Available Information
      </div>

      {/* Key Statistics */}
      <div className="stats-overview mb-5">
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="stats-card text-center">
              <h3>Total Placed</h3>
              <div className="stats-value">{stats?.totalPlaced || 0}</div>
              <div className="stats-label">Students</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card text-center">
              <h3>Highest Package</h3>
              <div className="stats-value">
                {stats?.highestPackage ? `₹${stats.highestPackage} LPA` : 'N/A'}
              </div>
              <div className="stats-label">Offered</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card text-center">
              <h3>Average Package</h3>
              <div className="stats-value">
                {stats?.avgPackage ? `₹${stats.avgPackage.toFixed(2)} LPA` : 'N/A'}
              </div>
              <div className="stats-label">Across all placements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Analysis */}
      <div className="section-container mb-5">
        <h2 className="section-heading">Company Analysis</h2>
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="stats-card h-100">
              <h4 className="section-title">Top Recruiting Companies</h4>
              <div className="company-list">
                {companies && companies.length > 0 ? (
                  companies.slice(0, 10).map((company, index) => (
                    <div key={index} className="company-item">
                      <span className="company-name">{company._id}</span>
                      <span className="company-count">{company.count} students</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-data-message">
                    <i className="bi bi-building-x"></i>
                    <p>No company data available yet</p>
                    <small>Data will appear here once placements are recorded</small>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="stats-card h-100">
              <h4 className="section-title">Package Distribution</h4>
              <div className="chart-container">
                <img src={image4} alt="Package Distribution" className="img-fluid chart-image" />
                <div className="chart-caption">
                  <p>Distribution of packages across different salary ranges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="section-container mb-5">
        <h2 className="section-heading">Trend Analysis</h2>
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="stats-card h-100">
              <h4 className="section-title">Salary Trends Over Time</h4>
              <div className="chart-container">
                <img src={image5} alt="Salary Trend" className="img-fluid chart-image" />
                <div className="chart-caption">
                  <p>Average salary offered over the years</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="stats-card h-100">
              <h4 className="section-title">Branch-wise Placement</h4>
              <div className="chart-container">
                <img src={image1} alt="Branch-wise Placement" className="img-fluid chart-image" />
                <div className="chart-caption">
                  <p>Average salary offered by department</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="section-container">
        <h2 className="section-heading">Additional Insights</h2>
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="stats-card h-100">
              <h4 className="section-title">Internship Conversion</h4>
              <div className="chart-container">
                <img src={image2} alt="Internship Conversion" className="img-fluid chart-image" />
                <div className="chart-caption">
                  <p>Conversion rate from internships to full-time offers</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="stats-card h-100">
              <h4 className="section-title">Median Package Analysis</h4>
              <div className="chart-container">
                <img src={image3} alt="Median Package" className="img-fluid chart-image" />
                <div className="chart-caption">
                  <p>Median package based on various factors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedainPlacements;
