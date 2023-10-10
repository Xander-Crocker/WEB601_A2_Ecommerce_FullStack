
// Logout user (on click event)
document.getElementById('cart-btn').addEventListener('click', async() => {
    // Get the cart object
    const cart = localStorage.getItem("cart");
    console.log(cart);
    // Send get request to logout endpoint
    const response = await fetch('/cart', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({cart: cart})
    });

    document.open();
    document.write(await response.text());
    document.close();
    
    // Use pushState to modify the URL
    const newURL = '/cart';
    history.pushState({ path: newURL }, '', newURL);
})