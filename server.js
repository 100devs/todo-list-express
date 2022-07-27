// import express module
const express = require('express')
// allows us to use express
const app = express()
// import MongoDB
const MongoClient = require('mongodb').MongoClient
// const for PORT on local machine
const PORT = 2121
// allows us to use .env files and see into .gitignore
require('dotenv').config()

// allows for use of db name from Mongo DB and associating it with a variable
let db,
// allows us to use our MongoDB connection string
    dbConnectionStr = process.env.DB_STRING,
    // variable tied to db name of 'todo'
    dbName = 'todo'

// MongoClient to connect to the dbConnectionStr
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// promise chain
    .then(client => {
        // telling user they're connected to db (logged into terminal)
        console.log(`Connected to ${dbName} Database`)
        // reassigning variable to the db in MongoDB (here, it's 'todo')
        db = client.db(dbName)
    })

// allows us to use ejs
app.set('view engine', 'ejs')
// allows us access to all in the 'public' folder
app.use(express.static('public'))
// allows us to use middleware
app.use(express.urlencoded({ extended: true }))
// allows us to use/parse JSON data
app.use(express.json())

// GET request for the home page 
app.get('/',async (request, response)=>{
    // goes into 'todos' collection and find documents therein and puts them into an array
    const todoItems = await db.collection('todos').find().toArray()
    // goes into 'todos' collection and gets items that are not completed/are left and return the number that are not finished
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // responds by putting items in template and spitting out html with todoItems and itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // see above in app.get: this is the code when you do not use async/await
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// POST request to /addTodo endpoint
app.post('/addTodo', (request, response) => {
    // go to db, find 'todos' collection, add a new task (thing) and it is false because it is incomplete
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // promise chain
    .then(result => {
        // lets user know Todo is Added (logged into terminal)
        console.log('Todo Added')
        // redirect back to homepage, showing the new task added to list via POST request
        response.redirect('/')
    })
    // catch any errors that come up from the POST request
    .catch(error => console.error(error))
})

// PUT request to /markComplete endpoint (update data): here, it's marking as completed
app.put('/markComplete', (request, response) => {
    // go to db, get the 'todos' collection, go to thing, go to the body, find itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set completed to true
        $set: {
            completed: true
          }
    },{
        // sort by ascending order
        sort: {_id: -1},
        // no update/filtering document nor adding/updating the collection with new document
        upsert: false
    })
    // promise chain
    .then(result => {
        // logging "Marked Complete" in the terminal
        console.log('Marked Complete')
        // responds with "Marked Complete"
        response.json('Marked Complete')
    })
    // error handling
    .catch(error => console.error(error))

})

// PUT request to remove the line off the todo list item
app.put('/markUnComplete', (request, response) => {
    // go to db, to the 'todos' collection, go to thing, go to body, and get itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set completed to false
        $set: {
            completed: false
          }
    },{
        // sort by ascending order
        sort: {_id: -1},
         // no update/filtering document nor adding/updating the collection with new document
        upsert: false
    })
    // promise chain
    .then(result => {
        // logging "Marked Complete" in the terminal
        console.log('Marked Complete')
          // responds with "Marked Complete"
        response.json('Marked Complete')
    })
    // error handling
    .catch(error => console.error(error))

})

// DELETE request for /deleteItem endpoint
app.delete('/deleteItem', (request, response) => {
    // go to the db, go to 'todos' collection, go to thing, go to body and get itemFromJS and delete it
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // promise chain
    .then(result => {
        // log "Todo Deleted" to console
        console.log('Todo Deleted')
        // respond with "Todo Deleted"
        response.json('Todo Deleted')
    })
    // error handling
    .catch(error => console.error(error))

})

// telling the app to listen to either port 2121 or the port in the .env file
app.listen(process.env.PORT || PORT, ()=>{
    // log in the console the port that the server is running on.
    console.log(`Server running on port ${PORT}`)
})