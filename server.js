const express = require('express') // load express module 
const app = express() // assign express module to app variable
const MongoClient = require('mongodb').MongoClient // load mongo client module that allows interaction with mongodb
const PORT = 2121 // local port to listen at
require('dotenv').config() // load .env module

let db, // declare db variable
    dbConnectionStr = process.env.DB_STRING, // assign DB_STRING variable from .env file to dbConnectionStr variable
    dbName = 'todo' // declare dbName as 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // mongodb connection with dbConnectionStr and "use the new unified topology layer" passed in as arguments
    .then(client => { // response of .connect passed in as client variable
        console.log(`Connected to ${dbName} Database`) // "connected to todo Database"
        db = client.db(dbName) // sets db variable to 
    })
    
app.set('view engine', 'ejs') // sets app template engine as ejs
app.use(express.static('public')) // allows app to automatically serve files from public folder
app.use(express.urlencoded({ extended: true })) // allows app to parse incoming requests with urlencoded payloads and specifies that req.body object will contain a value of any type
app.use(express.json()) // allows app to decode or encode into json format

app.get('/',async (request, response)=>{ // read (GET) request started when server hears the route: /
    const todoItems = await db.collection('todos').find().toArray() // find all documents in the db collection named 'todos', store them in an array, and assign that array to todoItems variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // count number of documents with completed set to false and assign to itemsLeft variable
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering ejs file with variables "todoItems" and "itemsLeft" passed in to ejs file as variables "items" and "left" respectively 
    
    // db.collection('todos').find().toArray() // find all documents in db collection named 'todos' and return that information
    // .then(data => { // documents returned passed in as data
    //     db.collection('todos').countDocuments({completed: false}) // count number of documents with completed set to false  and return that information
    //     .then(itemsLeft => { // count returned passed in as itemsLeft
    //         response.render('index.ejs', { items: data, left: itemsLeft }) // render ejs file with with variables "data" and "itemsLeft" passed in to ejs file as variables "items" and "left" respectively
    //     })
    // })
    // .catch(error => console.error(error)) // console log error, if any
})

app.post('/addTodo', (request, response) => { // create (POST) request started when server hears the route: /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts one document - with the keys "thing" set to the information submitted through the form, and "completed" set to false - into the db collection named "todos"  
    .then(result => { // response if any passed in as result
        console.log('Todo Added') // console log 'Todo Added' 
        response.redirect('/') // redirects route from: '/addTodo' to: '/' (i.e., refreshes page)
    })
    .catch(error => console.error(error)) // console log error, if any
})

app.put('/markComplete', (request, response) => { // update (PUT) request started when server hears the route: /markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updates the first document that has the key "thing" set to information passed in through inner text of item that was clicked 
        $set: { 
            completed: true // setting the value of key "completed" to true
          }
    },{
        sort: {_id: -1}, // sorts in descending order
        upsert: false // prevents new document from being created if it does not previously exist
    })
    .then(result => { // response if any passed in as result
        console.log('Marked Complete') // console.log 'Mark Complete'
        response.json('Marked Complete') // reponding with json 
    })
    .catch(error => console.error(error)) // console log error, if any
})

app.put('/markUnComplete', (request, response) => { // update (PUT) request started when server hears the route: /markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updates the first document that has the key "thing" set to information passed in through inner text of item that was clicked 
        $set: {
            completed: false // setting the value of key "completed" to true
          }
    },{
        sort: {_id: -1}, // sorts in descending order
        upsert: false // prevents new document from being created if it does not previously exist
    })
    .then(result => { // response if any passed in as result
        console.log('Marked Complete') // console.log 'Mark Complete'
        response.json('Marked Complete') // reponding with json 
    })
    .catch(error => console.error(error)) // console log error, if any
})

app.delete('/deleteItem', (request, response) => { // delete (DELETE) request started when server hears the route: /deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // deletes the first document that has the key "thing" set to information passed in through inner text of item that was clicked
    .then(result => { // response if any passed in as result
        console.log('Todo Deleted') // console.log 'Mark Complete'
        response.json('Todo Deleted') // reponding with json 
    })
    .catch(error => console.error(error)) // console log error, if any
})

app.listen(process.env.PORT || PORT, ()=>{ // app is listening on the port provided by host or port 2121
    console.log(`Server running on port ${PORT}`) // if local, console log 'server running on port: 2121"
})