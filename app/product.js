function addToCart() {
    // Placeholder values (replace with actual values from your page)
    const productID = document.getElementById("id").innerText;
    const quantity = document.getElementById("quantity").value;

    // Get the current cart items from local storage or initialize an empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Add the selected product to the cart
    const product = {
        id: productID,
        quantity: quantity,
    };

    cart.push(product);

    // Update the cart in local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Provide feedback to the user (you can customize this)
    alert(`Item added to the cart.`);
}

// Add a click event listener to the "Add to Cart" button
document.getElementById("add_to_cart").addEventListener("click", addToCart);