const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const currentDate = require(__dirname + '/date.js');

app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

// global variables 

const holders = {
    items: ["check for a great 5 stars food recipee", "buy the raw ingredients"],
}



app.get('/', function(req, res){
    res.render('List', {date: currentDate, todos: holders.items, title: 'home' })
})

app.post('/', (req, res) => {
    const newTodo = req.body.newTodo;
    holders.items.push(newTodo)
    res.redirect('/')
})

app.get('/:category', function(req, res){
    let route = req.params.category
    if(!holders.hasOwnProperty(route)){
        holders[route] = []
    }
    res.render('List', {title: route, todos: holders[route]})
})

app.post('/:category', function(req, res){
    let route = req.params.category
    let todo = req.body.newTodo
    holders[route].push(todo)
    res.redirect('/' + route)
})

const PORT = process.env.PORT || '3001'

app.listen(PORT, () => {
    console.log("server is running on " + PORT)
})

