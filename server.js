const express = require('express') // import express library
const app = express() // create an instance of express library, called app
const MongoClient = require('mongodb').MongoClient // import MongoDB client
const PORT = 2121 // set express listening port
require('dotenv').config()  // import 'dotenv' and run .config method to load variables from '.env' (personal db connection string)


let db, // delcare a variable without assigning value
    dbConnectionStr = process.env.DB_STRING, // declare a variable and assign DB connection string from .env file
    dbName = 'todo' // declare a variable and assignthe name of the db being used

// create a connection to MongoDB, pass in connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => { // waiting for the connection and proceeding if successful
        console.log(`Connected to ${dbName} Database`) // log template literal to console
        db = client.db(dbName) // assigning value to declared db variable that contains a db client factory method
    }) // close .then statement
    

app.set('view engine', 'ejs') // sets ejs as default rendering method
app.use(express.static('public')) // sets location for static, public facing assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URIs where the header matches the content
app.use(express.json()) // parse JSON content from incoming requests


app.get('/',async (request, response)=> { // starts an express GET method when the root route is passed in, sets req/res params
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits all items from 'todos' collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable kand awaits a count of uncompleted items to display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering EJS file and pass through db items, count remaining
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts an express POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new items into 'todos' collection, given a completed value of false by default
    .then(result => { // if inserted successfully, do some thing
        console.log('Todo Added') // log action to console
        response.redirect('/') // redirect back to root page
    }) // closing for .then
    .catch(error => console.error(error)) // catching errors
}) // ending POST method

app.put('/markComplete', (request, response) => { // starts an express PUT method when the markComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from main.js file click event
        $set: {
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update successful
        console.log('Marked Complete') // log successful completion 
        response.json('Marked Complete') // sending response back to sender
    }) // closing .then
    .catch(error => console.error(error)) // catching errors
}) // ending PUT

app.put('/markUnComplete', (request, response) => { // starts an express PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from main.js file click event
        $set: {
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a then, if update was successful
        console.log('Marked Complete') // log successful completion
        response.json('Marked Complete') // sending response back to sender
    }) // closing .then
    .catch(error => console.error(error)) // catching errors

})

app.delete('/deleteItem', (request, response) => { // starts an express DELETE method when the delete route is passed in         
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look in the 'todos' collection for the ONE item that has a matching name from our main.js file click event
    .then(result => { // starts a then if delete was successful
        console.log('Todo Deleted') // logging successful completion
        response.json('Todo Deleted') // sending response back to sender
    }) // closing .then
    .catch(error => console.error(error)) // catching errors

})
 
app.listen(process.env.PORT || PORT, ()=>{ // establish which port to listen on, either from .env filel or PORT variable
    console.log(`Server running on port ${PORT}`) // log which port the server is running on in console
}) // end the listen method