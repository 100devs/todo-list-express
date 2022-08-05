// Making it possible to use Express in this file.
const express = require('express')
// Saving the express call to the 'app' variable'
const app = express()//setting a variable and assigning it to the instance of express 
const MongoClient = require('mongodb').MongoClient//Making it possible to use methods associated with MongoClient in order to connect client front-end to the mongodb database back-end

const PORT = 2121//Setting a constant to define a location where server is listening for requests.
// Requiring dotenv
require('dotenv').config()//allows us to look for variables inside the .env file

let db,     // Declaring an empty 'db' variable, (global variable which can be reused elsewhere)
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it  // a connection string variable that gets the string from .env or (heroku's variables) designated database
    dbName = 'todo' // Declaring the name of the database to the 'dbName' variable

// Connecting to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//Creating a connection to Mongodb and passing in our connections string w/ the connection method. Which also passes in an additional propery,{}
    .then(client => {//waiting for the connection and only proceeding if connected, AND passing in all client info if so
        console.log(`Connected to ${dbName} Database`)//loging to the console a template literal 'Connected to todo Database'
        db = client.db(dbName)//Passing in all client information along with database name to previously assigned variable db. New value contains a client factory method.

    })//closes .then

    //Middlewawre  // Setting up EJS, as our default rendor method  
app.set('view engine', 'ejs')
    // Setting up the public folder 
app.use(express.static('public'))//Sets location for static assets e.g. photos, html, additional stylesheets et al.
    // Tells express to decode and encode URLs automatically
app.use(express.urlencoded({ extended: true }))
    // Tells express to use JSON to encode and decode URLs where the header matches the content, extended to also supports arrays and objects.
app.use(express.json())//Tells express to parse incoming requests

// Responding to a get request for an asynchronous request to the root '/' route
app.get('/', async (request, response)=>{//Starts a GET method when the root rout is passed in, sets up req and res parameters (everytime browser reloads)

    // Getting to-do items from the database
    const todoItems = await db.collection('todos').find().toArray()//Sets a constant and awaits all items from the todos collection

    // Getting items with a 'completed' value of 'false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//Sets a constant and awaits a count of uncompleted items to later display in EJS  
    
    // Sending over the variables todoItems and itsmeLeft to EJS
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

// Responding to a post request to the /'addTodo' route
app.post('/addTodo', (request, response) => {
    // Inserting a new todo item into the list
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})

    // Console logging that the todo list was added, then telling client to refresh the page
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // Console log errors if they occur
    .catch(error => console.error(error))
})

// Responding to an update request to mark an item complete
app.put('/markComplete', (request, response) => {
   // Going into database, collection 'todos', and finding a document that matches request.body.itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Setting that document's 'completed' status to true
        $set: {
            completed: true
          }
    },{
        // Sorting by oldest first
        sort: {_id: -1},
        // If the document doesn't already exist, don't create a new one
        upsert: false
    })
    // Console logging that it's been marked complete, and also responding back to the client in JSON, saying it's been marked complete
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    // Console logs errors if there are any
    .catch(error => console.error(error))

})

// Responding to an update request to mark an item uncomplete
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

// Responding to a request to delete an item from the list 
app.delete('/deleteItem', (request, response) => {
    // Going into the database and deleting the item that matches request.body.itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // Console logging and responding to the client that it's been deleted
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    // Console logs errors if there are any
    .catch(error => console.error(error))

})

// Setting the server to listen to requests
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})