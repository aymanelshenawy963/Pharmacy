export const parseApiError = (error) => {
    if (!error) return ["Something unexpected happened. Please try again."];

    // Handle Network / Connection Errors
    if (error.message && error.message.toLowerCase().includes('network')) {
        return ["Unable to connect to the server. Please check your internet connection."];
    }

    // Handle Validation errors (Status 400 with validationErrors object)
    if (error.status === 400 && error.validationErrors) {
        const parsedErrors = [];
        Object.values(error.validationErrors).forEach(errArray => {
            if (Array.isArray(errArray)) {
                errArray.forEach(err => {
                    parsedErrors.push(err);
                });
            } else if (typeof errArray === 'string') {
                parsedErrors.push(errArray);
            }
        });
        
        if (parsedErrors.length > 0) {
            return parsedErrors;
        }
    }

    // Use the actual error message from the server if available
    if (error.message && !error.message.startsWith('HTTP ')) {
        return [error.message];
    }

    // Default HTTP Status messages fallback
    switch (error.status) {
        case 400: return ["Please check the information you entered."];
        case 401: return ["Incorrect email or password."];
        case 403: return ["You don't have permission to perform this action."];
        case 404: return ["The requested resource was not found."];
        case 409: return ["An account with this information already exists."];
        case 429: return ["Too many requests. Please try again later."];
        case 500: return ["Something went wrong. Please try again later."];
        default: break;
    }

    return ["Something unexpected happened. Please try again."];
};
