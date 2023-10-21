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

/* GET cart page. */
router.get('/cart', async function(req, res, next) {
    await axios.get(base_url.concat('api/cart/one/'.concat(req.session.cart))).then((cart) => {
        // console.log(cart.data.cart);
        if (cart.data.cart.length === 0 || !cart.data.cart) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        res.render('cart', { title: 'Cart', cart: cart.data.cart });
    }).catch((error) => {
        console.log(error);
        res.render('cart', { title: 'Cart', cart: {} });
    });
});

// router.post('/cart', async function(req, res, next) {
//     try {
//         //TODO - Extract logic to a internal processing route.
//         let products = await axios.get(base_url.concat('api/product/all/'));
//         let cart = JSON.parse(req.body.cart);
//         if (!cart || cart.length === 0) {
//             return res.status(400).json({ error: 'Cart is empty' });
//         }
    
//         // for each item in the cart
//         // I need to create the variant name from the cart options
//         // then I need to find the variant in the product
//         // then i need to add the variant id, image, and price to the cart item
    
//         let newCart = [];
    
//         for (let i = 0; i < cart.length; i++) {
    
//             let product = products.data.data.find(p => p.id === cart[i].id);
//             // console.log(cart[i]);
    
//             let optionKeys = Object.keys(cart[i].options)
//             // console.log(optionKeys, optionKeys[0], optionKeys[1])
    
//             let variantName = String(`${cart[i].options[optionKeys[0]]} / ${cart[i].options[optionKeys[1]]}`);
//             // console.log(variantName);
    
//             if (product) {
//                 let variant = product.variants.find(v => v.title === variantName);
    
//                 // console.log(variantName, variant);
//                 if (variant) {
//                     let image = product.images.find(image => image.position === 'front' && image.variant_ids.includes(variant.id));
    
//                     newCart.push({
//                         id: product.id,
//                         variantId: variant.id,
//                         title: product.title,
//                         variantName: variantName,
//                         price: variant.price,
//                         quantity: cart[i].quantity,
//                         image: image
//                     });
//                 }
//             }
//         };
    
//         console.log(newCart);
//         res.render('cart', { title: 'Cart', cart: newCart });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });



/* GET success page. */
router.get('/success', function(req, res, next) {
    res.render('success', { title: 'Success' });
});

module.exports = router;