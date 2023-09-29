var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
