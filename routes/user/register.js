//SETUP - Modules
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');


//SETUP - Import Models
const User = require('../../models/user')


//SETUP - Import Middlewares
const { validateRegister, handleValidationErrors } = require('../../middlewares/validation');


//SETUP - Configure Middlewares
const saltRounds = 10;


/* -------------------------------------------------------------------------- */
/*                          //SECTION - Register User                         */
/* -------------------------------------------------------------------------- */
router.post('/register', validateRegister, handleValidationErrors, async (req, res, next) => {
    try {
        // Extract data from the request body.
        const {
            username,
            given_name,
            family_name,
            email,
            password
        } = req.body;

        //TODO - Extract this logic to a new route and use axios to reference it.
        // Check if email or username exists in the database
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });
        
        if (existingUser) {
            // Either email or username is already in use
            const message =
                existingUser.email === email
                ? 'Email is already in use.'
                : 'Username is already in use.';
            return res.status(409).json({ error: message });
        }

        // Hash and salt the password, then store to database.
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            //TODO Return an api error.
            if (err) {
                console.log(err);
            }
            
            // create a user document
            const user = new User({
                username,
                given_name,
                family_name,
                email,
                password: hash,
                role: 'customer' //NOTE - Only allows customer registration.
            });
    
            // Save the user document to the database
            await user.save();
    
            // Return a success response
            return res.status(201).json({ message: 'User registration successful.' });
        });
    } catch (error) {
        console.log(error) //TODO - Replace with an error logger.
        // If there's an error, respond with a server error.
        return res.status(500).json({ 
            error: "Something went wrong on our end. Please try again. ",
        });
    };
});


module.exports = router;