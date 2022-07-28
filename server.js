// lets you use express after installing it
const express = require('express')
// allows you to use express methods
const app = express()
// makes it possible to use mongo methods
const MongoClient = require('mongodb').MongoClient
//sets a port where the server will be listening
const PORT = 2121
//allows us to look for variables inside of env file
require('dotenv').config()

// declares a variable db but does not assign a value
let db,
//declares as variable and assigning our database connection string to it
    dbConnectionStr = process.env.DB_STRING,
    //declaring a variable and assigning the name of the databse
    dbName = 'todo'
//creates a connection to MongoDB and passes in our connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => { // waits for the connection and proceeding if successful, passing in all client information
        console.log(`Connected to ${dbName} Database`) //logs to console a template literal
        db = client.db(dbName) // assigning a value to previously declared db variable that contains a db client factory method
    })
    
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode urls where the header matches the content. supports arrays and objects
app.use(express.json())//parses json content from incoming requests


app.get('/',async (request, response)=>{ //starts a get method when the root route is passed in, sets up request and response paramters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits all items from todo collections in the form of an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a varible and awaits a count of uncompleted items to later display in ehs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the ejs file and passing through the db items and the count remaining inside of an object

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//starts the post route 
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives ita completed value of false by default
    .then(result => { //if insert is successful , do something
        console.log('Todo Added') // console logs the message
        response.redirect('/') // refreshes the page
    })
    .catch(error => console.error(error)) //if there was an error or the promise was not fufilled, run the catch handler
})

// if the request was to update with route of markComplete
app.put('/markComplete', (request, response) => {
    //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true // sets completed status to true
          }
    },{
        sort: {_id: -1}, //moves the item to the bottom of the list
        upsert: false // prevents insertion if the item does not already exist
    })
    .then(result => { //if the promise is fulfilled, console log the message and return a json response to the sender
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))//catches any error or non fulfilled promises

})
// if the request was to update with route of markUnComplete
app.put('/markUnComplete', (request, response) => {
    //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false // sets completed status to false
          }
    },{
        sort: {_id: -1}, //moves the item to the bottom of the list
        upsert: false // prevents insertion if the item does not already exist
    })
    .then(result => {//if the promise is fulfilled, console log the message and return a json response to the sender
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //catches any error or non fulfilled promises

})
//starts the delete method when the delete route as passed
app.delete('/deleteItem', (request, response) => {
    //deletes one item that matches the name from the js file
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //if delete was succesfull console log the message and return a json to the sender
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //catches any errors
    .catch(error => console.error(error))

})
//tells you which port you are on, the one from heroku or the one established and console logs the message
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})