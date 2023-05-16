console.log('%c Pwd Admin part', 'background: #222; color: #bada55; padding:15px')


const inputLogin = document.getElementById("inputLogin")
const inputPwd = document.getElementById("inputPwd")
const submitBtn = document.getElementById("submitBtn")
const loginPano = document.getElementById("loginPano")
const listWrapper = document.getElementById("listWrapper")
// const loadBtn = document.getElementById("loadBtn")
const logOutBtn = document.getElementById("logOut")
const uploadModal = document.getElementById("uploadModal")
const openModalBtn = document.getElementById("openModalBtn")
const formWrapper = document.getElementById("formWrapper")
const btnCopy = document.getElementById("btnCopy")

let url = window.location.href
let domain = (new URL(url)).hostname
let siteUrl = 'https://api.go-study.space/'
if(domain == 'localhost'){
    siteUrl = 'http://localhost:4200/'
}

const initLogin = () => {
    if(localStorage.token && localStorage.device){
        createDashboard()
        return true
    }
}

const logOut = () => {
    fetch(siteUrl+"auth/logout",{
        method: 'GET',
        headers: {
            'authorization-token': localStorage.token,
            'device-id': localStorage.device,
            'Content-Type': 'application/json'
        }
    }).then((data) => data.json())
        .then((data) => {
            if(data.response == true){
                delete localStorage.token;
                delete localStorage.device;
                document.location.href = "/admin"
            }
            else{
                showAlert('<div class="uk-alert-danger" uk-alert>Server error</div>', 400)
            }
        })


}



const createDashboard = () => {
    logOutBtn.classList.remove('disabled')
    listWrapper.classList.remove('disabled')
    loginPano.remove()
}



function sendData(data = {}) {
    //console.log("sendData func")
    let login = inputLogin.value
    let pwd = inputPwd.value
    let formBody = "login="+login+ "&pwd="+pwd
    fetch(siteUrl+"auth/login",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody,
  }).then((data) => data.json())
        .then((data) => {
            console.log(data.response);
            if(data.response == true){
                localStorage.token = data.token
                localStorage.device = data.device
                showAlert('Welcome to Dashboard', 200)
                document.location.href = "/admin"
            }
            if(data.response == false){
                showAlert('<div class="uk-alert-danger" uk-alert>Authorization Error</div>', 400)
            }
        }).catch(function() {
        showAlert('<div class="uk-alert-danger" uk-alert>Server Error</div>', 400)
    });

}



const showAlert = (text, code)=>{

    UIkit.modal.alert(text).then(function () {
        //console.log('Status:' + code)
    });
}


submitBtn.addEventListener('click',sendData)
formWrapper.addEventListener('keydown',(event) => {
    const keyName = event.key;
    if (keyName === "Enter") {
        sendData()
        // do not alert when only Control key is pressed.
        return;
    }

},
false)


// loadBtn.addEventListener('click',fillTable)
logOutBtn.addEventListener('click', logOut)
openModalBtn.addEventListener('click', function(){
    UIkit.modal(uploadModal).show();
})


if(initLogin()){
   // ListFiles()
}
