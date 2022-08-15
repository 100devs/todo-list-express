const express = require('express') //making it possible to use express in this file
const app = express() //setting a constant and assiging it to an instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our database
const PORT = 2121 //setting a constant to define the location where our server will be listening
require('dotenv').config() //allows us to look for a variables inside of the .env file


let db, //declaring a variable called db but not assigning a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB, an passing in our connection string
    .then(client => { //waiting for the connection and proceeding if successful and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal "connected to todo Database"
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method
    }) //closing our .then


// Middleware - helps facilitate communication    
app.set('view engine', 'ejs') //setting up ejs as the default render method
app.use(express.static('public')) //sets the location for the static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //parses JSON from incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and res params
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits all items from the todo collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS and passing through the db items and the count remaining inside an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts a POST
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { //if insert is successful do something
        console.log('Todo Added') //console log action
        response.redirect('/') //gets rid of the todo route and redirects to home page
    }) //closing the .then
    .catch(error => console.error(error)) //catching errors
}) //ending the post

app.put('/markComplete', (request, response) => { //starts a PUT when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the database for one item matching the name of the item passed in from the main.ms file that was clicked on
        $set: { 
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item doesn't already exist
    })
    .then(result => { //starts a .then if update was successful
        console.log('Marked Complete') //loggin successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catching an error

})//closing the put
app.put('/markUnComplete', (request, response) => { //starts a put when the markUncomplet route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the database for one item matching the name of the item passed in from the main.ms file that was clicked on
        $set: {
            completed: false //setting the completed status of item to false
          }
    },{
        sort: {_id: -1}, //moves item to bottom of list
        upsert: false //prevents insertion if item doesn't already exist
    })
    .then(result => { //starts a .then if update was successful
        console.log('Marked Complete') //loggin successful completion
        response.json('Marked Complete') //sending a response back to the sender
    }) // close .then
    .catch(error => console.error(error)) //catching an error

}) //closing the put

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { //starts a .then if the delete was successful
        console.log('Todo Deleted') //console.log the results
        response.json('Todo Deleted') //send response back to sender
    }) //close .then
    .catch(error => console.error(error)) //catch error

}) //close out the delete

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on - either the port from the .env file if it exists or the port variable
    console.log(`Server running on port ${PORT}`) //console.log the running port
}) //close the listen method