function addToCart() {
    // Placeholder values (replace with actual values from your page)
    const productID = document.getElementById("id").innerText;
    const quantity = document.getElementById("quantity").value;

    // Get all the radio buttons on the page
    const radios = document.querySelectorAll('input[type="radio"]');

    // Create an object to store the selected values
    const selectedValues = {};

    // Loop through each radio button
    radios.forEach(radio => {
        // Get the group name from the radio button's name attribute
        const groupName = radio.name;

        // Get the selected value if the radio button is checked
        if (radio.checked) {
            const selectedValue = radio.value;

            // Add the selected value to the object using the group name as the property name
            selectedValues[groupName] = selectedValue;
        }
    });



    
    // Get the current cart items from local storage or initialize an empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Add the selected product to the cart
    const product = {
        id: productID,
        quantity: quantity,
        options: selectedValues
    };
    console.log(product);

    cart.push(product);

    // Update the cart in local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Provide feedback to the user (you can customize this)
    alert(`Item added to the cart.`);
}

// Add a click event listener to the "Add to Cart" button
document.getElementById("add_to_cart").addEventListener("click", addToCart);