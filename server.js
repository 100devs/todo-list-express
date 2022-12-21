const express = require('express') // activate Express framework in this file:
const app = express() // assign app variable to the instance of Express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our db (be able to talk to the Mongodb via .MongoClient), and assign to MongoClient variable:
const PORT = 2121 // assign port variable, setting the location for our server to listen 
require('dotenv').config() // allows us to access variables inside of .env file


let db, // declaring db variable
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our db connection string to it
    dbName = 'LeonToDoListComments' //declaring and assigning a variable to the db we want to access (cluster - db - collection - documents)

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // create a connection to MongoDB, passing in our connection string, and ensure formatting is configured correctly via useUnifiedTopology:
    .then(client => { // waiting for the connection and proceeding if successful, and passing in all client information
        console.log(`Connected to ${dbName} Database`) //logging confirmation of connecting to dbName
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method
    }) //close .then

// middleware -- helps facilitate communication between the server and client requests
app.set('view engine', 'ejs') // sets ejs as default render file
app.use(express.static('public')) // sets location for static assets
app.use(express.urlencoded({ extended: true }))  // tells express to decode and encode URLs where the header matches the content; extended supports arrays and objects    
app.use(express.json()) // parses JSON content from incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // creates variable and awaits all documents from the todos collection in array format
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // creates variable and awaits the number of collection documents NOT marked completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // the index.ejs file is rendered and passes through the db items and count remaining inside of an object. The 'items' variable is passed into the for loop, in the unordered list. The 'left' variable is passed into the h2.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error)) //catch errors
}) //end the GET method

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is called, sets req and res parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, as an object with 2 values, 'thing', which is the contents of the input textbox and 'completed' as false
    .then(result => { //if insert is successful, do something
        console.log('Todo Added') //console log the string
        response.redirect('/') //goes back to index.ejs (root) file to show updated item in DOM, from localhost:2121/addToDo
    }) //close .then
    .catch(error => console.error(error)) //catch errors
}) //end the POST method


app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in, sets req and res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //goes into our db collection, looks for ONE item that matches the inner text (itemFromJS variable from main.js file) to the text that is passed in from the main.js file that was clicked on.
        $set: {
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of list -- not sure if this does anything in this app
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response back to the sender (main.js)
    }) // close then
    .catch(error => console.error(error)) // catch errors

}) //end the PUT method

app.put('/markUnComplete', (request, response) => { //starts a PUT method when the markUnComplete route is passed in, sets req and res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //goes into our db collection, looks for ONE item that matches the inner text (itemFromJS variable from main.js file) to the text that is passed in from the main.js file that was clicked on.
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of list -- not sure if this does anything in this app
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response back to the sender (main.js)
    }) // close then
    .catch(error => console.error(error)) // catch errors

})  //end the PUT method

app.delete('/deleteItem', (request, response) => { //starts a DELETE method when the deleteItem route is passed in, sets req and res parameters
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //goes into our db collection, looks for ONE item that matches the inner text (itemFromJS variable from main.js file) to the text that is passed in from the main.js file that was clicked on, and deletes the item from the DOM and collection.
    .then(result => { //starts a then if delete was successful
        console.log('Todo Deleted') //console.log the results
        response.json('Todo Deleted') // sends a response back to sender
    }) //close .then
    .catch(error => console.error(error)) //catch errors

}) //end the DELETE method

app.listen(process.env.PORT || PORT, ()=>{ //specifies which port the server will be listening on - either the port from the .env file or PORT variable
    console.log(`Server running on port ${PORT}`) //console.log the port location confirmation
}) //end the LISTEN method
