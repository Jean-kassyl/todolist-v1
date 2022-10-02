const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

//global variables
let items = ["check for a great 5 stars food recipee", "buy the raw ingredients"]

app.get('/', function(req, res){

    const date = new Date()
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    res.render('List', {currentDay: date.toLocaleDateString('en-US', options), todos: items})
})

app.post('/', (req, res) => {
    const newTodo = req.body.newTodo;
    items.push(newTodo)
    res.redirect('/')
})

const PORT = process.env.PORT || '3001'

app.listen(PORT, () => {
    console.log("server is running on " + PORT)
})

