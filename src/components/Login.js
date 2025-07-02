import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAdmin  , getToken } from '../utils'


const Login = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const is_admin = isAdmin()

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', {
        email: email, 
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Login Success:", response.data);
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('is_admin', response.data.is_admin);
      localStorage.setItem('email', response.data.email);

      if (is_admin == true) {
        navigate("/admin-dashboard");
      }else{
        navigate("/punch");
      }
    } catch (error) {
      console.log("Login Error:", error.response?.data || error.message);
      setErrorMsg("Invalid credentials. Please try again.");
    }

};

return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-100 to-cyan-200 p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-teal-700 mb-6">Login</h1>
         {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
         <form onSubmit={handleLogin} className="space-y-5">
         <label className="block mb-1 text-gray-700 font-medium">Email</label>
           <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
           />
          <label className="block mb-1 text-gray-700 font-medium">Password</label>
          <input
               type="password"
               placeholder="Enter Password"
               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
           />
          <button type="submit"  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md font-semibold transition-all duration-200">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;