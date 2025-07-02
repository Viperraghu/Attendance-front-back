import React, { useState } from 'react';
import axios from 'axios';
import { getUserRole, isAdmin } from '../utils';
import '../styles/ExportAttendance.css'

const ExportAttendance = () => {
  const role = getUserRole();
  const is_admin = isAdmin();
  const [message, setMessage] = useState('');

  if (!is_admin) {
    return <p style={{ color: 'red' }}>Only admin can access this page.</p>;
  }

  const handleExport = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/export/?type=${type}`,
        {
          headers: { Authorization: `Bearer ${token} `},
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_attendance.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage(`Download started: ${type}_attendance.xlsx`);
    } catch (err) {
      console.error('Export error:', err);
      setMessage('Export failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center"> Export Attendance (Admin Only)</h2>
      <button onClick={() => handleExport('weekly')}  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md font-semibold transition-all duration-200">Export Weekly</button>
      <button onClick={() => handleExport('monthly')}  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md font-semibold transition-all duration-200">
        Export Monthly
      </button>
      {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default ExportAttendance;