function bt(timestamp1, timestamp2) {
    let date1 = new Date(timestamp1)
    let date2 = new Date(timestamp2)
    let Difference = Math.abs(date1 - date2) / 1000
    let days = Math.floor(Difference / 86400)
    let hours = Math.floor(Difference / 3600) % 24
    let minutes = Math.floor(Difference / 60) % 60
    return {days: days, hours: hours, minutes: minutes}
    //  return Difference_In_Days
}

console.log(bt(1669215654000, 1669374954000))