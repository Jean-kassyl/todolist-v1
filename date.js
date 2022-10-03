function getDate(){
    const date = new Date()
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

     return date.toLocaleDateString('en-US', options)
}

module.exports = getDate();