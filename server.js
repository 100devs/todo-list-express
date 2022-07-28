// Declare variable
const express = require('express') // requiring express package downloaded via NPM
const app = express() // storing express call in variable called app (a lot nicer)
const MongoClient = require('mongodb').MongoClient // requiring mongodb package downloaded via NPM (allows use of mongodb methods)
const PORT = 2121 // Declare port
require('dotenv').config() // allows use of the .env file


// Declare mongodb connection variables
let db,
    dbConnectionStr = process.env.DB_STRING, //database connection string from .env file
    dbName = 'todo' // declare database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //support older mongo version 
    .then(client => {
        console.log(`Connected to ${dbName} Database`) //show successful connection to database
        db = client.db(dbName) // storing database information in a variable
    })

//  middleware
app.set('view engine', 'ejs') // render ejs for the client side
app.use(express.static('public')) // serve all files in public folder
app.use(express.urlencoded({ extended: true })) // middleware for parsing bodies from URL
app.use(express.json()) // It parses incoming JSON requests and puts the parsed data in req




app.get('/', async (request, response) => { // get root/default route 
        const todoItems = await db.collection('todos').find().toArray() // putting an array of todo items into the todoItems variable
        const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) // counts how many documents have been created and put into "todos" collection
        console.log(todoItems)
        response.render('index.ejs', { items: todoItems, left: itemsLeft }) //responding with ejs , passing in props 

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
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) // insert document into the database from ejs form.
        .then(result => { //if insertion of doc is successful
            console.log('Todo Added') //log todo added
            response.redirect('/') // redirect to root route
        })
        .catch(error => console.error(error)) //catch if error
})


app.put('/markComplete', (request, response) => { // request to mark as complete
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { // find the item that the user clicked on to update that item
        $set: { //set completed property to true
            completed: true
        }
    }, {
        sort: { _id: -1 }, // sort items
        upsert: false // if true and doc does not exist, create one and insert into database
    })
        .then(result => { // if update is successful
            console.log('Marked Complete') //log marked complete
            response.json('Marked Complete') // responds with marked complete which gets logged to console in main.js
        })
        .catch(error => console.error(error)) //catch any error
})


app.put('/markUnComplete', (request, response) => { //put request to mark as uncomplete
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { // find item user clicked on and update it
        $set: { //set the completed property to false
            completed: false
        }
    }, {
        sort: { _id: -1 }, //sort items
        upsert: false // if true and doc does not exist, create one and insert into database
    })
        .then(result => { //if markUncomplete is successful
            console.log('Marked Un Complete') // log marked uncomplete
            response.json('Marked Un Complete') // respond with json message  saying marked as uncomplete
        })
        .catch(error => console.error(error)) //catch any errors
})


app.delete('/deleteItem', (request, response) => { // delete request
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) // go into database and find item to delete
        .then(result => { //if successful
            console.log('Todo Deleted') //log deleted
            response.json('Todo Deleted') //response to mainjs deleted
        })
        .catch(error => console.error(error)) // catch error
})


app.listen(process.env.PORT || PORT, () => { // listens for local port or environment port
    console.log(`Server running on port ${PORT}`) // SERVER IS RUNNING, BETTER GO  CATCH IT
}) 