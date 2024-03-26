import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Admin.css'; // Make sure this path is correct

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.response.data);
      setError('Failed to fetch users. Please try again.');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/admin/users/${userId}`);
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting user:', error.response.data);
      setError('Failed to delete user. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addUser = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await axios.post('http://localhost:8000/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      fetchUsers(); // Refresh the list after adding a new user
      setError('');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' }); // Reset form
    } catch (error) {
      console.error('Error adding user:', error.response.data);
      setError('Failed to add user. Please try again.');
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-header">Registered Users</h2>
      {error && <div className="error-message">{error}</div>}

      {/* User list */}
      <div className="user-list">
        {users.map(user => (
          <div key={user._id} className="user-list-item">
            <div className="user-info">
              <strong>Username:</strong> {user.username}
            </div>
            <div className="user-info">
              <strong>Email:</strong> {user.email}
            </div>
            <button onClick={() => deleteUser(user._id)} className="delete-button">Delete</button>
          </div>
        ))}
      </div>

      {/* Add user form */}
      <form onSubmit={addUser} className="add-user-form">
        <h3>Add New User</h3>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="add-user-button">Add User</button>
      </form>
    </div>
  );
}

export default AdminPanel;
