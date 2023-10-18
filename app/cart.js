
document.getElementById('cart-btn').addEventListener('click', async() => {
    // Get the cart object
    const cart = localStorage.getItem("cart");
    // console.log(cart);
    // Send get request to logout endpoint
    const response = await fetch('/cart', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({cart: cart})
    });

    if (response.status !== 200) {
        console.log(response);
        response.json().then(data => {
            if (data.error) {
                alert(data.error);
            }
        }).catch(err => {
            console.log(err);
            alert("An error occurred");
        });
    } else {
        document.open();
        document.write(await response.text());
        document.close();
        
        // Use pushState to modify the URL
        const newURL = '/cart';
        history.pushState({ path: newURL }, '', newURL);
    }

})