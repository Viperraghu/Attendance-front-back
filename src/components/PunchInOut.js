import React, { useState } from 'react';
import axios from 'axios';
import { getUserRole } from '../utils';
import "../styles/PunchInOut.css"

const PunchInOut = () => {
  const [message, setMessage] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [showAttendance, setShowAttendance] = useState(false);
  const role = getUserRole();  // 'admin' or 'user'

  const handlePunch = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'in' ? 'punch-in' : 'punch-out';

      const response = await axios.post(`http://localhost:8000/${endpoint}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(`Punch ${type} successful!`);
    } catch (error) {
      console.error('Punch error:', error.response?.data || error.message);
      setMessage(`Failed to punch ${type}.`);
    }
  };

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/attendance', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Attendance response:", response.data);

      const data = response.data;
      if (Array.isArray(data)) {
        setAttendance(data);
      } else if (Array.isArray(data.attendance)) {
        setAttendance(data.attendance);
      } else {
        setMessage(data.Message || 'No attendance records found');
        setAttendance([]);
      }

      setShowAttendance(true);
    } catch (error) {
      console.error('Attendance fetch error:', error.response?.data || error.message);
      setMessage('Could not fetch attendance.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center" >Punch In/Out</h2>
      {message && <p>{message}</p>}
      <div className="flex flex-col space-y-4">
          <button onClick={() => handlePunch('in')}  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition">Punch In</button>
          <button onClick={() => handlePunch('out')}  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition">
          Punch Out
          </button>
      </div>
      {role === 'admin' && (
        <button onClick={fetchAttendance} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition" >
          Attendance Details
        </button>
      )}

      {showAttendance && attendance.length > 0 && (
        <div >
          <h3>Your Attendance</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Date</th>
                <th>Punch In</th>
                <th>Punch Out</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.punch_in || '-'}</td>
                  <td>{item.punch_out || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PunchInOut;