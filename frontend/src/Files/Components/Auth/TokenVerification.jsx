import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { APIKEY, CHECK_TOKEN_VALIDITY } from "../../../api";

function TokenVerification({ setIsLoggedIn }) {
    const navigate = useNavigate();

    useEffect(() => {
        const validateUser = async () => {
    
            let userDetails;
            try {
                userDetails = JSON.parse(localStorage.getItem("partsklik_crm_user"));
            } catch {
                userDetails = null;
            }
    
            if (!userDetails || !userDetails.token || !userDetails.user_id || !userDetails.user_role || !userDetails.username) {
                // console.log("Invalid user details");
                if (setIsLoggedIn) setIsLoggedIn(false);
                navigate("/login");
                return;
            }
    
            try {
                const headers = {
                    "content-type": "application/json",
                    "API-Key": APIKEY,
                };
    
                const payload = {
                    user_id: userDetails.user_id,
                    token: userDetails.token,
                };
    
                const response = await axios.post(CHECK_TOKEN_VALIDITY, payload, {
                    headers,
                });
    
                if (response.data.status === 0) {
                    // console.log("Token invalid");
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
