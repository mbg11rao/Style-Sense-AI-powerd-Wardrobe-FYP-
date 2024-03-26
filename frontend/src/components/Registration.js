import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registration.css';
import Navigation from "./Navigation";
function Registration() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '', // Add confirm password state
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Password requirements: at least 8 characters, includes a number, a capital letter, and a special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!passwordRegex.test(formData.password)) {
            setError('Password must be at least 8 characters long, contain a number, a capital letter, and a special character.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            setSuccessMessage('Registration successful. Redirecting to login...');
            setError('');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setError(error.response.data.message || 'Registration failed. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <>
         <Navigation/>
        
        <div className="registration-container">
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form className="registration-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

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
                <small>Password must be at least 8 characters long and include a number, a capital letter, and a special character.</small>

                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
        </>
    );
}

export default Registration;
