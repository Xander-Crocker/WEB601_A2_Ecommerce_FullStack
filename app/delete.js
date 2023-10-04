
// Delete user account (on click event)
document.getElementById('delete-account').addEventListener('click', async() => {
    // Get user info from db 
    const usernameId = document.getElementById('username-input').value;

    // Send delete request to endpoint containing user data
    const response = await fetch('/api/user/delete/'.concat(usernameId), {
        method: "DELETE",
    });    

    if (response.status === 200 && response.ok === true) {
        alert('Account deleted successfully.')
        window.location.replace('http://localhost:443')
    }
})   

