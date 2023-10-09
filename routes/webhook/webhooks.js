require("dotenv").config();
const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);


// code template copied from https://dashboard.stripe.com/webhooks/create?events=checkout.session.completed - requires stripe account
router.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_TEST_KEY);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        // console.log(err.message);
        return;
    }

    // console.log(event);

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object;
            console.log(checkoutSessionCompleted);
                // Then define and call a function to handle the event checkout.session.completed
                // Use axios to send a request to the create order route
            break;

        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});

module.exports = router;