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
router.get('/account.ejs', async function(req, res, next) {
    let user = await axios.get('http://localhost:443/api/user/one/'.concat(req.session.user._id));
    res.render('account', { title: 'Account', user: user.data });
});

/* GET product details page. */
router.get('/product/:id', async function(req, res, next) {
    let product = await axios.get('http://localhost:443/api/product/one/'.concat(req.params.id));
    res.render('product_details', { title: 'Product Details', product: product.data.data });
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
