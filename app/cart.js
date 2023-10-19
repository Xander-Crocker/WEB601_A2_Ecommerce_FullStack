document.getElementById('pay_btn').addEventListener('click', async() => {
   
    await fetch('api/cart/create-checkout-session', {
        method: 'GET'
    }).then((response) => {
        console.log(response);
        if (response.status === 200) {
            response.json().then((data) => {
                window.location.href = data.url;
            });
        } else {
            alert('Failed to create checkout session.');
        }
    }).catch((error) => {
        console.error('Error:', error);
    });

});