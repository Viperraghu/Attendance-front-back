// src/components/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, clearUserData , isAdmin} from '../utils';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const role = getUserRole();
  const is_admin = isAdmin()

  if (is_admin !== true) {
    return <p>Only admin can access this page.</p>;
  }

  const handleLogout = () => {
    clearUserData();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-4xl font-bold text-center text-purple-700 mb-8"> Admin Dashboard </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <button onClick={() => navigate('/create-user')} lassName="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200">Create User</button>
               <button onClick={() => navigate('/attendance')} lassName="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200">View Attendance</button>
               <button onClick={() => navigate('/export')} lassName="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200">Export Attendance</button>
               <button onClick={handleLogout}  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200">Logout</button>
            </div>
      </div>
    </div>
  );
};

export default AdminDashboard;