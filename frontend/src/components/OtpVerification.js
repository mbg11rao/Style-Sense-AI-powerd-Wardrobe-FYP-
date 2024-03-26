import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './OtpVerification.css';

function OtpVerification() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your backend endpoint URL
      await axios.post('http://localhost:8000/verify-otp', { email, otp });
      alert('OTP verified, account activated!');
      history.push('/login'); // Redirect to login after successful verification
    } catch (error) {
      setError(error.response.data.message || 'An error occurred.');
    }
  };

  return (
    <div className="otp-verification-container">
      <form className="otp-verification-form" onSubmit={handleSubmit}>
        <h2>Enter OTP</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
        />
        <button type="submit">Verify OTP</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default OtpVerification;
