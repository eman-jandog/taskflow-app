document.addEventListener('DOMContentLoaded', function() {
    // Page navigation
    const signinPage = document.getElementById('signin-page');
    const signupPage = document.getElementById('signup-page');
    const goToSignup = document.getElementById('go-to-signup');
    const goToSignin = document.getElementById('go-to-signin');
    
    goToSignup.addEventListener('click', function(e) {
        e.preventDefault();
        showSignupPage();
    });
    
    goToSignin.addEventListener('click', function(e) {
        e.preventDefault();
        showSigninPage();
    });
    
    function showSigninPage() {
        signinPage.style.display = 'block';
        signupPage.style.display = 'none';
    }
    
    function showSignupPage() {
        signinPage.style.display = 'none';
        signupPage.style.display = 'block';
    }

    
});