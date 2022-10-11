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


const saveTodos = (items, singleItem, res, path) => {
    const Todo = mongoose.model(items, singleTodoSchema);
    Todo.find({}, function(err, result){
        if(err){
            console.log(err)
        }else {
            let id = ""
            if(!result.length > 0){
                id = 1
            }else {
                const ids = result.map(todo => todo._id )
                id = Math.max(...ids) + 1
            }
            const todo = new Todo({
                _id: id,
                content: singleItem
            })
        
            todo.save(function(err, result){ //start of the callback on the save 
                if(err){
                    console.log(err)
                }else {
                    res.redirect(path)
                }
            }) // end of the callback
        }
    })
    

}



function getTodos(items, res, title, ctgry, showItem, route){
    const Todo = mongoose.model(items, singleTodoSchema)
    Todo.find({}, function(err, todos){
        if(err){
            console.log(err)
        }else {
            res.render('List', {date: currentDate, todos: todos, title: title, cat: ctgry, show: showItem, route:route })
            
        }
    })
}


function collectionFormater(cat){
    let newList = cat.toLowerCase().split(' ').join('_')
    newList = newList.endsWith('s')? newList: newList + 's';
    return newList;
}



// the route definition

app.get('/', function(req, res){

    Categories.find({}, function(err, categories){
        if(err){
            console.log(err)
        }else {
            //we need to check the categories when we get to the home route 
            getTodos("homeitems", res, 'home', categories, false)
            //end of logic
        }
    })
    
   
    
})

app.post('/', (req, res) => {
    const todoData = req.body.newTodo;
    

    //here goes the code for saving todos

   saveTodos("homeitems", todoData, res, '/')
    // end it here

    
    
})

app.get('/delete:id', function(req, res){
    let id = Number(req.params.id);
    const Todo = mongoose.model('homeitems', singleTodoSchema)
    Todo.deleteOne({_id: id}, function(er, result){
        if(er){
            console.log(er)
        }else {
            res.redirect('/')
        }
    })
})




// +++++++++++++++++++++++++++++++++++++++end of the home route logic ++++++++++++++++++++++++++++

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

                newCategory.save(function(error, doc){  //start save block 
                    if(error){
                        console.log()
                    }
                    else {
                        //******************************************** */
                        // here we are taking profit of saving our category in order to get all the categories
                        Categories.find({}, function(er, categories){
                            if(error){
                                console.log(er)
                            } else {
                                let route = data.split(' ').join('+')
                                getTodos(cat, res, data, categories, true, route)
                                
                                
                            }
                        })
                        //******************************************** */
            }
            
        }) // end of save block

    
    } else{ // start of the else after checking the existence of the category
        let route = data.split(' ').join('+')
        getTodos(cat, res, data, categories,true, route)
      


    } // end of the block
           
    }
})
// end of category finding
})

//post to the categories route 
app.post('/categories', function(req, res){
    let route = req.query.category
    let todo = req.body.newTodo
    const category = collectionFormater(route)
    const path = '/categories?category=' + route.split(' ').join('+');

    saveTodos(category, todo, res, path)
    
})

app.get('/categories/delete', function(req, res){
    let id = Number(req.query.id);
    let data = req.query.category
    let cat = collectionFormater(data)
    const Todo = mongoose.model(cat, singleTodoSchema)
    Todo.deleteOne({_id: id}, function(er, result){
        if(er){
            console.log(er)
        }else {
            res.redirect('/categories?category=' + data.split(' ').join('+'))
        }
    })
    
})

app.get('/category/delete', function(req, res){
    let data = req.query.name
    let category = collectionFormater(data)

    const deleteRoute = "http://localhost:3001/categories?category=" + data.split(' ').join('+')

   
    

    Categories.deleteOne({category: category}, function(err, re){
        if(err){
            console.log(err)
        } else {
            console.log("working fine")
        }
    })
    mongoose.connection.db.dropCollection(category, function(err, result){
        if(err){
            console.log(err)
        } else {
            console.log("success")
        }
    })
    
   if(deleteRoute === req.headers.referer){
    res.redirect('/')
   }else {
    res.redirect(req.headers.referer)
   }
})



const PORT = process.env.PORT || '3001'

app.listen(PORT, () => {
    console.log("server is running on " + PORT)
})

