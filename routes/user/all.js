//SETUP - Modules
var express = require('express');
var router = express.Router();


//SETUP - Import Models
const User = require('../../models/user')


/* -------------------------------------------------------------------------- */
/*                          //SECTION - Get all users                         */
/* -------------------------------------------------------------------------- */
router.get('/all', async (req, res, next) => {
    try {
        // Ensure there is a valid session and the user is properly authorised.
        if (req.session.user) {
            if (req.session.user.role !== 'admin') {
                return res.status(403).send({
                    message: 'You are not authorized to perform this action.',
                });
            }
        } else {
            return res.status(401).send({
                message: 'You are currently not authenticated.',
            });
        }

        // Retrieve all users from the database.
        let users = await User.find()

        // If users evaluates to true then there are users.
        if (users) {
            return res.status(200).json(users);
        } else {
            return res.status(404).json({ error: "No users exist."});
        }
    } catch (error) {
        console.log(error) //TODO - Replace with an error logger.
        // If there's an error, respond with a server error.
        return res.status(500).json({ error: "Something went wrong on our end. Please try again. "});
    }
});


module.exports = router;