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

const categorySchema = new mongoose.Schema({
    category: String,
    date: String
})

const Categories = mongoose.model("categorie",categorySchema )

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
    

}



function getTodos(items, res, title){
    const Todo = mongoose.model(items, singleTodoSchema)
    Todo.find({}, function(err, todos){
        if(err){
            console.log(err)
        }else {
            res.render('List', {date: currentDate, todos: todos, title: title })
        }
    })
}



// the route definition

app.get('/', function(req, res){
    
    getTodos("homeitems", res)
    
})

app.post('/', (req, res) => {
    const todoData = req.body.newTodo;
    

    //here goes the code

   
    saveTodos("homeitems", todoData, 'home')


    // end it here


    res.redirect('/')
})

app.get('/categories', function(req, res){
    let route = req.query.category
    let newList = route.toLowerCase().split(' ').join('_')
    newList = newList.endsWith('s')? newList: newList + 's';

    const newCategory = new Categories({
        category: newList,
        date: currentDate
    })
    Categories.find({}, function(err, categories){
        if(err){
            console.log(err)
        }else {
            let check = categories.find(category => category.name === newList)
            if(!check){
                newCategory.save()
            }
        }
    })
   
    getTodos(newList, res, route)
})

app.post('/categories', function(req, res){
    let route = req.query.category
    let todo = req.body.newTodo
    console.log("route", route)
    console.log('todo', todo)
    res.redirect('/')
})

const PORT = process.env.PORT || '3001'

app.listen(PORT, () => {
    console.log("server is running on " + PORT)
})

