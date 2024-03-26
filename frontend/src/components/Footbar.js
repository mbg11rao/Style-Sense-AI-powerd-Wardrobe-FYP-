import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust the path as necessary
import { recommend_page, home_page, closet_page } from '../styles/icons';
import '../styles/Footbar.css';

function Footbar() {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Logout the user
    setShowDropdown(false); // Close the dropdown
    navigate('/'); // Redirect to the default home page
  };

  return (
    <nav className='footbar'>
      <div className='button-container'>
        <Link to="/closet" className={location.pathname === '/closet' ? 'active' : ''}>
          <div className='icon'>{closet_page}</div>
        </Link>
        <Link to="/homepage" className={location.pathname === '/homepage' ? 'active' : ''}>
          <div className='icon'>{home_page}</div>
        </Link>
        <Link to="/recommend" className={location.pathname === '/recommend' ? 'active' : ''}>
          <div className='icon'>{recommend_page}</div>
        </Link>
        
        {currentUser && (
          <div className="user-info">
            <button className="username-btn" onClick={() => setShowDropdown(!showDropdown)}>
              {currentUser.username} {/* Display username */}
            </button>
            {showDropdown && (
              <div className="dropdown-content">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Footbar;
