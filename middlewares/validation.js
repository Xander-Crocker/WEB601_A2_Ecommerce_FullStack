const { body, validationResult } = require('express-validator');

// Express-validator middleware chain for validating and sanitizing register inputs
const registerUserValidation = [
    body('username')
        .notEmpty()
        .trim()
        .escape(),

    body('given_name')
        .notEmpty()
        .trim()
        .escape(),

    body('family_name')
        .notEmpty()
        .trim()
        .escape(),

    body('email')
        .isEmail()
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .trim()
        .escape(),
];

// Middleware function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};


// add any validators that need exporting
module.exports = {
    registerUserValidation,
    handleValidationErrors,
};