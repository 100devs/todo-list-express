// these are the imports

// imports the express dependency
const express = require('express')

// creates an instance of express js and assigns it to app varaible
const app = express()

// imports the mongo client
const MongoClient = require('mongodb').MongoClient

// declares a PORT on 2121
const PORT = 2121

// imports the dotenv to be able to pull data from the .env file
require('dotenv').config()


let db, // declares a variable db for storing database connection
    dbConnectionStr = process.env.DB_STRING, // retrieves the database connection string from the env file
    dbName = 'todo' // sets the name of the database to todo

// connects to the mongo db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
    
    // prints a message in the console indication successful connection
        console.log(`Connected to ${dbName} Database`)
        
    //assigns the db object to the db variable
    db = client.db(dbName)
    })
    
// middleware declarations
// sets the view engine for rendering ejs files
app.set('view engine', 'ejs')

// sets the public directory as container for static files
app.use(express.static('public'))

// patses url encoded bodies of incoming requests
app.use(express.urlencoded({ extended: true }))

// parses json bodies of incoming requests
app.use(express.json())

// assigns an async get request on the root route  
app.get('/',async (request, response)=>{
    
    // assigns the todoItems variable to go to the todos collection of the database, finds all the documents and then returns it into an array
    const todoItems = await db.collection('todos').find().toArray()
    
    // assigns the itemsLeft variable to go to the database, specifically the todos collection, and count the documents which are not yet completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    
    // renders the index.ejs template and sends the response with the retreived data
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

// a post request in the /addTodo route
app.post('/addTodo', (request, response) => {
   // inserts a new todo in the todos collection with the provided data
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        
        // logs in the console that the todo are added
        console.log('Todo Added')
        
        //redirect to root url
        response.redirect('/')
    })
    
    .catch(error => console.error(error)) //catches the error, console logs the error
})

// a put request at /markComplete route
app.put('/markComplete', (request, response) => {
    
    // updates the todos document witht he provided itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //sets completed as true
            completed: true
          }
    },{
        
        //sorts all the items
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // executes this block of code when the update is successful
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    
    //logs error in the console
    .catch(error => console.error(error))

})

// put request in markUnComplete route
app.put('/markUnComplete', (request, response) => {
    // updates the this in the collection todos
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
           //sets completed as false
            completed: false
          }
    },{
        //sorts all the items
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // logs in the console that it is marked incomplete
        console.log('Marked Incomplete')
        response.json('Marked Incomplete')
    })
    //logs the error in the console
    .catch(error => console.error(error))

})

// a delete request at /deleteItem route
app.delete('/deleteItem', (request, response) => {
    
    // deletes the thing that is inside the todos collection
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //logs in the console that the todo is deleted
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //logs in the error if deletion is unsuccessful
    .catch(error => console.error(error))

})

// app.listen starts the express application, tells it to start listening to the provided port in the environment variable (when deployed) or the local PORT when on development
app.listen(process.env.PORT || PORT, ()=>{
    // logs in the console when app.listen is successful
    console.log(`Server running on port ${PORT}`)
})
