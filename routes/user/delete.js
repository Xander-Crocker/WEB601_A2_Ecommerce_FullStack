//SETUP - Modules
var express = require('express');
var router = express.Router();


//SETUP - Import Models
const User = require('../../models/user')


/* -------------------------------------------------------------------------- */
/*                          //SECTION - Delete User                           */
/* -------------------------------------------------------------------------- */
router.delete('/delete/:id', async (req, res, next) =>{
    try {    
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

        // Check if email or username exists in the database
        const existingUser = await User.findById(id);

        // Commented out for now as it interferes with postman testing.
        // Check for user in the database, if not found return an error code 404.
        console.log(existingUser)
        if (!existingUser) {
            return res.status(404).json({ error: `No user with that id could be found.` });
        }
        
        // Delete the user
        await User.findByIdAndDelete(id);

        // Return a success response
        return res.status(200).json({ message: `User ${existingUser.username} deleted successfully.` });

    } catch (error){
        console.log(error) //TODO - Replace with an error logger.
        // If there's an error, respond with a server error.
        return res.status(500).json({
            error: "Something went wrong on our end. Please try again. ",
        });
    }
});


module.exports = router;