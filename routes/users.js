//SETUP - Modules
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;


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
            return res.status(404).json({ error: "No users exist."});
        }
    } catch (error) {
        // If there's an error, respond with a server error.
        return res.status(500).json({ error: "Something went wrong on our end. Please try again. "});
    }
});

/* -------------------------------------------------------------------------- */
/*                          //SECTION - Get one user                          */
/* -------------------------------------------------------------------------- */
router.get('/user/one/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        if (id == ':id') {
            return res.status(400).json({ error: "No user ID provided."});
        }
        console.log(id);
        // Retrieve all users from the database.
        let user = await User.findById(id)

        // If users evaluates to true then there are users. 
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ error: "No user with provided ID exists."});
        }
    } catch (error) {
        console.log(error);
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
                role: 'customer'
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

        if (id == ':id') {
            return res.status(400).json({ error: "No user ID provided."});
        }
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
        return res.status(200).json({ message: `User ${existingUser.username} deleted successfully.` });

    } catch (error){
        // If there's an error, respond with a server error.
        console.log(error)
        return res.status(500).json({
            error: "Something went wrong on our end. Please try again. ",
        });
    }
});


/* -------------------------------------------------------------------------- */
/*                          //SECTION - LogIn                                 */
/* -------------------------------------------------------------------------- */
router.post('/user/login', async (req, res, next) => { 
    try{
        const {
            username,
            password
        } = req.body;

        // Find the user in the database based on username input
        const user = await User.findOne({username: username});

        // If the user is not found, return an error code 404.
        if (user) {
            
            // Compare the provided password with the hashed password in the database
            bcrypt.compare(password, user.password, function(err, result){
                if (err) {
                    console.log(err);
                }

                if(result){
                    // Create a session for the user upon successful login                    
                    req.session.user = { _id: user._id.toString(), role: user.role };

                    
                    return res.status(200).json({
                        message: `User ${username} logged in successfully.`
                    });
                } else {
                    return res.status(404).json({ error: 'Invalid username or password.' });
                }


            });

        } else {
            return res.status(404).json({ error: 'Invalid username or password.' });
        }
    } catch (error) {
        // If there's an error, respond with a server error.
        return res.status(500).json({
            error: "Something went wrong on our end. Please try again. ",
        });
}});
      
  
/* -------------------------------------------------------------------------- */    
/*                         //SECTION - Update user                            */
/* -------------------------------------------------------------------------- */

router.put('/user/update/:id',  async (req, res) => {
    try {
        const {
            password
        } = req.body;
        
        const {id} = req.params;
        if (id == ':id') {
            return res.status(400).json({ error: "No user ID provided."});
        }

        if (!req.session) {
            if (req.session.user.role !== 'admin' && id !== req.session.user._id.toString()) {
                // Check if the user is authorized to perform this action
                return res.status(400).send({
                    message: 'You are not authorized to perform this action.',
                });
            }
        }

        
        // Hash and salt the password, then store in database.
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            if (err) {
                console.log(err);
            }

            // update the users password to the database
            User.updateOne({ _id: req.params.id }, 
            { password: hash }).then(result => {
                if (result.matchedCount = 0) {
                    return res.status(404).send({
                        message: 'Document not found.'
                    });
                } else if (result.modifiedCount = 0) {
                    return res.status(500).send({ error: 'Document found, but could not be updated.' });
                } else {
                    return res.status(201).send({
                        message: 'User password changed successfully.'
                    });
                }
        });
    });

    } catch (error) {
        // If there's an error, respond with an error message
        console.log(error);
        return res.status(500).send({ error: 'Something went wrong. Please try again.' });

    }
});

/* -------------------------------------------------------------------------- */
/*                             //SECTION - Logout                             */
/* -------------------------------------------------------------------------- */
router.get('/user/logout', (req, res) => {
    try {
        // Clear the user's session
        req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed.' });
        } else {
            return res.status(200).json({ message: 'Logout successful.' });
        }
        });
    } catch (error) {
        // If there's an error, respond with a server error.
        console.error('Logout error:', error);
        return res.status(500).json({ error: 'Something went wrong on our end. Please try again.' });
    }
});

module.exports = router;