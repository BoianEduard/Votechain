const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    const code = err.code || null; // optional, dacă ai coduri custom

    res.status(statusCode).json({
        error: {
            message,
            status: statusCode,
            code,
        },
    });
};

export default errorMiddleware;
