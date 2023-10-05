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
/*                        //SECTION - Get one product                         */
/* -------------------------------------------------------------------------- */
router.get('/one/:id', async (req, res, next) => {
    try {
        // Extract data from the request parameters.
        const {id} = req.params;

        // Check that the URL params are provided.
        if (id == ':id') {
            return res.status(400).json({ error: "No product ID provided."});
        }

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
        // Get shop id from .env
        const shop = process.env.SHOP_ID;

        // Retrieve all products from Printify.
        let product = await axiosRequest.get(`/shops/${shop}/products/${id}.json`)


        //FIXME - This will always eval to true since axios always returns a response object. 
        if (product) {
            return res.status(200).json(product.data);
        } else {
            return res.status(404).json({ error: "No product with provided ID exists."});
        }
    } catch (error) {
        console.log(error) //TODO - Replace with an error logger.
        // If there's an error, respond with a server error.
        return res.status(500).json({ error: "Something went wrong on our end. Please try again. "});
    }
});


module.exports = router;