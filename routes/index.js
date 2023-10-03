const express = require('express');
const router = express.Router();
const axios = require('axios').default;

/* GET home page. */
router.get('/', async function(req, res, next) {
    let products = await axios.get('http://localhost:443/api/product/all');
    res.render('index', { products: products.data.data });
});

/* GET login page. */
router.get('/login.ejs', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

/* GET sign up page. */
router.get('/signup.ejs', function(req, res, next) {
    res.render('signup', { title: 'Sign Up' });
});

/* GET user account page. */
router.get('/account.ejs', function(req, res, next) {
    res.render('account', { title: 'Account' });
});

/* GET product details page. */
router.get('/product_details.ejs', function(req, res, next) {
    res.render('product_details', { title: 'Product Details' });
});

/* GET billing page. */
router.get('/billing.ejs', function(req, res, next) {
    res.render('billing', { title: 'Billing' });
});

/* GET payment page. */
router.get('/payment.ejs', function(req, res, next) {
    res.render('payment', { title: 'Payment' });
});

/* GET confirmation page. */
router.get('/confirmation.ejs', function(req, res, next) {
    res.render('confirmation', { title: 'Confirmation' });
});

module.exports = router;
