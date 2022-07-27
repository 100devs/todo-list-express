//Requiring Express   
const express = require('express')
//Requiring Express
const app = express()
//Requiring MongoDB
const MongoClient = require('mongodb').MongoClient
//Declaring Port variable
const PORT = 2121
//Requiring dotenv
require('dotenv').config()


let db, //Declaring an empty 'db' variable
    dbConnectionStr = process.env.DB_STRING, //A connection string variable that gets the string from .env or heroku's variables
    dbName = 'todo' //Declaring the name of the database to the 'dbName' variable

//Connecting to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
// Setting up EJS
app.set('view engine', 'ejs')
//Setting up public folder - anything in this doesn't need to be sent over or linked manually
app.use(express.static('public'))
// Tells express to decode and encode URLs automatically
app.use(express.urlencoded({ extended: true }))
//Telling express to use JSON
app.use(express.json())

//Responding to a get request to the '/' route
app.get('/',async (request, response)=>{
    //Getting to-do items from the database (saving in array in toDoItems)
    const todoItems = await db.collection('todos').find().toArray()
    //Getting remaining items left from the database - counting items with a completed value of false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //responding and sending over the variables in todoItems and itemsLeft to EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})


//Adding a new item to the list
app.post('/addTodo', (request, response) => {
    //Inserting a new todo item into the list
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // Then handles instead of Async Await - > showing it both ways
    // Async Await can make it more readable than having to nest your 'then' and 'catch'es
    // Console logging the todo list that was added, then telling client to refresh the page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //If there are errors then it will console log those
    .catch(error => console.error(error))
})

// Responding to an update request to mark an item as complete
app.put('/markComplete', (request, response) => {
    //Going into database, collection 'todos', finding a document that matches request.body.itemFromJS
    //We're looking for where a thing matches the item in the itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //Then set it to true
            //Setting that document's 'completed' status to true
            completed: true
          }
    },{
        //sort by the oldest first
        sort: {_id: -1},
        //don't just create one - if the document doesn't already exist, DON'T create a new one
        upsert: false
    })
    //Console logging that it's been marked complete, and also responding back to the client in JSON, saying it's been marked complete
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //Basic error catch
    .catch(error => console.error(error))

})


//Responding to an update request
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// Rseponding to a request to delete an item from the list
app.delete('/deleteItem', (request, response) => {
    //Going into the database and deleting the item that matches request.body.itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //Console logging and responding to the client that it's been deleted
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //Basic error catch
    .catch(error => console.error(error))

})

//Listening for the port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})