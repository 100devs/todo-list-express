const express = require('express') // make express available
const app = express() // setting a variable and assigning it to express
const MongoClient = require('mongodb').MongoClient // make the MongoClient available
const PORT = 2121 // set the port to 2121, which is the port that the server will listen on
require('dotenv').config() // make sure that the .env file is available, which is where we hide credentials


let db, // declare a variable caled db and not assign a value
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning it to the DB_STRING from the .env file
    dbName = 'todo' // declaring a variable and assigning it to the name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to MongoDB, and passing in our connection string, and passing in an additional property, which is to use the unified topology
    .then(client => { // if the connection is successful, run the following code
        console.log(`Connected to ${dbName} Database`) // log to the console that we are connected to the database
        db = client.db(dbName) // set the db variable to the database we connected to
    }) // end of then block

//middleware
app.set('view engine', 'ejs') // set the view engine to ejs, which is a templating engine, and make it available to the app
app.use(express.static('public')) // make the public folder available to the app, and make it available to the browser, and make it available to the server
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. Supports arrays and objects.
app.use(express.json()) // parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up req/res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets variable and awaits all the items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file, and passing through the db items and the count of remaining inside an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into the todos collection, and gives it a completed value of false
    .then(result => { // if the insert is successful, run the following code
        console.log('Todo Added') // log to the console that we have added a todo
        response.redirect('/') // gets rid of the /addTodo route, and redirects to the root route (homepage)
    }) // end of then block
    .catch(error => console.error(error)) // catches any errors and logs them to the console
}) // end of post method

app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { 
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves the item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // if the update is successful, run the following code
        console.log('Marked Complete') // log to the console that we have marked a todo as complete
        response.json('Marked Complete') // sends a response back to the main.js file
    }) // end of then block
    .catch(error => console.error(error)) // catches any errors and logs them to the console

}) // end of put method

app.put('/markUnComplete', (request, response) => { // starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1}, // moves the item to the bottom of the list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // if the update is successful, run the following code
        console.log('Marked Complete') // log to the console that we have marked a todo as complete
        response.json('Marked Complete') // sends a response back to the main.js file
    }) // end of then block
    .catch(error => console.error(error)) // catches any errors and logs them to the console

}) // end of put method

app.delete('/deleteItem', (request, response) => { // starts a DELETE method when the deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
    .then(result => { // if the delete is successful, run the following code
        console.log('Todo Deleted') // log to the console that we have deleted a todo
        response.json('Todo Deleted') // sends a response back to the main.js file
    }) // end of then block
    .catch(error => console.error(error)) // catches any errors and logs them to the console

})// end of delete method

app.listen(process.env.PORT || PORT, ()=>{ // starts the server, and listens on the port that is set in the .env file
    console.log(`Server running on port ${PORT}`) // log to the console that the server is running on the port that is set in the .env file
}) // end of listen method