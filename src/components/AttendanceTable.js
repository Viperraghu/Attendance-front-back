import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, isAdmin } from '../utils';
import '../styles/AttendanceTable.css'
const AttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/attendance', {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });

        console.log("✅ Full API Response:", response.data);

        // Dynamically extract the key that contains the array
        const responseKeys = Object.keys(response.data);
        const targetKey = responseKeys.find(key => Array.isArray(response.data[key]));

        if (targetKey) {
          setAttendanceData(response.data[targetKey]);
          console.log("🎯 Loaded attendance from key:", targetKey);
        } else {
          console.warn("❌ No array found in API response");
        }

      } catch (error) {
        console.error('❌ Error fetching attendance:', error);
        alert('Failed to load attendance records');
      }
    };

    fetchAttendance();
  }, []);

  if (!isAdmin()) {
    return <p style={{ color: 'red' }}>🚫 Only admin can view attendance details.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">📋 All Attendance Records</h2>

      {attendanceData.length === 0 ? (
        <p>Loading or no attendance data available.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white text-sm text-left">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Punch In</th>
                <th className="py-3 px-4">Punch Out</th>
              </tr>
            </thead>
           <tbody>
          
            {attendanceData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50" >
                <td className="py-2 px-4">{item.user}</td>
                <td className="py-2 px-4">{item.date}</td>
                <td className="py-2 px-4">{item.punch_in || '—'}</td>
                <td className="py-2 px-4">{item.punch_out || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;