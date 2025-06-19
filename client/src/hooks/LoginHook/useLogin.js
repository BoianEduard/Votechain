import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authThunks from '../../redux/thunks/authThunks';

export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { errorMessage } = useSelector((state) => state.auth);

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const login = async (credentials) => {
        const { email, password } = credentials;

        if (!email || !password) {
            setError('Please enter your email and password!');
            return { success: false };
        }

        setIsLoading(true);
        setError('');

        try {
            await dispatch(authThunks.loginUser({ email, password }));
            navigate('/dashboard');
            return { success: true };
        } catch (err) {
            const errorMsg = errorMessage || 'Login failed. Please try again.';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError('');

    return {
        login,
        error,
        isLoading,
        clearError
    };
};