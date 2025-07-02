// src/components/CreateUser.js
import React, { useState } from 'react';
import axios from 'axios';
import { getUserRole , isAdmin } from '../utils';
import '../styles/CreateUser.css'

const CreateUser = () => {
  const role = getUserRole();
  const is_admin = isAdmin()
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  if (is_admin !== true) {
    return <p>Only admin can access this page.</p>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/create-user', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('User created successfully!');
    } catch (error) {
      setMessage('Error creating user.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 to-yellow-200 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-yellow-600 mb-6">
          Create User
        </h2>
        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">

        <label  className="block mb-1 text-gray-700 font-medium" > Full Name:</label>
        <input name="full_name" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none" required />
        <label  className="block mb-1 text-gray-700 font-medium"> Email:</label>
        <input name="email" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none" required />
        <label  className="block mb-1 text-gray-700 font-medium"> Phone Number:</label>
        <input name="phone_number" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"  required />
        <label  className="block mb-1 text-gray-700 font-medium"> Password:</label>
        <input name="password" type="password" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none" required />
        <button type="submit"  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md font-semibold transition-all duration-200">Create</button>
      </form>
      </div>
    </div>
  );
};

export default CreateUser;



