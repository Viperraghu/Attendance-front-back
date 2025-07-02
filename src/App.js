import React from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate } from 'react-router-dom';
import { getUserRole , isAdmin} from './utils'
import AdminRegister from './components/AdminRegister';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CreateUser from './components/CreateUser';
import AttendanceTable from './components/AttendanceTable';
import ExportAttendance from './components/ExportAttendance';
import PunchInOut from './components/PunchInOut';


function App() {
  const role = getUserRole();
  const token = localStorage.getItem('token')
  const is_admin = isAdmin()
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-dashboard" element={token && is_admin === true ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/create-user" element={token && is_admin === true ? <CreateUser /> : <Navigate to ="/" />} />
        <Route path="/attendance" element={token && is_admin === true ? <AttendanceTable /> : <Navigate to="/" />}  />
        <Route path="/export" element={token && is_admin === true ? <ExportAttendance /> : <Navigate to="/" />} />
        <Route path="/export/<int:id>" element={token && is_admin === true ? <ExportAttendance /> : <Navigate to="/" />} />
        <Route path="/punch" element={token && is_admin === false  ? <PunchInOut /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;