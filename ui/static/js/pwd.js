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
                type="button" data-id="${id}">Посмотреть</button>`
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
    delete localStorage.token;
    delete localStorage.device;
    document.location.href = "/pwd"
}



const createDashboard = () => {
    logOutBtn.classList.remove('disabled')
    listWrapper.classList.remove('disabled')
    loginPano.remove()
}



function sendData(data = {}) {
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
        })

}

const showAlert = (text, code)=>{

    UIkit.modal.alert(text).then(function () {
        //console.log('Status:' + code)
    });
}

submitBtn.addEventListener('click',sendData)
// loadBtn.addEventListener('click',fillTable)
logOutBtn.addEventListener('click', logOut)

if(initLogin()){
    fillTable()
}
