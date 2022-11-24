let date = new Date()
console.log(date)
let endDate = date.setMonth(date.getMonth()+2);
console.log(endDate)
let expires = date.toISOString().slice(0,10)+" " + date.toLocaleTimeString()
console.log(expires)