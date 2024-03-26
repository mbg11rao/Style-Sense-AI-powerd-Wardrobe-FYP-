import React from 'react';
import { Button, IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { Link } from 'react-router-dom';
import './NavBar.css'

function NavBar() {
  return (
    <div className="navbar-container">
      <Button component={Link} to="/" className="navbar-button">Home</Button>
      <Button component={Link} to="/login" className="navbar-button">Login</Button>
      <Button component={Link} to="/signup" className="navbar-button">Signup</Button>
    </div>  
  );
}

export default NavBar;
