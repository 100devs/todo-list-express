//MODULES
//requires express to be imported into node
const express = require('express')
// create an express application
const app = express()
//requires the Mongoclient library to be imported
const MongoClient = require('mongodb').MongoClient
//establishes a (local) port on port 2121
const PORT = 2121
require('dotenv').config()
//hides tokens,variables, passwords, keys, usernames, etc(include this in .gitignore)

//creates db
let db, 
    //dbConnectionStr equal to address provided by MongoDB
    dbConnectionStr = process.env.DB_STRING,
    // sets database name as 'todo'
    dbName = 'todo'

// defines how we connect to our db, useUnifiedTopology helps ensure that things are returned in a clean manner
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //responging on the client side and saying...
    .then(client => {
        //console log a message when successfully connected to db
        console.log(`Connected to ${dbName} Database`)
        //defines db as 'todo' works with line 
        db = client.db(dbName)
    })

//MIDDLEWARE
//determining how were going to use a view(template) enging to render ejs (embedded JS) commands for our app
app.set('view engine', 'ejs')
//tells app to use a folder names 'public' for all of our static files(e.g. images and CSS files)
app.use(express.static('public'))
//call to middleware the cleasn up how things are displayed and how server communicates with out client(similar to useUnifiedTopology)
app.use(express.urlencoded({ extended: true }))
//tells app to use Express' method to take the object and turn it into a JSON string
app.use(express.json())

//ROUTES
// get stuff using async function to display to users on the client side (in this case, index.ejs)
app.get('/',async (request, response)=>{
    //create constant 'todoItems' that goes into our db, creating a collection called 'todos'. and finding anything in that db and turning arrays into objs
    const todoItems = await db.collection('todos').find().toArray()
    //create constant in MongoDB countDocuments() method counts the number of todo list items are not yet completed and are left to do.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //sends a response that renders all of this info in index.ejs
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

//add a new todo list item in the db via /addTodo route
app.post('/addTodo', (request, response) => {
    //server will go into collection caled 'todos' and create a new item with completion status of false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //assuming everything went ok...
    .then(result => {
        //console log completed status
        console.log('Todo Added')
        //refresh the page
        response.redirect('/')
    })
    //if item cannot be added display this error message
    .catch(error => console.error(error))
})

//UPDATE. when we click a button it will mark item as completed
app.put('/markComplete', (request, response) => {
    //going to go into our 'todos' collection
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //add status of 'completed' equal to true to item in collection
        $set: {
            completed: true
          }
    },{
        //once an item is completed 
        sort: {_id: -1},
        //doesnt create a document for the todo if the item isnt found
        upsert: false
    })
    //assuming everything went ok and we get a result...
    .then(result => {
        //console log completed status
        console.log('Marked Complete')
        //returns response of "marked completed" to the featch in main.js
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
    //if something broke, error is logged
})

//UPDATE. when we click a button will mark a completed item uncomplete
app.put('/markUnComplete', (request, response) => {
    //go into 'todos' collection for an item itemfromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //remove status of 'completed' by setting it to false
        $set: {
            completed: false
          }
    },{
        //once an item is marked 'incomplete' (?)
        sort: {_id: -1},
        upsert: false
    })
    //assuming everything went ok and we get a result...
    .then(result => {
        //console log completed status
        console.log('Marked Complete')
        //returns response of "marked completed" to the featch in main.js
        response.json('Marked Complete')
    })
    //if something broke, error is logged
    .catch(error => console.error(error))

})

//delete
app.delete('/deleteItem', (request, response) => {
    //goes into your collection uses deleteOne method and find a thing that matches the name of the thing you clicked on
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //assuming everthiing went well...
    .then(result => {
        //console log todo deleted
        console.log('Todo Deleted')
        //returns response of 'todo deleted' to fetch in main.js
        response.json('Todo Deleted')
    })
    //if something broke, error is logged
    .catch(error => console.error(error))

})

//tells server to listen for connections on the PORT we defined as a constant earlier OR process.env.PORT will tell the server to listen on the port of the APP (e.g, PORT used by HEROKU)
app.listen(process.env.PORT || PORT, ()=>{
    //console log the port number or server is running on
    console.log(`Server running on port ${PORT}`)
})