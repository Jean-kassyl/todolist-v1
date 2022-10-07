const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const currentDate = require(__dirname + '/date.js');

app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

// mongoose connection

mongoose.connect('mongodb://localhost:27017/todoDB')


const holders = {};

// defining the schema of my todos

const singleTodoSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: [true, "each todo would need an id"]
    },
    content: {
        type: String,
        required: [true, "you need to enter a todo"]
    }
})


const saveTodos = (items, singleItem) => {
   

    let id = holders.hasOwnProperty(items)?holders[items].length + 1: 1;
    const Todo = mongoose.model(items, singleTodoSchema);
    const todo = new Todo({
        _id: id,
        content: singleItem
    })

    //todo.save()

    Todo.find({}, function(err, result){
        if(err){
            console.log(err)
        }else {
            console.log(result)
        }
    })

    
    

}



app.get('/', function(req, res){
    let items = []
    const Todo = mongoose.model("homeitems", singleTodoSchema)
    Todo.find({}, function(err, result){
            if(err){
                console.log(err)
            }else {
                if(result.length > 0){
                    console.log("result 1", result)
                    holders["homeitems"] = result
                }
            }
    })
    console.log("outside 2")
    if(holders.hasOwnProperty("homeitems")){
        items = holders["homeitems"]
        console.log(items)
    }
    res.render('List', {date: currentDate, todos: [], title: 'home' })
})

app.post('/', (req, res) => {
    const todoData = req.body.newTodo;
    

    //here goes the code




    let id = holders.hasOwnProperty("homeitems")?holders["homeitems"].length + 1: 1;
    const Todo = mongoose.model("homeitems", singleTodoSchema);
    const todo = new Todo({
        _id: id,
        content: todoData
    })

    todo.save()





    // end it here










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

