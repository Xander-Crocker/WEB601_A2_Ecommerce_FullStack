//SETUP - Modules
var express = require('express');
var router = express.Router();


/* -------------------------------------------------------------------------- */
/*                             //SECTION - Logout                             */
/* -------------------------------------------------------------------------- */
router.get('/logout', (req, res) => {
    try {
        // Ensure there is an existing session.
        if (req.session.user) {
            // Clear the user's session
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ error: 'Logout failed.' });
                } else {
                    return res.status(200).json({ message: 'Logout successful.' });
                }
            });
        } else {
            return res.status(401).send({
                message: 'You are currently not authenticated.',
            });
        }
    } catch (error) {
        console.log(error) //TODO - Replace with an error logger.
        // If there's an error, respond with a server error.
        return res.status(500).json({ error: 'Something went wrong on our end. Please try again.' });
    }
});


module.exports = router;