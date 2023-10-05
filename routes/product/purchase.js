const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
require("dotenv").config();

router.post("/create-checkout-session", async (req, res) => {
    try {
        console.log(req.body);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.items.map(item => {
                return {
                    price_data: {
                        currency: "nzd",
                        product_data: {
                            name: item.name,
                            images: [item.image]
                        },
                        unit_amount: item.price,
                    },
                    quantity: item.quantity,
                }
            }),
            success_url: `${process.env.SERVER_URL}/success.html`,
            cancel_url: `${process.env.SERVER_URL}/cancel.html`,
        })
        res.json({ url: session.url })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router;