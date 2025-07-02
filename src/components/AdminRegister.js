// src/components/AdminRegister.js

import React, { useState } from 'react';

function AdminRegister(){
      const [form , setForm] = useState({ email : '' , username : '' , password : ''});
      const role = localStorage.getItem('role')
      const handleSubmit = async(e) =>{
        e.preventDefault();
        
        const res = await fetch("http://localhost:8000/admin-register" ,{
            method : "POST" ,
            headers : {'Content-Type' : "application/json"} ,
            body : JSON.stringify(form) ,
        });
        if (res.ok) alert("Admin registered successfulyy");
      }; 
   
 
return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
           <h1 className="text-3xl font-bold text-purple-700 text-center mb-6"> Admin Register </h1>
           <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block mb-1 text-gray-700 font-medium">Email</label>
              <input
                  type='email'
                  placeholder="Email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
               />
              <label className="block mb-1 text-gray-700 font-medium"> Username </label>
              <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                  type='text'
                  placeholder="Username"
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
              />
              <label className="block mb-1 text-gray-700 font-medium" > Password </label>
              <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                  type ='password'
                  placeholder="Password"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
              />
             <button type="submit"  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md font-semibold transition-all duration-200">Create Admin</button>
         </form>
      </div>
    </div>
  );
}

export default AdminRegister;
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  