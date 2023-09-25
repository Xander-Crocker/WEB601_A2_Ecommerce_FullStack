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
router.delete('/user/delete/:id', async (req, res, next) =>{
    try {
        const {
            id,
        } = req.params;

        // Check if email or username exists in the database
        const existingUser = await User.findById(id);

        // Commented out for now as it interferes with postman testing.
        // Chech for user in the database, if not found return an error code 404.
        console.log(existingUser)
        if (!existingUser) {
            return res.status(404).json({ error: `No user with that id could be found.` });
        }
        
        // Delete the user
        await User.findOneAndDelete(id);

        // Return a success response
        return res.status(201).json({ message: `User ${existingUser.username} deleted successfully.` });
      
    } catch (error){
        // If there's an error, respond with a server error.
        console.log(error)
        return res.status(500).json({
            error: "Something went wrong on our end. Please try again. ",
        });
    }
});

/* -------------------------------------------------------------------------- */
/*                          //SECTION - Log User In                           */
/* -------------------------------------------------------------------------- */
router.post('/user/login', async (req, res, next) => { 
    try{
        const {
            username,
            password
        } = req.body;

        // Find the user in the database based on username input
        const existingUser = await User.findOne(username);

        // If the user is not found, return an error code 404.
        if (!existingUser) {
            console.log(existingUser)
            return res.status(404).json({ error: 'Invalid username or password.' });
        }

        // Compare the provided password with the hashed password in the database
        const match = await bcrypt.compare(password, existingUser.password, function(err, result){
            if(match){
                return res.status(200).json({ message: `User ${username} logged in successfully.` });
            } else {
                return res.status(404).json({ error: 'Invalid username or password.' });
            }
        });

    } catch (error) {
        // If there's an error, respond with a server error.
        return res.status(500).json({
            error: "Something went wrong on our end. Please try again. ",
        });
    }
});

module.exports = router;
