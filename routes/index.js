const express = require('express');
const router = express.Router();
const axios = require('axios').default;
base_url = process.env.SERVER_URL;

/* GET home page. */
router.get('/', async function(req, res, next) {
    let products = await axios.get(base_url.concat('api/product/all'));
    res.render('index', { products: products.data.data });
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
router.get('/dashboard/account', async function(req, res, next) {
    let user = await axios.get(base_url.concat('api/user/one/'.concat(req.session.user._id)));
    res.render('dashboard/account', { title: 'Account', user: user.data });
});

/* GET user orders page. */
router.get('/dashboard/orders', async function(req, res, next) {
    res.render('dashboard/orders', { title: 'Orders'});
});

/* GET user sales page. */
router.get('/dashboard/sales', async function(req, res, next) {
    res.render('dashboard/sales', { title: 'Sales'});
});

/* GET users page. */
router.get('/dashboard/users', async function(req, res, next) {
    res.render('dashboard/users', { title: 'Users'});
});

/* GET product details page. */
router.get('/product/:id', async function(req, res, next) {
    let product = await axios.get(base_url.concat('api/product/one/'.concat(req.params.id)));
    // console.log(product);
    res.render('product_details', { title: 'Product Details', product: product.data, rating: 4 });
});

/* GET billing page. */
router.get('/cart', async function(req, res, next) {
    let product = await axios.get(base_url.concat('api/product/all/'));
    res.render('cart', { title: 'Cart', product: product.data });
});

router.post('/cart', async function(req, res, next) {
    let products = await axios.get(base_url.concat('api/product/all/'));
    let cart = JSON.parse(req.body.cart);
    // let validatedCart = []
    // products.data.data.forEach(product => {
    //     let id;
    //     let size;
    //     let colour;
    //     let quantity;

    //     for (let i = 0; i < cart.length; i++) {
    //         if (product.id === cart[i].id) {
    //             id = product.id;
    //             quantity = cart[i].quantity;
    //             let sizes = product.options.find(option => option.name === 'Sizes');
    //             let colours = product.options.find(option => option.name === 'Colors');

    //             size = sizes.values.filter(size => size.title === cart[i].size);
    //             colour = colours.values.filter(colour => colour.title === cart[i].colour);
    //         }
    //     }

    //     if (id) {
    //         validatedCart.push({
    //             id: id,
    //             quantity: quantity,
    //             size: size[0],
    //             colour: colour[0]
    //         });
    //     }

    // });

    // console.log(validatedCart);

    let filteredProducts = products.data.data.filter(product => {
        for (let i = 0; i < cart.length; i++) {
            if (product.id === cart[i].id) {
                product.quantity = cart[i].quantity;
                return true;
            }
        }
    });
    console.log(filteredProducts);
    res.render('cart', { title: 'Cart', cart: filteredProducts});
});

/* GET success page. */
router.get('/success', function(req, res, next) {
    res.render('success', { title: 'Success' });
});

module.exports = router;



// let filteredProducts = products.data.data.filter(product => {
//     for (let i = 0; i < cart.length; i++) {
//         if (product.id === cart[i].id) {
//             product.quantity = cart[i].quantity;
//             return true;
//         }
//     }
// });