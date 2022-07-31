const express = require('express') //making it possible to use express in this file
const app = express() //setting a variable and assigning it to the instances of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //setting a variable to determine the location where our server will be listening
require('dotenv').config() //allows us to look for variables inside .env file

let db, //declaring variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'todo' //declaring a variable and assigning the name of the database we'll be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creating a connection to MongoDv, and passing in our connection string. Also passing in an additional property
    .then(client => { //waiting for connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //logging in console the message that we successfully connected to database
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method
    }) //closing our .then

//middleware
app.set('view engine', 'ejs') //sets ejs as default render method
app.use(express.static('public')) //tells app to use folder named "public" for all of our static files (images, CSS), sets location for static assets
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //Parses JSON content

app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets the varable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray() 
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) 
}) //ending GET

app.post('/addTodo', (request, response) => { //starts a POST method when the addTodo route is passed in, sets up req and res parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //log "todo added" to console
        response.redirect('/') //get rid of /addTodos route, and redirects back to homepage
    }) //close .then
    .catch(error => console.error(error)) //catching errors
}) //ending POST

app.put('/markComplete', (request, response) => { //starts a PUT method when markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look into db for one item matching the name of the item passed in from main.js file that was clicked on
        $set: {
            completed: true //sets complated status to true
        }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item doesn't already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //log marked completed in console
        response.json('Marked Complete') //send back to response "marked complete"
    })
    .catch(error => console.error(error)) //catching errors
}) //close PUT

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look into db for one item matching the name of the item passed in from main.js file that was clicked on
        $set: {
            completed: false //set complated status to false
        }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item doesn't already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //console log marked completed
        response.json('Marked Complete') //return response of marked completed to the fetch
    })
    .catch(error => console.error(error)) //catching error
}) //close PUT

app.delete('/deleteItem', (request, response) => { //starts a delete method when delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the ONE item thas has a matching name from JS file
    .then(result => { //starts a then if delete was successful
        console.log('Todo Deleted') //log once item is deleted
        response.json('Todo Deleted') //send response back to sender
    })
    .catch(error => console.error(error)) //catch errors

}) //ending delete

app.listen(process.env.PORT || PORT, ()=>{ //setting which port we will be listening on - either port from .env or port variable we set
    console.log(`Server running on port ${PORT}`) //log running port to console
}) //end the listen method