//SETUP - Modules
const express = require('express');
const axios = require('axios').default;
const router = express.Router();


const axiosRequest = axios.create({
    baseURL: 'https://api.printify.com/v1', // Replace with your API's base URL
    headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_TOKEN}`,
        //'Content-Type': 'application/json', // Adjust the content type if needed
    },
});
/* -------------------------------------------------------------------------- */
/*                        //SECTION - Get all products                        */
/* -------------------------------------------------------------------------- */
router.get('/all', async (req, res, next) => {
    try {
        // Ensure there is a valid session and the user is properly authorised.
        const originIsTrusted = process.env.TRUSTED_ORIGINS.includes(req.hostname) || process.env.TRUSTED_ORIGINS.includes(req.ip);
        if (!originIsTrusted) {
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
        }

        // Retrieve all products from Printify.
        let products = await axiosRequest.get('/shops/11988834/products.json')
        // If users evaluates to true then there are users.
        if (products.data) {
            return res.status(200).json(products.data);
        } else {
            return res.status(404).json({ error: "No products founds."});
        }
    } catch (error) {
        console.log(error) //TODO - Replace with an error logger.
        // If there's an error, respond with a server error.
        return res.status(500).json({ error: "Something went wrong on our end. Please try again. "});
    }
});


module.exports = router;