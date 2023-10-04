//SETUP - Modules
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');


//SETUP - Import Models
const User = require('../../models/user')


//SETUP - Import Middlewares
const { validateUpdate, handleValidationErrors } = require('../../middlewares/validation');


//SETUP - Configure Middlewares
const saltRounds = 10;


/* -------------------------------------------------------------------------- */    
/*                         //SECTION - Update user                            */
/* -------------------------------------------------------------------------- */
router.put('/update/:id', validateUpdate, handleValidationErrors, async (req, res) => {
    try {
        // Extract data from the request body.
        const {
            password
        } = req.body;
        
        // Extract data from the request parameters.
        const {id} = req.params;

        // Check that the URL params are provided.
        if (id == ':id') {
            return res.status(400).json({ error: "No user ID provided."});
        }


        // Ensure there is a valid session and the user is properly authorised.
        if (req.session.user) {
            if (req.session.user.role !== 'admin' && id !== req.session.user._id.toString()) {
                return res.status(403).send({
                    message: 'You are not authorized to perform this action.',
                });
            }
        } else {
            return res.status(401).send({
                message: 'You are currently not authenticated.',
            });
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
        console.log(error) //TODO - Replace with an error logger.
        // If there's an error, respond with an error message
        return res.status(500).send({ error: 'Something went wrong. Please try again.' });
    }
});


module.exports = router;