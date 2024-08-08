const express = require('express') // making it possible to use express in this file
const app = express() //saving express to the 'app' variable
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with mongoclient and talk to our db
const PORT = 2121 //defining a port and saving it in a constant. It's in all caps bc it's a global const, it's common practice
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, //declaring a (global) variable called db but not assigning any value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our db connection string to it
    dbName = 'todo' //declaring a variable and assigning the name of the db we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to mongodb and passing in our connection string, also passing in an additional property
    .then(client => { //the above line establishes a promise, only if the connection is succesfull we want the 'then' to run, we are also passing inn the client information
        console.log(`Connected to ${dbName} Database`) //once the connection is succesful a template literal is shown in the console
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method, this can be used later
    }) //closing .then

//all this section of code is midleware, it facilitates communaction for our requests    
app.set('view engine', 'ejs') //setting our ejs as a default render method
app.use(express.static('public')) //telling the code to look for static assets in the 'public' folder
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode urls where the header matches the content. Supports arrays and objects
app.use(express.json()) //this code replaces 'bodyParser' it parses json content from incoming requests

//express(app) methods
app.get('/', async (request, response) => { //this handles a read request. When its requested it triggers an async function with req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits. We are accesing a collection then all the items (find()) from said collection and put them in an array
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) //sets a variable and awaits a count of uncompleted items to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering ejs so that it shows an html and we're passing the items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //another express method. Starts a POST method when the '/addTodo' route is passed in
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) //look in the db, find the collection 'todos' and inserts a new item into it and sets a new object with 2 keys
        .then(result => { //if insert is succesful, do something
            console.log('Todo Added') //loging action
            response.redirect('/') //redirect back to the root, ejs is re-rendered
        }) //closing .then
        .catch(error => console.error(error)) //catching any error
}) //ending post

app.put('/markComplete', (request, response) => { //starts a PUT(update) method when the '/markComplete is passed in
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //set completed status of item to true
        }
    }, {
        sort: { _id: -1 }, //moves item to the bottom of the list in the db
        upsert: false //upsert is a mix of insertOne and update, if it's set to 'true' it will create a new item if it does no exists. When set to false, prevents insertion if item does not exists
    })
        .then(result => { //starts a .then if update was succesful
            console.log('Marked Complete') //loging succesful completion
            response.json('Marked Complete') //sending a response back to the sender
        }) //closing .then
        .catch(error => console.error(error)) //catching errors

}) //closing .put

app.put('/markUnComplete', (request, response) => { //starts a PUT(update) method when the '/markComplete is passed in
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, { //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false //set completed status of item to false
        }
    }, {
        sort: { _id: -1 }, //moves item to the bottom of the list in the db
        upsert: false //prevents insertion if item does not exists
    })
        .then(result => { //starts a .then if update was succesful
            console.log('Marked Complete') //loging succesful completion
            response.json('Marked Complete') //sending a response back to the sender
        }) //closing .then
        .catch(error => console.error(error)) //catching errors

}) //closing .put

app.delete('/deleteItem', (request, response) => { //starts a delete method when the '/deleteItem' route is passed in
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) //looks inside the 'todos' collection for the one item that has a matching name from js file
        .then(result => { //starts a .then if delete was succesful
            console.log('Todo Deleted') //log completion
            response.json('Todo Deleted') //sends response back to the sender
        }) //closing .then
        .catch(error => console.error(error)) //catching errors

}) //closing method

app.listen(process.env.PORT || PORT, () => { //setting up the port, either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) //loging the running port
}) //end the listen method