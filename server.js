const express = require('express') //sets variable to require use of Express to allow use of Express
const app = express() // sets app as variable for Express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and connect to our db
const PORT = 2121 //sets a constant for where our server will be listening
require('dotenv').config() // lets us use .env folder for storing our secret information


let db, // declares db as a global variable but does not assign a value
    dbConnectionStr = process.env.DB_STRING, // sets variable that tells code to go into .env folder and find DB_STRING variable
    dbName = 'todo' // sets variable for name of db we are accessing

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creates a connection to MongoDB and passes in our connection string and an additional property
    .then(client => { //waiting for connection and proceeding if successful and passing in client information
        console.log(`Connected to ${dbName} Database`) //logs to console a template literal confirming connection
        db = client.db(dbName) //assigns a value to previously-declared db variable that contains adb client factory method
    }) //closes the then 

//the beautiful middleware we love so much    
app.set('view engine', 'ejs') //sets ejs as the template to use
app.use(express.static('public')) // tells Express to supply static components from public folder
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. Supports arrays/objects.
app.use(express.json()) // tells Express to return the data as JSON


app.get('/',async (request, response)=>{ // starts with a GET mehtid when the root route is passed in, sets up req/res as variables
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits all items from the todos collection as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in ejs 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders the index.ejs and passes in an object that contains todo items and count remaining
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // closes 

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in from the form 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts into a collection the text that was typed into the input field of the form and set it as not completed yet
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //console log the action
        response.redirect('/') //gets rid of the '/addToDo route and returns back to the root
    })
    .catch(error => console.error(error)) // logs error to the console, if any
}) // ends the post

app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //does a fetch and passes in the innertext of the span in the list, packages it as json, sends it to our server, and the server drops it in an object to see if it matches a document in the database  
        $set: { 
            completed: true
          } //sets completed status to true
    },{
        sort: {_id: -1}, //moves item to bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logs confirmation to console
        response.json('Marked Complete') // sends response back to the sender
    }) //closes then
    .catch(error => console.error(error)) //logs error to console, if any

}) //ends put

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //goes into db to find item and sets completed item status to false
        $set: {
            completed: false
          } //sets completed status to false
    },{
        sort: {_id: -1}, //moves item to bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => {
        console.log('Marked Complete') //logs confirmation to console
        response.json('Marked Complete') // sends response back to the sender
    })
    .catch(error => console.error(error)) //logs error to console, if any


}) // ends put.

app.delete('/deleteItem', (request, response) => { //sets DELETE method 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //goes into collection to find item with matching name and delete it.
    .then(result => { //if delete is successful, do something
        console.log('Todo Deleted') //logs confirmation to console.
        response.json('Todo Deleted') // send response back to sender
    })
    .catch(error => console.error(error)) //close the 

}) //ends DELETE

app.listen(process.env.PORT || PORT, ()=>{ //specifies which port we should be listening on - either from .env file (if exists) or port variable we set
    console.log(`Server running on port ${PORT}`) //logs confirmation template literal to console
}) //closes the listen