const serializeError = (error, fallbackMessage = "Something went wrong") => {
    // Pentru erori HTTP
    if (error?.response?.data?.error?.message) return error.response.data.error.message;

    // Alte formate posibile
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;

    // Pentru string format
    if (typeof error === "string") return error;

    return fallbackMessage;
};

export default serializeError;