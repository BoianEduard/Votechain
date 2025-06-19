const ErrorMessage = ({ error }) => {
    const errorText = typeof error === 'string' ? error : error?.message || 'An unknown error occurred';

    return (
        <div className="text-red-600 bg-red-100 border border-red-200 rounded p-4 mb-4 text-center">
            {errorText}
        </div>
    );
};

export default ErrorMessage;