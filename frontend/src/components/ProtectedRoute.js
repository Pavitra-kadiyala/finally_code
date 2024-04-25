import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../UserContext'; // Import the useUser hook

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useUser();

    if (!isLoggedIn()) {
        // User is not logged in, redirect to the login page
        return <Navigate to="/" replace />;
    }

    // User is logged in, render the children components
    return children;
};
export default ProtectedRoute;
