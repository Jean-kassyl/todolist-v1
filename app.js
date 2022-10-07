const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const currentDate = require(__dirname + '/date.js');

app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

// mongoose connection

mongoose.connect('mongodb://localhost:27017/todosDB')


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
    const Todo = mongoose.model(items, singleTodoSchema);
    Todo.find({}, function(err, result){
        if(err){
            console.log(err)
        }else {
            let id = ""
            if(!result.length > 0){
                id = 1
            }else {
                id = result.length + 1
            }
            const todo = new Todo({
                _id: id,
                content: singleItem
            })
        
            todo.save()
        }
    })
    // if(!holders.hasOwnProperty(items)){
    //     id = 1;
    //     holders[items] = []
    // }else {
    //     id = holders[items].length + 1
    // }
    
    // const todo = new Todo({
    //     _id: id,
    //     content: singleItem
    // })

    // todo.save()
    // if(!holders[items].length > 0){
    //     holders[items] = [todo]
    // }


    // const Todo = mongoose.model("homeitems", singleTodoSchema)
    // if(holders.hasOwnProperty("homeitems")){
    //     Todo.find({}, function(err, result){
    //         if(err){
    //             console.log(err)
    //         }else {
    //             console.log("result 1", result)
    //             holders["homeitems"] = result
    //             res.render('List', {date: currentDate, todos: holders["homeitems"], title: 'home' })
    //         }
    //     })
        
        
    // } else {
    //     res.render('List', {date: currentDate, todos: [], title: 'home' })
    // }

}



function getTodos(items, res){
    const Todo = mongoose.model(items, singleTodoSchema)
    Todo.find({}, function(err, todos){
        if(err){
            console.log(err)
        }else {
            res.render('List', {date: currentDate, todos: todos, title: 'home' })
        }
    })
}



// the routee definition

app.get('/', function(req, res){
    
    getTodos("homeitems", res)
    
})

app.post('/', (req, res) => {
    const todoData = req.body.newTodo;
    

    //here goes the code

   
    saveTodos("homeitems", todoData)


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

