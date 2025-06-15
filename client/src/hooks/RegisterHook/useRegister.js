import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authThunks from '../../redux/thunks/authThunks';

export const useRegister = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error: reduxError } = useSelector((state) => state.auth);

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const register = async (userData) => {
        const { email, password, firstName, lastName } = userData;

        setIsLoading(true);
        setError('');

        try {
            await dispatch(authThunks.registerUser({
                email,
                password,
                firstName,
                lastName
            }));

            navigate('/dashboard');
            return { success: true };
        } catch (err) {
            const errorMsg = reduxError || 'Registration failed. Please try again.';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError('');

    return {
        register,
        error,
        isLoading,
        clearError
    };
};