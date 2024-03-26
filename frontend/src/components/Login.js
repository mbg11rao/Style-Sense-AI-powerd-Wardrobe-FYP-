import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import Navigation from "./Navigation";
import { useAuth } from './AuthContext';
 // Adjust the import path as needed
function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(''); // State for storing the error message
    const [successMessage, setSuccessMessage] = useState(''); // State for storing the success message
     // Used to programmatically navigate the user

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login', formData);
            console.log(response.data);
            // Handle success
            setSuccessMessage('You are signed in successfully. Redirecting...');
            login(response.data.user);
            console.log('Success:', successMessage); // Debugging
            setError(''); // Ensure the error message is cleared on successful login

            // Delay redirect to show the success message
            if (response.data && response.data.userId) {
                // Storing userId in localStorage for future use
                localStorage.setItem('userId', response.data.userId);

                // Redirecting to home/dashboard page after successful login
                navigate('/homepage'); // Adjust the route as per your setup
            } else {
                // Handle the lack of a userId in the response
                throw new Error('Failed to retrieve user details.');
            }
        } catch (error) {
            console.error('Login error', error.response.data);
            // Set the error message to display, clear the success message
            setError(error.response.data.message || 'Login failed. Please try again.');
            console.log('Errror:', error); // Debugging
            setSuccessMessage('');
        }
    };

    return (
        <div className='main'>
            <Navigation />
        
        <div className="login-container">
            
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Login</button>
            </form>
        </div>
        </div>
    );
}

export default Login;
