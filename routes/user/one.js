//SETUP - Modules
var express = require('express');
var router = express.Router();


//SETUP - Import Models
const User = require('../../models/user')


/* -------------------------------------------------------------------------- */
/*                          //SECTION - Get one user                          */
/* -------------------------------------------------------------------------- */
router.get('/one/:id', async (req, res, next) => {
    try {  
        // Extract data from the request parameters.
        const {id} = req.params;

        // Check that the URL params are provided.
        if (id == ':id') {
            return res.status(400).json({ error: "No user ID provided."});
        }

        // Ensure there is a valid session and the user is properly authorised.
        const originIsTrusted = process.env.TRUSTED_ORIGINS.includes(req.hostname) || process.env.TRUSTED_ORIGINS.includes(req.ip);
        if (!originIsTrusted) {
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
        }
        
        // Retrieve all users from the database.
        let user = await User.findById(id)

        // If users evaluates to true then there are users. 
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ error: "No user with provided ID exists."});
        }
    } catch (error) {
        console.log(error) //TODO - Replace with an error logger.
        // If there's an error, respond with a server error.
        return res.status(500).json({ error: "Something went wrong on our end. Please try again. "});
    }
});


module.exports = router;