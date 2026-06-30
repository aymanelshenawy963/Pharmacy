export function parseZodError(error) {
    const fieldErrors = {};
    error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field && !fieldErrors[field]) {
            fieldErrors[field] = issue.message;
        }
    });
    return fieldErrors;
}
