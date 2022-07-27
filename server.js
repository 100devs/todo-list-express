//--Declaring variables and setting requirements

const express = require('express')// requiring express packing downloaded via NPM
const app = express()// storing express call in variable called app (a lot nicer)
const MongoClient = require('mongodb').MongoClient// requiring mongodb package downloaded via NPM(allows use of mongodb methods)
const PORT = 2121// Declare port
require('dotenv').config()// allows use of the .env file

// Declare mongodb connection variables
let db,
    dbConnectionStr = process.env.DB_STRING, // database connection string from .env file
    dbName = 'todo' // declare database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // UnifiedTopology is to support older mongo version
    .then(client => {
        console.log(`Connected to ${dbName} Database`) // show connection logged in console
        db = client.db(dbName)// storing database information in variable
    })

// middleware
app.set('view engine', 'ejs') // initializes and sets view engine to be ejs
app.use(express.static('public')) // lets the app automatically serve files in public as they are called upon
app.use(express.urlencoded({ extended: true })) // middleware for parsing bodies from URL
app.use(express.json()) // Parses incoming JSON requests and puts the parsed data in req


app.get('/',async (request, response)=>{ // get root/default route
    const todoItems = await db.collection('todos').find().toArray() // putting an array of todo items into the todoItems variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // counts how many documents have been created and put into "todos" collection with the completed query as "false"
    response.render('index.ejs', { items: todoItems, left: itemsLeft })// response of an ejs rendering listing the todoItems passed into the 'items' key and itemsLeft into the 'left' key

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // create a todo item
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // goes into todo database and inserts one item from the ejs form todoItem
    .then(result => { // if insertion of document is successful, log 'Todo Added' and refresh page to root
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error)) // catch if error
})

app.put('/markComplete', (request, response) => { // request to mark item as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // go into the collection of todos and update the value that the user clicked on
        $set: { // set completed property to true
            completed: true
          }
    },{
        $sort: {_id: "-1"}, // sorts the item
        upsert: false // if set to false, it will not create a document if specificed one doesn't exist
    })
    .then(result => { // logs 'Marked Complete' and responds with 'Marked Complete' to main.js which then logs it into it's console
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) // catch any errors

})

app.put('/markUnComplete', (request, response) => { // request to mark item as uncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// go into the collection of todos and update the value that the user clicked on
        $set: {// set completed property to false
            completed: false
          }
    },{
        sort: {_id: -1}, // sorts the item
        upsert: false // if set to false, it will not create a document if specificed one doesn't exist
    })
    .then(result => {// logs 'Marked Uncomplete' and responds with 'Marked Uncomplete' to main.js which then logs it into it's console
        console.log('Marked Uncomplete')
        response.json('Marked Uncomplete')
    })
    .catch(error => console.error(error))// catch any errors

})

app.delete('/deleteItem', (request, response) => { // delete request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // go into database and find item to delete
    .then(result => { // if successful
        console.log('Todo Deleted') // log deleted
        response.json('Todo Deleted') // response to main.js deleted
    })
    .catch(error => console.error(error)) // catch error

})

app.listen(process.env.PORT || PORT, ()=>{ // listens for a local PORT or env variable PORT number
    console.log(`Server running on port ${PORT}`) // log that the server is connected and running on what port
})