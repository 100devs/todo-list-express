const express = require('express') //Says that it requires JS
const app = express() //Allows you to use express
const MongoClient = require('mongodb').MongoClient //says that it requires mongodb
const PORT = 2121 //port your server will run on
require('dotenv').config() //Lets you define hidden variables like the password for mangodb


let db, //defining variables that are used to grab the hidden login info for mongodb. Used to get info from .env files
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Connects to mongodb database
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') //Says to use the view folder for ejs and adjusts the root
app.use(express.static('public')) //Says to look in public folder for static express files
app.use(express.urlencoded({ extended: true })) //Parser for requests
app.use(express.json()) //Parser for JSON responses


app.get('/',async (request, response)=>{ //Request and respose for main page of the website
    const todoItems = await db.collection('todos').find().toArray() //Changes it to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Items left that is not viewable
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Renders the items that are available
    // db.collection('todos').find().toArray() //non async way to do the steps above
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //Create a new item to add to the todo list and redirects back to the homepage
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {//Update existing todo to complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, //sorts and adds to the bottom of the list
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {//Update existing todo to not completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1}, //sorts and adds to the bottom of the list
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { //Delete an item from the todo list
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ //assign the port by mongoDB or by the env file
    console.log(`Server running on port ${PORT}`)
})