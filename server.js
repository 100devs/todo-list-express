const express = require('express') //making it possible to use express in this file
const app = express() //setting a constant and assigning it to express
const MongoClient = require('mongodb').MongoClient //allows us to use methods associated with MongoClient and talk to our database
const PORT = 2121 //setting a constant to set the location where the server will be listening
require('dotenv').config() //allows access to the variables we set in the .env file


let db, //declaring a global variable named db but it is not assigned a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and setting it to our db string in the .env file
    dbName = 'todo' //declaring a varible and assigning it to the name of our database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connecting to MongoDB
    .then(client => { //waiting for the connection and proceeding if successful and then passing in client info
        console.log(`Connected to ${dbName} Database`) //logging to console when the database connection is complete
        db = client.db(dbName) //assigning the db variable to a db client factory method
    }) //closing the then
//middleware    
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //parses json content from incoming request


app.get('/',async (request, response)=>{ //starts the get method when the root is passsed in and sets the req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //setting a variable and awaits all the items from the todo collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits the number of uncompleted items
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the ejs file and pass through the items in the database and the count of items left


    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starting a POST method when the addTodo route is passed
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection from the text entered in the form and setting completed to false
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //logging to the console that is was successful
        response.redirect('/') //redirects to the root
    }) //closes the then
    .catch(error => console.error(error)) //catches an error and logs it to console
}) //closing the post

app.put('/markComplete', (request, response) => { //starts a put method when the markComplete route is passed through
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the database matching the name of the item that was clicked on
        $set: {
            completed: true //setting the completed value to true 
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertation if item does not already exsist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging to the console that it was successful
        response.json('Marked Complete') //sending a response back to the sender
    }) //closes the then
    .catch(error => console.error(error)) //catches errors and logging to console

}) //closing the put

app.put('/markUnComplete', (request, response) => { //starts a put method when the markUnComplete route is passed through
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the database matching the name of the item that was clicked on
        $set: {
            completed: false //setting the completed value to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertation if item does not already exsist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging to the console that it was successful
        response.json('Marked Complete') //sending a response back to the sender
    }) //closes the then
    .catch(error => console.error(error)) //catches errors and logging to console

}) //closing the put

app.delete('/deleteItem', (request, response) => { //starting the delete method when the deleteItem route is passed through
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //searching the database for the name that was passed through from our js file and deleting it
    .then(result => { //starts a then if the delete was successful
        console.log('Todo Deleted') //logs to the console that it was successful
        response.json('Todo Deleted') //sends a response that it was successful
    }) //closing our then
    .catch(error => console.error(error)) //catches errors and logs them to the console.

}) //closes the delete

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on, either form the env file or variable we set
    console.log(`Server running on port ${PORT}`) //logs to the console that the server is running
}) //closes the listen