let inputFile = document.getElementById('inputFile')
let uploadFileBtn = document.getElementById('uploadFileBtn')

let adminDomain = (new URL(url)).hostname
let adminUrl = 'https://go-study.space/'
if(adminDomain == 'localhost'){
    adminUrl = 'http://localhost:9999/'
}

uploadFileBtn.addEventListener('click', () => {

    let formData = new FormData()
    formData.append('inputFile', inputFile.files[0])

    fetch(adminUrl+'/upload/', {
        method: 'POST',
        headers: {
            'Content-type': 'multipart/form-data',
        },
        body: formData,
        redirect: 'manual'
    })
        .then((response) => response.text())
        .then((data) => {
            console.log(data)
            // {title: "foo", body: "bar", userId: 1, id: 101}
        })

});