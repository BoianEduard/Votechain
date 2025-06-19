const LoadingSpinner = ({ message = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-indigo-600 font-medium text-sm">{message}</p>
        </div>
    );
};

export default LoadingSpinner;