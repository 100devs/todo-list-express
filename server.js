const express = require('express')//making it possible to use express in this file
const app = express()//setting constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient//makes it possible to use methods associated with MongoClient and talk to our DB.
const PORT = 2121//identifies the constant port number used for the server that is listening
require('dotenv').config()//allows us to look for variables inside of the .env file


let db, //declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning to our database connection string to it
    dbName = 'todo' // declaring a variable and naming the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })// creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
    .then(client => { //waiting for the connection and proceeding if successful, and passing in all the client info
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal "connected to todo Database"
        db = client.db(dbName) //assigning a value to previously delcared DB variable that contains a db client factory method
    }) // closing our .then
    //middleware
app.set('view engine', 'ejs') //sets EJS as the default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URL's where header matches the content. Supports arrays and objects
app.use(express.json()) //Parse JSON content from incoming requests


app.get('/',async (request, response)=>{//stats GET method when the root route is passed in, sets up req /res parameter
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in EJS.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item  into todos collection,gives it a completed value of false by default
    .then(result => { // if insert is successful, do something
        console.log('Todo Added') //console.log action
        response.redirect('/') //gets rid of the /addTodo route, and redirects back to homepage
    }) //closing the .then
    .catch(error => console.error(error)) //catching errors
}) //ending POST

app.put('/markComplete', (request, response) => { //start a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { 
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exists
    })
    .then(result => { //starting a .then if update was successful
        console.log('Marked Complete') //logged successful completion
        response.json('Marked Complete') //sending response back to sender
    }) //closing .then
    .catch(error => console.error(error)) //catching errors

}) //ending Put

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // set complete status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exists
    })
    .then(result => { //starting a .then if update was successful
        console.log('Marked Complete') //logged successful completion
        response.json('Marked Complete')//sending response back to sender
    })  //closing .then
    .catch(error => console.error(error)) //catching errors

})// end PUT

app.delete('/deleteItem', (request, response) => { //starts a delete method when delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //looks inside the tood collection for the one item with matching name from JS file
    .then(result => { //starting the .then if delete was successful
        console.log('Todo Deleted') //console log results
        response.json('Todo Deleted') //send resoponse to sender
    })
    .catch(error => console.error(error)) // catch errors

}) //ending delete

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening to -either port from .env file or port variable we set
    console.log(`Server running on port ${PORT}`) //console.log running port.
}) //end listen method