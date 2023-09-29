const { body, validationResult } = require('express-validator');

// Express-validator middleware chain for validating and sanitizing register inputs
const validateRegister = [
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
        .notEmpty()
        .isEmail()
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .trim()
        .escape(),
];


const validateUpdate = [
    body('password')
        .notEmpty()
        .trim()
        .escape()
];


const validateLogin = [
    body('username')
        .notEmpty()
        .trim()
        .escape(),

    body('password')
        .notEmpty()
        .trim()
        .escape()
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
    validateRegister,
    validateUpdate,
    validateLogin,
    handleValidationErrors,
};