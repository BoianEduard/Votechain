import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../Commons/LoadingSpinner';
import ErrorCard from '../Commons/Error';
import authThunks from '../../redux/thunks/authThunks';

const LogoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const performLogout = async () => {
            try {
                await dispatch(authThunks.logoutUser());
                navigate('/login', { replace: true });
            } catch (err) {
                setError("Failed to logout. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        performLogout();
    }, [dispatch, navigate]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorCard message={error} />;

    return null;
};

export default LogoutPage;