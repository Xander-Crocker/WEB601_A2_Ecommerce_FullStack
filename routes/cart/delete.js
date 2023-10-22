//SETUP - Modules
var express = require("express");
var router = express.Router();

const Cart = require('../../models/cart');

//SETUP - Import Middlewares
const { validate, handleValidationErrors, idOnlySchema } = require("../../middlewares/validation");
const { matchedData, checkSchema} = require("express-validator");


/* -------------------------------------------------------------------------- */
/*                          //SECTION - Update Cart                           */
/* -------------------------------------------------------------------------- */
router.delete(
    "/delete/:id",
    validate(checkSchema(idOnlySchema)),
    handleValidationErrors,
    async (req, res, next) => {
        try {
            // Extract data from the validated data.
            const data = matchedData(req);
            
            await Cart.findByIdAndDelete(data.id).then((response) => {
                res.status(200).json({
                    message: "Cart successfully deleted.",
                });
            }).catch((err) => {
                console.log(err);
                return res.status(404).json({
                    error: "Cart does not exist",
                });
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
