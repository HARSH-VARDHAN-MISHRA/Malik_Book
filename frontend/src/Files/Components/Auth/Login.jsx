import React, { useState } from 'react';
import './Login.css';
import { LOGIN } from '../../../api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const sendData = { email, password };

    
        try {
            // const response = await axios.post(LOGIN, sendData);
            const response = await axios.post(LOGIN, sendData, { withCredentials: true });

            console.log("Response:", response);
    
            if (response.data.status === 1) {
                const userDetails = {
                    id: response.data.data.id,
                    name: response.data.data.name,
                    email: response.data.data.email,
                    token: response.data.data.token,
                    role: response.data.data.role
                };
                localStorage.setItem("malik_book_user", JSON.stringify(userDetails));
                toast.success("Logged In Successfully!");
                navigate("/dashboard/");
            } else {
                toast.error(response.data?.message || "Login failed!");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error(error?.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };
    
    
    return (
        <>
        
            {/* {loading && "LOADING"} */}
            <div className="login-container">
                <div className="login-box">
                    <h1>Welcome to Malik CRM</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <span
                                    className="toggle-password"
                                    onClick={handleTogglePassword}
                                >
                                    {showPassword ? (
                                        <i className="fa fa-eye-slash" aria-hidden="true"></i>
                                    ) : (
                                        <i className="fa fa-eye" aria-hidden="true"></i>
                                    )}
                                </span>
                            </div>
                        </div>
                        <button type="submit" className="submit-button">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
