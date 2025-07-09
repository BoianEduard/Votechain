const SuccessMessage = ({ message }) => {
    const successText = typeof message === 'string' ? message : 'Operation completed successfully!';

    return (
        <div className="text-green-700 bg-green-100 border border-green-200 rounded p-3 mb-0 text-center">
            {successText}
        </div>
    );
};

export default SuccessMessage;