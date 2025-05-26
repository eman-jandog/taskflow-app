function utility() {
    const signOut = document.getElementById('sign-out');
    const flashMsg = document.getElementById('flash-msg')

    setTimeout(() => {
        flashMsg.style.display = 'none';
    }, 2000)
    
    signOut.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.setItem('isLoggedIn', 'false');
        showSigninPage();
    });
}

document.addEventListener('DOMContentLoaded', utility())