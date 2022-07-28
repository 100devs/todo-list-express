const express = require('express')                                      // making it possible to use express is this file
const app = express()                                                   // setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient                      // makes it possible to use methods associated with MobgoClient and talk to our DB
const PORT = 2121                                                       // setting a constant to define the location where our server will be listening
require('dotenv').config()                                              // allows us to look for variables inside of the .env file


let db,                                                                 // declare a veriable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING,                            // declaring a variable and assigning our db connection string to it
    dbName = 'todo'                                                     // declaring a variable and assigning the name of the db we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })      // create a connection to MongoDB and passing in our connection string and additional property
    .then(client => {                                                   // waiting for the connection and proceeding if successful, and passing in all client information
        console.log(`Connected to ${dbName} Database`)                  // log to the console a template literal 'connected to todo DB'
        db = client.db(dbName)                                          // assigning a value to previously declared DB variable, contains a db client factory method
    })                                                                  // closing our .then
  // middleware  
app.set('view engine', 'ejs')                                           // sets EJS as our default rendering method
app.use(express.static('public'))                                       // sets the location for static assets. no need to link
app.use(express.urlencoded({ extended: true }))                         // tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json())                                                 // parses JSON content from incoming requests


app.get('/',async (request, response)=>{                                                // starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()                     // sets a variable and waits for ALL items form the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})   // sets a variable and waits for a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })                 // rendering EJS file, passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()  
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {                                           // start a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  // inserts a new itm into todos collection and gives it a default 'completed' value
    .then(result => {                                                                   // if insert is successful, do something
        console.log('Todo Added')                                                       // console log action
        response.redirect('/')                                                          // redirect back to the root
    })                                                                                  // closing the .then
    .catch(error => console.error(error))                                               // catching errors
})                                                                                      // closing the POST

app.put('/markComplete', (request, response) => {                           // start a PUT (update) method when the /markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{     // look in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { completed: true }                                           // set completed status to true                                                                   
    },
    {
        sort: {_id: -1},                                                    // orders in decrementing order
        upsert: false                                                       // prevents insertion if item does not already exist
    })                                                                      
    .then(result => {                                                       // starts a .then if update was successful
        console.log('Marked Complete')                                      // logging successful completion
        response.json('Marked Complete')                                    // sending a response back to the sender
    })                                                                      // closing the .then
    .catch(error => console.error(error))                                   // error handling
})                                                                          // ending PUT

app.put('/markUnComplete', (request, response) => {                         // start a PUT (update) method when the /markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{     // look in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { completed: false }                                          //set completed status to false
    },{
        sort: {_id: -1},                                                    // orders in decrementing order
        upsert: false                                                       // prevents insertion if item does not already exist
    })
    .then(result => {                                                       // starts a .then if update was successful
        console.log('Marked Complete')                                      // logging successful completion
        response.json('Marked Complete')                                    // sending a response back to the sender
    })                                                                      // closing the .then
    .catch(error => console.error(error))                                   // error handling
})                                                                          // ending PUT

app.delete('/deleteItem', (request, response) => {                          // starts a delete methos when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})      // look inside the todos collection for the ONE itrm that has a matching name form our JS file
    .then(result => {                                                       // starts a tehn if delete was successful
        console.log('Todo Deleted')                                         // logging successful completion 
        response.json('Todo Deleted')                                       // sending a response back to the sender
    })                                                                      // closing .then
    .catch(error => console.error(error))                                   // error handling
})                                                                          // ending DELETE

app.listen(process.env.PORT || PORT, ()=>{                                  // setting up which port we wil be listening on - either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`)                           // log the running port
})                                                                          // close the listen method