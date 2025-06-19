import React from 'react'
import { Outlet, Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthGuard = () => {
    const { isAuthenticated, isChecking } = useSelector(state => state.auth);

    if (isChecking) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthGuard;