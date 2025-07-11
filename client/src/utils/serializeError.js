const serializeError = (error, fallbackMessage = "Something went wrong") => {
    // format de erori http
    if (error?.response?.data?.error?.message) return error.response.data.error.message;

    // orice alt format
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;

    // Pentru string format
    if (typeof error === "string") return error;

    return fallbackMessage;
};

export default serializeError;