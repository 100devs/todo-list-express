//declare all variables to utilize modules: express, mongodb
//set default port 2121
//configure dotenv file to let us look for variables inside .env file
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//declare database variables and connection strings
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connect to mongo and console log a statement if successful
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //reassigning db variable to return db client factory method
    })

//sets up middleware
app.set('view engine', 'ejs') //states that EJS will be used to render
app.use(express.static('public')) //tells express to access static assets from public folder
app.use(express.urlencoded({ extended: true })) //tells express to encode URLs where the header matches the content, extended supports arrays and objects
app.use(express.json()) //

//creates the get method (read of crud) for the root route
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //sets variable to hold ALL information from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets variable to await the countDocuments value of not completed todos
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render the response at index.ejs in an object holding items and left

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//creates the post method (create from crud) for the route /addTodo
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new thing to collection using data from the body of the request (form from client side called todoItem) and sets completed property to false
    .then(result => { //insert successful
        console.log('Todo Added') //console logs if successful
        response.redirect('/') //returns user to root
    })
    .catch(error => console.error(error)) //catch for errors
})

//creates the put method (update from crud) for the route /markComplete
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //uses method updateOne to update thing (that matches) from collection to the value of itemFromJS from the request body which was declared in main.js
        $set: {
            completed: true
          } //changes completed property to true
    },{
        sort: {_id: -1}, //moves item to bottom of list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => {
        console.log('Marked Complete') //if successful console log statement
        response.json('Marked Complete') //send back response to main.js
    })
    .catch(error => console.error(error)) //catch block for errors

})

//creates a put method (update) for the route markUnComplete
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //grabs item that matches itemFromJS
        $set: {
            completed: false
          } // sets item completed property to false
    },{
        sort: {_id: -1}, //moves item to bottom of list
        upsert: false //prevents insertion if does not exist already
    })
    .then(result => {
        console.log('Marked Complete') // console logs if successful
        response.json('Marked Complete') //sending response if complete
    })
    .catch(error => console.error(error)) //catch block for error

})

//creates a delete method for route /deleteItem
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //grabs item from itemFromJS and utilizes deleteOne method
    .then(result => {
        console.log('Todo Deleted') //console logs if successful
        response.json('Todo Deleted') //send response
    })
    .catch(error => console.error(error)) //catch block for errors

})

//creates the server for the app to run on specifiying which port to use from .env file and if not specified, using a default
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
}) //console logs if successful 