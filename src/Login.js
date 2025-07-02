import { useState } from "react";
import axios from "axios";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        phone_number: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post("http://localhost:8000/users/register/", formData);
            localStorage.setItem("token", response.data.tokens.access);
            alert("User registered successfully!");
        } catch (error) {
            alert("Error registering user");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;