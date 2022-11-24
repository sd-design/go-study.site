console.log('%c Pwd part', 'background: #222; color: #bada55; padding:15px')

const loginForm = document.getElementById("loginForm")
const inputLogin = document.getElementById("inputLogin")
const inputPwd = document.getElementById("inputPwd")
const submitBtn = document.getElementById("submitBtn")

const errorModal = document.getElementById("modal-error")
const sendData = () => {

    UIkit.modal(errorModal).show();
}
const showAlert = (text, e)=>{
    e.preventDefault();
    e.target.blur();
    UIkit.modal.alert(text).then(function () {
        console.log('Error: 400')
    });
}
submitBtn.addEventListener('click',sendData)

