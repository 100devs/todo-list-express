const express = require('express')//Making it possible to use express in this file
const app = express()//Setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient//Makes it possible to use methods associated with MongoClient and talk to the DB
const PORT = 2121//Setting a variable to define the location where the server will be listening 
require('dotenv').config()//Allows to access to variables inside of the .env file


let db,// Declaring a variable called db, but not assigning a value
    dbConnectionStr = process.env.DB_STRING,//Declaring a variable and assigning the database connection string to it
    dbName = 'todo'//Declaring a variable and assigning the name of the database it will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//Creating a connection to MongoDB, and passing in the connection string. Also passing in an additional property
    .then(client => {//Waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`)//Logging to the console a template literal 'connected to database'
        db = client.db(dbName)//Reassigning the db that contains a db client factory method
    })//Closes the .then

    //Middleware
app.set('view engine', 'ejs')//Sets EJS as the default render method
app.use(express.static('public'))//Sets the location for static assets
app.use(express.urlencoded({ extended: true }))//Tells express to decode and encode URLs where the header matches the content. Supports arrays and object
app.use(express.json())//Parses JSON content from incoming requests


app.get('/',async (request, response)=>{//Starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()//Sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//Sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//Rendering the EJS file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})//Ends the GET method

app.post('/addTodo', (request, response) => {//Starts a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//Inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => {//If insert is successful, do something
        console.log('Todo Added')//console log action
        response.redirect('/')//Redirects back to the root page and gets rid of the /addTodo route
    })//Closes the .then
    .catch(error => console.error(error))// Catching Errors
})//Closing the POST method

app.put('/markComplete', (request, response) => {//Starts a PUT method when the markComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//Look in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {//
            completed: true//Set completed status to true
        }
    },{
        sort: {_id: -1},//Moves item to the bottom of the list
        upsert: false//Prevents insertion if item does not already exist
    })
    .then(result => {//Starts a .then if update was successful
        console.log('Marked Complete')//Console log the successful completion
        response.json('Marked Complete')//Sending a response back to sender
    })//Closing .then
    .catch(error => console.error(error))//Catching errors

})//Ending PUT method

app.put('/markUnComplete', (request, response) => {//Starts a PUT method when the markUnComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//Look in the database for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false//Set completed status to false
        }
    },{
        sort: {_id: -1},//Moves item to the bottom of the list
        upsert: false//Prevents insertion if item does not already exist
    })
    .then(result => {//Starts a .then if update was successful
        console.log('Marked Complete')//Console log the successful completion
        response.json('Marked Complete')//Sending a response back to sender
    })//Closing .then
    .catch(error => console.error(error))//Catching errors

})//Ending PUT method

app.delete('/deleteItem', (request, response) => {//Starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//Look in the database for one item matching the name of the item passed in from the main.js file that was clicked on
    .then(result => {//Starts a .then if delete was successful
        console.log('Todo Deleted')//Console log the successful completion
        response.json('Todo Deleted')//Sending a response back to sender
    })//Closing .then
    .catch(error => console.error(error))//Catching errors

})//Ending the DELETE method

app.listen(process.env.PORT || PORT, ()=>{//Setting up which PORT will be listened on - either the port from.env file of the port variable that was assigned
    console.log(`Server running on port ${PORT}`)//Console log the running port
})//Ending the Listen method