const express = require('express')
//This imports the express module so you can have an easier time setting up the server
const app = express()
// This reassigns express to the app variable so you can use the methods in the express module
const MongoClient = require('mongodb').MongoClient
//This imports the mongoDB module and reassigns it for the same reason as line 4
const PORT = 2121
// This sets the port of the application to localhost:2121. I still don't understand the 21 joke.
require('dotenv').config()
// This has something to do with the environment variable. I'm 90% sure this is so you don't publish your user and password for mongo
// This is requiring a file called dotenv

let db,
// This is assigning db (the database) variable, but leaving it empty.
    dbConnectionStr = process.env.DB_STRING,
// This is assigning a variable to the dbConnectionStr. This is to keep the user and pass of Mongo hidden
    dbName = 'todo'
// This is naming the database
// Side note, I figured out the comma is just to declare multiple variables. While you could declare these seperately, I think
// it's done this way so that you see all these related variables. Makes it easier to read.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// So this is a use of the mongodb module. It's using the connect method. The connect method looks like it has two parameters
// 1. The connection string to get to the database. And 2. It's passing what's called an 'options object'. An object that passes
// an option parameter
    .then(client => {
// This is a promise. When the connection is finished, then assign the client parameter through the following function
        console.log(`Connected to ${dbName} Database`)
// This is a console log just confirming that the database is connected to the server
        db = client.db(dbName)
// This assigns the let db variable from line 13.
    })
// This is just closing the promise

app.set('view engine', 'ejs')
// This is setting what express is to expect from the server. It's saying that the 'view engine' will use 'ejs', JavaScript Embedded
// templates, to render the HTML
app.use(express.static('public'))
// This is telling express that my static files (the HTML, JS, and CSS, and assets) will be found in the 'public' folder
app.use(express.urlencoded({ extended: true }))
// This is telling express to parse the information from HTTP requests as objects
app.use(express.json())
// This is telling the server that we will be using json in our requests


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
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

app.post('/addTodo', (request, response) => {
// This is using express to handle a POST request. The '/addTodo' is the route for this code to take place, request and response
// are the request and response of the client-side code and server respectively. Then it will perform the following function
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
// This is finding the collection from mongo labeled 'todos' and inserting a new file into the database. It's going into the request,
// finding the body of the request, and finding the todoItem within that body, assinging that to the property of thing,
// and setting its completed value to false to start.
    .then(result => {
// This is a promise. Once the top of this code block is finished, it will then do the following
        console.log('Todo Added')
// This informs the user that the post request was succesful
        response.redirect('/')
// This is the official response, redirecting the user to the root of the website, AKA refreshing the page
    })
    .catch(error => console.error(error))
// This will catch any errors that occur and log them to the console
})

app.put('/markComplete', (request, response) => {
// This is using express to handle a PUT request, aka, an update request. The '/markComplete' is the route for this code to take place,
// request and response are the request and response of the client-side code and server respectively. Then, it will do this:
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
// This is finding the connection from mongo labeled 'to dos' and updating a file in the database. It's finding a document with a field
// of thing and then going into the body of the request and updating the itemFromJS
        $set: {
            completed: true
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

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})