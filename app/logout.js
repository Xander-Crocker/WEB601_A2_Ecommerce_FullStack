
// Logout user (on click event)
document.getElementById('logout').addEventListener('click', async() => {
    // Send get request to logout endpoint
    const response = await fetch('/api/user/logout', {
        method: "GET",
    });

    if (response.status === 200 && response.ok === true) {
        alert('Logout successful.')
        window.location.replace('http://localhost:443')
    }
})