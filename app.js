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
    name: String,
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



function getTodos(items, res, title, ctgry, route){
    const Todo = mongoose.model(items, singleTodoSchema)
    Todo.find({}, function(err, todos){
        if(err){
            console.log(err)
        }else {
            res.render('List', {date: currentDate, todos: todos, title: title, cat: ctgry,  route:route })
            
        }
    })
}


function collectionFormater(cat){
    let newList = cat.toLowerCase().split(' ').join('_')
    newList = newList.endsWith('s')? newList: newList + 's';
    return newList;
}

function findCat(){
    
}


// the route definition

app.get('/', function(req, res){

    Categories.find({}, function(err, categories){
        if(err){
            console.log(err)
        }else {
            //we need to check the categories when we get to the home route 
            console.log('home route categories: ', categories)
            getTodos("homeitems", res, 'home', categories)
        }
    })
    
   
    
})

app.post('/', (req, res) => {
    const todoData = req.body.newTodo;
    

    //here goes the code

   
    saveTodos("homeitems", todoData)


    // end it here


    res.redirect('/')
})


// get the categories page
app.get('/categories', function(req, res){
    let data = req.query.category
    const cat = collectionFormater(data)
    
    
    const newCategory = new Categories({
        category: cat,
        name: data,
        date: currentDate
    })

    //start of categories finding
    Categories.find({}, function(err, categories){
        if(err){
            console.log(err)
        }else {
            let check = categories.find(categ => categ.category === cat)
            if(!check){

                newCategory.save(function(error, doc){
                    if(error){
                        console.log()
                    }
                    else {
                        //******************************************** */
                        // here we are taking profit of saving our category in order to get all the categories
                        Categories.find({}, function(error, categories){
                            if(error){
                                console.log(error)
                            } else {
                                console.log("categories of the saving route",categories)
                                let route = data.split(' ').join('+')
                                getTodos(cat, res, data,categories, route)
                            }
                        })
                        

                        //******************************************** */
            }

        })

            
    }
    
        let route = data.split(' ').join('+')
        getTodos(cat, res, data, categories, route)
    }
    
    
    
})
// end of category finding
})

//post to the categories route 
app.post('/categories', function(req, res){
    let route = req.query.category
    let todo = req.body.newTodo
    const category = collectionFormater(route)


    

    saveTodos(category, todo)
    console.log("route", route)
    console.log('todo', todo)
    res.redirect('/categories?category=' + route.split(' ').join('+'))
})

const PORT = process.env.PORT || '3001'

app.listen(PORT, () => {
    console.log("server is running on " + PORT)
})

