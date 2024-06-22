const express = require('express') //making it possible to use express framework in this file
const app = express() //setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //setting a constant to define the location where our server listen
require('dotenv').config()  //used to load environment variables from a .env file into process.env


let db, //declare a variable called db but not assigning any value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigns our db connection string to it
    dbName = 'todo' //declaring a variable and assigning the name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB and passing in our connection string , also passing in additional properties
    .then(client => { //waiting for the connection and proceeding if successful, and passing all the client information    
        console.log(`Connected to ${dbName} Database`) // logging the "Connected to todo Database" if connection is successful
        db = client.db(dbName) //assigning a value to previously declared db variable that contains db client factory method
    }) //closing our .then

//middleware
app.set('view engine', 'ejs') //setting ejs as default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //parses JSON content


app.get('/', async (request, response) => { //starts a GET method when the root route is passed in, sets up request and response parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable, awaits ALL items from the todos collection which is also converted into an Array
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })//sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file and passing the db items and the remaining count inside of an object

    // Almost the same thing but it's using classic Promise syntax instead of newer Async Await method
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //Starts a POST method when the addTodo route is triggered
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })//inserts a new item to todos collection, with a key named thing and value is the task 
        .then(result => { // if insert is successful, do something
            console.log('Todo Added') // logging to the console
            response.redirect('/') //redirecting back to the home page
        }) //closing the .then
        .catch(error => console.error(error)) //catching errors
}) //ending the POST

app.put('/markComplete', (request, response) => { //Starts a PUT method when the markComplete route is triggered
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //set completed property with value of true
        }
    }, {
        sort: { _id: -1 }, //moves item to the bottom of the list
        upsert: false //prevents insertion if item doesnot exist already
    })
        .then(result => { //starts a then if update was successful
            console.log('Marked Complete') //logging successful completion
            response.json('Marked Complete') //sending a response back to the sender
        }) //closing .then
        .catch(error => console.error(error)) //catching the errors

}) //ending the PUT

app.put('/markUnComplete', (request, response) => { //Starts a PUT method when the markUnComplete route is triggered
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false //set completed property with value of false
        }
    }, {
        sort: { _id: -1 }, //moves item to the bottom of the list
        upsert: false //prevents insertion if item doesnot exist already
    })
        .then(result => { //starts a then if update was successful
            console.log('Marked Complete') //logging successful completion
            response.json('Marked Complete') //sending a response back to the sender
        })
        .catch(error => console.error(error)) //catching the errors

})

app.delete('/deleteItem', (request, response) => { //Starts a DELETE method when the deleteItem route is triggered
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) //look inside the todos collection for the ONE item that has a matching item from our JS file
        .then(result => { //starts a then if delete was successful
            console.log('Todo Deleted') //logging successful completion
            response.json('Todo Deleted') //sending a response back to the sender
        })
        .catch(error => console.error(error)) //catching the errors

}) //ending delete

app.listen(process.env.PORT || PORT, () => { //setting up which port we will be listening on - either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) //console.log the running port
}) //closing the listen method