//SETUP - Modules
var express = require("express");
var router = express.Router();
const axios = require('axios').default;


//SETUP - Import Middlewares
const { validate, handleValidationErrors } = require("../../middlewares/validation");
const { matchedData, checkSchema } = require("express-validator");
const authorise = require('../../middlewares/auth')

//SETUP - Configure Middlewares
const axiosRequest = axios.create({
    baseURL: 'https://api.printify.com/v1', // Replace with your API's base URL
    headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_TOKEN}`,
        //'Content-Type': 'application/json', // Adjust the content type if needed
    },
});

/* -------------------------------------------------------------------------- */
/*                        //SECTION - Get All Orders                          */
/* -------------------------------------------------------------------------- */
router.get(
    "/all",
    authorise(['admin', 'customer']),
    // validate(checkSchema()),
    // handleValidationErrors,
    async (req, res, next) => {
        try {
            //TODO - Add email query param to filter orders by email for customers.
            //TODO - create a validation schema for this route.
            // Extract data from the validated data.
            // const data = matchedData(req);
            // console.log(data);
            // console.log(req.body);

            // Get shop id from .env
            const shop = process.env.SHOP_ID;

            await axiosRequest.get(`/shops/${shop}/orders.json`).then((response) => {
                console.log(response.data);
                return res.status(200).json(response.data);
            }).catch((error) => {
                console.log(error);
                return res.status(400).json({ error: "Unable to retrieve orders. Please try again."});
            });
        } catch (error) {
            // If there's an error, respond with a server error.
            console.log(error);
            return res.status(500).json({
                error: "Something went wrong on our end. Please try again. ",
            });
        }
    }
);

module.exports = router;
