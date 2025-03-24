import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../context/AuthContext';

const Protected = ({ Component }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Display loading while checking auth
    // console.log(isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/login" />; // Redirect to login if not authenticated
    }

    return <Component />; // Render the protected component if authenticated
};

export default Protected;
