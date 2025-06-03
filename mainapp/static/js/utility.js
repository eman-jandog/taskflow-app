function utility() {
    const signOut = document.getElementById('sign-out');
    const flashMsg = document.getElementById('flash-msg')

    if (flashMsg) {
        setTimeout(() => {
            flashMsg.style.display = 'none';
        }, 2000)
    }

    const notWorkingElem = document.querySelectorAll('#not-working')
    notWorkingElem.forEach(elem => {
        elem.addEventListener('click', () => {
            alert("I'll be working in this feature soon. Thanks!");
        })
    })
}



document.addEventListener('DOMContentLoaded', utility())