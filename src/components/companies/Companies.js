import React from 'react';
import './Companies.css';

function Companies() {
  // Array of company data with logos and names
  const companies = [
    {
      id: 1,
      name: 'Google',
      logo: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
      description: 'A multinational technology company specializing in Internet-related services and products.'
    },
    {
      id: 2,
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png',
      description: 'An American multinational technology company focusing on e-commerce, cloud computing, and artificial intelligence.'
    },
    {
      id: 3,
      name: 'JP Morgan',
      logo: 'data:image/png;base64,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',
      description: 'A global leader in financial services, offering solutions to the world\'s most important corporations and organizations.'
    },
    {
      id: 4,
      name: 'Oracle',
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/Oracle-Logo.png',
      description: 'An American multinational computer technology corporation specializing in database software and technology.'
    },
    {
      id: 5,
      name: 'TCS',
      logo:"data:image/png;base64,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",
      description: 'An Indian multinational information technology services and consulting company.'
    },
    {
      id: 6,
      name: 'Wipro',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/1280px-Wipro_Primary_Logo_Color_RGB.svg.png',
      description: 'A leading global information technology, consulting and business process services company.'
    },
    {
      id: 7,
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1280px-Microsoft_logo.svg.png',
      description: 'An American multinational technology corporation that produces computer software, consumer electronics, and related services.'
    },
    {
      id: 8,
      name: 'Accenture',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/1280px-Accenture.svg.png',
      description: 'A global professional services company that provides services in strategy, consulting, digital, technology and operations.'
    },
    {
      id: 9,
      name: 'PayPal',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png',
      description: 'An American company operating an online payments system that supports online money transfers and serves as an electronic alternative to traditional paper methods.'
    },
    {
      id: 10,
      name: 'Qualcomm',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Qualcomm_logo.svg/1280px-Qualcomm_logo.svg.png',
      description: 'An American multinational corporation that creates semiconductors, software, and services related to wireless technology.'
    }
  ];

  return (
    <div className="companies-page">
      <div className="companies-header">
        <h1>Our Recruiting Partners</h1>
        <p>VNRVJIET has strong connections with leading companies across various industries. Our students have been placed in these prestigious organizations.</p>
      </div>

      <div className="companies-grid">
        {companies.map((company) => (
          <div key={company.id} className="company-card">
            <div className="company-logo-container">
              <img src={company.logo} alt={`${company.name} logo`} className="company-logo" />
            </div>
            <div className="company-info">
              <h3>{company.name}</h3>
              <p>{company.description}</p>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}

export default Companies;
