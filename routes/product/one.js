//SETUP - Modules
const express = require('express');
const axios = require('axios').default;
const router = express.Router();

//SETUP - Import Middlewares
const { idOnlySchema, handleValidationErrors, validate } = require('../../middlewares/validation');
const { matchedData, checkSchema } = require('express-validator');
const authorizeRoles = require('../../middlewares/auth')


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
router.get(
    '/one/:id',
    authorizeRoles(['admin']),
    validate(checkSchema(idOnlySchema)),
    handleValidationErrors,
    async (req, res, next) => {
        try {            
            // Extract data from the validated data.
            const data = matchedData(req);
            const {id} = data;

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
            // If there's an error, respond with a server error.
            return res.status(500).json({ error: "Something went wrong on our end. Please try again. "});
        }
    }
);


module.exports = router;