const express = require('express');
const router = express.Router();
const axios = require('axios').default;

/* GET home page. */
router.get('/', async function(req, res, next) {
    let products = await axios.get('http://localhost:443/api/product/all');
    res.render('index', { products: products.data.data });
    console.log(req.session)
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

/* GET sign up page. */
router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'Sign Up' });
});

/* GET user account page. */
router.get('/account', async function(req, res, next) {
    let user = await axios.get('http://localhost:443/api/user/one/'.concat(req.session.user._id));
    res.render('account', { title: 'Account', user: user.data });
});

/* GET product details page. */
router.get('/product/:id', async function(req, res, next) {
    let product = await axios.get('http://localhost:443/api/product/one/'.concat(req.params.id));
    // console.log(product);
    res.render('product_details', { title: 'Product Details', product: product.data, rating: 4 });
});

/* GET billing page. */
router.get('/cart', function(req, res, next) {
    res.render('cart', { title: 'Cart' });
});

/* GET success page. */
router.get('/success', function(req, res, next) {
    res.render('success', { title: 'Success' });
});

module.exports = router;
