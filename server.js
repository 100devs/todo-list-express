const express = require('express') //Allows usage of express in this file
const app = express() //Sets a variable and assigns it to the instance of express
const MongoClient = require('mongodb').MongoClient //Makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //Setting a variable to determine the location where our server will be listening 
require('dotenv').config() //allows access variables inside of .env file.


let db, //Declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning database string to it
    dbName = 'todo' //declaring a variable and assigning the name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating connection to MongoDB and passing in connection string, also passes in additional property.
    .then(client => { //waiting for the connection and proceeding if it is successful, passes in client info.
        console.log(`Connected to ${dbName} Database`) //console logs a template literal
        db = client.db(dbName) //assigns a value to previous declared db variable that contains a db client factory method
    }) //closing then block
 
//Middleware
app.set('view engine', 'ejs') //Sets EJS as default render method
app.use(express.static('public')) //Sets location for static assets like css and main.js
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. SUpports arrays and objects
app.use(express.json()) //parses JSON content from incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets request and response parameters
    const todoItems = await db.collection('todos').find().toArray() //Sets variable and awaits all items from todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets variable and awaits count of uncompleted items to display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders the EJS file and passes through the db items and count remaining inside of an object
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
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection and gives it a completed value of false by default
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //console log
        response.redirect('/') //redirects back to homepage after getting rid of the /addTodo route
    })//closing then 
})//ending POST

app.put('/markComplete', (request, response) => { //Starts PUT method when markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching name of the item passed in from main.js file 
        $set: {
            completed: true //sets completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //console log successful completion
        response.json('Marked Complete') //responds with JSON file back to sender
    })
    .catch(error => console.error(error)) //catches errors

}) //ends put

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //checks db for one item matching name of the passed in item from main.js that was clicked on
        $set: {
            completed: false //sets completed status to false
          }
    },{
        sort: {_id: -1}, //moves items to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //console log successful completion
        response.json('Marked Complete') //sends response to sender
    })
    .catch(error => console.error(error)) //catches errors

}) //ends put

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //checks todos collection for the one item that has matching name from main.js file
    .then(result => { //starts a then if delete was successful
        console.log('Todo Deleted') //logging successful completion
        response.json('Todo Deleted') //sending a response back to the sender
    }) //closes then
    .catch(error => console.error(error)) //catches errors

}) //ends delete

app.listen(process.env.PORT || PORT, ()=>{ //specifies what port we should be using
    console.log(`Server running on port ${PORT}`) //console logs port running
}) //end the listen