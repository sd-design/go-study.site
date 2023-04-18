console.log('%c Pwd part', 'background: #222; color: #bada55; padding:15px')


const inputLogin = document.getElementById("inputLogin")
const inputPwd = document.getElementById("inputPwd")
const submitBtn = document.getElementById("submitBtn")
const loginPano = document.getElementById("loginPano")
const listWrapper = document.getElementById("listWrapper")
// const loadBtn = document.getElementById("loadBtn")
const logOutBtn = document.getElementById("logOut")
const startFill = document.getElementById("startFill")
const systemModal = document.getElementById("systemModal")
const modalSystemName = document.getElementById("modalSystemName")
const modalPwdText = document.getElementById("modalPwdText")
const addSystemModal = document.getElementById("addSystemModal")
const openModalBtn = document.getElementById("openModalBtn")
const addSystemBtn = document.getElementById("addSystemBtn")
const formWrapper = document.getElementById("formWrapper")
const btnCopy = document.getElementById("btnCopy")

let url = window.location.href
let domain = (new URL(url)).hostname
let siteUrl = 'https://api.go-study.site/'
if(domain == 'localhost'){
    siteUrl = 'http://localhost:4200/'
}

const insertRow = (id, system) => {
    let row = document.createElement('tr');
    let tdId = document.createElement('td');
    tdId.textContent = id
    let tdSystem = document.createElement('td');
    tdSystem.textContent = system
    let tdBtn = document.createElement('td');
    tdBtn.innerHTML =`<button class="uk-button uk-width-1-2@m uk-button-default show-pwd"
                type="button" data-id="${id}" onclick="getPwd(${id})">Посмотреть</button>`
    row.appendChild(tdId)
    row.appendChild(tdSystem)
    row.appendChild(tdBtn)
    // console.log(row)
    startFill.appendChild(row)
}

function fillTable (){
    let fillUrl = siteUrl+ 'passwords/list'
    fetch(fillUrl,{
        method: 'GET',
        headers: {
            'authorization-token': localStorage.token,
            'device-id': localStorage.device
        },
    }).then((data) => data.json())
        .then((data) => {
            // console.log(data)
            data.forEach(function(item, i,) {
                insertRow(data[i].id, data[i].system_name)
            })
        })

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
                document.location.href = "/pwd"
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
                createDashboard()
                fillTable()
            }
            if(data.response == false){
                showAlert('<div class="uk-alert-danger" uk-alert>Authorization Error</div>', 400)
            }
        }).catch(function() {
        showAlert('<div class="uk-alert-danger" uk-alert>Server Error</div>', 400)
    });

}


const getPwd = (id) => {
    let formBody ="id="+id
    fetch(siteUrl+"passwords/get_pwd",{
        method: 'POST',
        headers: {
            'authorization-token': localStorage.token,
            'device-id': localStorage.device,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody,
    }).then((data) => data.json())
        .then((data) => {
            if(data.response == true){
                modalSystemName.innerHTML= data.system
                modalPwdText.value = data.password
                UIkit.modal(systemModal).show();
            }
            if(data.response == false){
                showAlert('<div class="uk-alert-danger" uk-alert>Authorization Error</div>', 400)
            }
        })

}

const addSystem = () => {
    console.log("added")
    let inputSystem = document.getElementById("inputSystemName")
    let inputPwd = document.getElementById("inputSystemPwd")
    let formBody = {system:inputSystem.value, pwd:inputPwd.value}
    fetch(siteUrl+"passwords/add_pwd",{
        method: 'POST',
        headers: {
            'authorization-token': localStorage.token,
            'device-id': localStorage.device,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody),
    }).then((data) => data.json())
        .then((data) => {
            if(data.response == true){
                UIkit.modal(addSystemModal).hide();
                startFill.innerHTML = ''
                inputSystem.value = ''
                inputPwd.value = ''
                fillTable()
            }
            if(data.response == false){
                showAlert('<div class="uk-alert-danger" uk-alert>Server error</div>', 400)
            }
        })
}

const showAlert = (text, code)=>{

    UIkit.modal.alert(text).then(function () {
        //console.log('Status:' + code)
    });
}

async function copyContent() {
    let InputValue = modalPwdText.value
    try {
        await navigator.clipboard.writeText(InputValue);
        alert('Pwd was copied to clipboard');
        /* Resolved - text copied to clipboard successfully */
    } catch (err) {
        console.error('Failed to copy: ', err);
        /* Rejected - text failed to copy to the clipboard */
    }
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
    UIkit.modal(addSystemModal).show();
})
addSystemBtn.addEventListener('click', addSystem)
btnCopy.addEventListener('click', copyContent)

if(initLogin()){
    fillTable()
}
