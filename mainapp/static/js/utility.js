function utility() {
    const signOut = document.getElementById('sign-out');
    const flashMsg = document.getElementById('flash-msg')
    const password = document.getElementById('signup-password');
    const passwordConfirm = document.getElementById('signup-confirm-password');


    // flash msg in flask
    if (flashMsg) {
        setTimeout(() => {
            flashMsg.style.display = 'none';
        }, 2000)
    }


    //for not working feature alert
    const notWorkingElem = document.querySelectorAll('#not-working')
    notWorkingElem.forEach(elem => {
        elem.addEventListener('click', () => {
            alert("I'll be working in this feature soon. Thanks!");
        })
    })


    // password effect when invalid
    passwordConfirm.addEventListener('input', (e) => {
        if (password.value != e.target.value && e.target.value != '') {
            e.target.classList.remove('auth-input')
            e.target.classList.add('auth-input-invalid')
        } else {
            e.target.classList.remove('auth-input-invalid')
            e.target.classList.add('auth-input')
        }
    })    
}



document.addEventListener('DOMContentLoaded', utility())