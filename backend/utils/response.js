exports.successResponse = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

exports.errorResponse = (res, message, errors = null, statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};
