import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {  CHECK_TOKEN_VALIDITY } from "../../../api";

function TokenVerification({ setIsLoggedIn }) {
    const navigate = useNavigate();

    useEffect(() => {
        const validateUser = async () => {
    
            let userDetails;
            try {
                userDetails = JSON.parse(localStorage.getItem("malik_book_user"));
            } catch {
                userDetails = null;
            }
    
            if (!userDetails || !userDetails.token || !userDetails.id || !userDetails.role || !userDetails.name) {
                
                if (setIsLoggedIn) setIsLoggedIn(false);
                navigate("/login");
                return;
            }
    
            try {
                const headers = {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${userDetails.token}`, 
                    "Authorization": `Barear ${userDetails.token}`, 
                };
                // console.log("userDetails.token : ",userDetails.token);
                const response = await axios.post(CHECK_TOKEN_VALIDITY, {}, { headers });
    
                if (response.data.status === 0) {
                    console.log("Token invalid");
                    if (setIsLoggedIn) setIsLoggedIn(false);
                    navigate("/login");
                } else {
                    // console.log("Token valid");
                    if (setIsLoggedIn) setIsLoggedIn(true);
                }
            } catch (error) {
                // console.error("Error validating user:", error);
                if (setIsLoggedIn) setIsLoggedIn(false);
                navigate("/login");
            }
        };
    
        validateUser();
    }, [navigate, setIsLoggedIn]);
    

    return null;
}

export default TokenVerification;
