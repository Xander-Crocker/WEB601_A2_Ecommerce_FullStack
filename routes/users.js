//SETUP - Modules
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');


//SETUP - Import Models
const User = require('../models/user')


//SETUP - Import Middlewares
const { registerUserValidation, handleValidationErrors } = require('../middlewares/validation');


//SETUP - Configure Middlewares
const saltRounds = 10;



/* -------------------------------------------------------------------------- */
/*                          //SECTION - Get all users                         */
/* -------------------------------------------------------------------------- */
router.get('/user/all', async (req, res, next) => {
    try {
        // Retrieve all users from the database.
        let users = await User.find()

        // If users evaluates to true then there are users.
        if (users) {
            return res.status(200).json(users);
        } else {
            return res.status(404).json({ error: "Not found. No users exist."});
        }
    } catch (error) {
        // If there's an error, respond with a server error.
        return res.status(500).json({ error: "Something went wrong on our end. Please try again. "});
    }
});



/* -------------------------------------------------------------------------- */
/*                          //SECTION - Register User                         */
/* -------------------------------------------------------------------------- */
router.post('/user/register', registerUserValidation, handleValidationErrors, async (req, res, next) => {
    try {
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
        await bcrypt.hash(password, saltRounds, async function(err, hash) {
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
                password: hash
            });
    
            // Save the user document to the database
            await user.save();
    
            // Return a success response
            return res.status(201).json({ message: 'User registration successful.' });
        });
    } catch (error) {
        // If there's an error, respond with a server error.
        // console.log(error)
        return res.status(500).json({ 
            error: "Something went wrong on our end. Please try again. ",
        });
    };
});

/* -------------------------------------------------------------------------- */
/*                          //SECTION - Delete User                           */
/* -------------------------------------------------------------------------- */
router.delete('/user/delete/:username', async (req, res, next) =>{
    try {
        const {
            username,
        } = req.params;

        // Check if email or username exists in the database
        const existingUser = await User.findOne({ username });

        // Chech for user in the DB
        if (!existingUser) {
            return res.status(404).json({ error: `User ${username} not found.` });
        }
        
        // Delete the user
        await User.findOneAndDelete({ username });

        // Return a success response
        return res.status(201).json({ message: `User ${username} deleted successfully.` });
      
    } catch (error){
        // If there's an error, respond with a server error.
        return res.status(500).json({
            error: "Something went wrong on our end. Please try again. ",
        });
    }
});


module.exports = router;
