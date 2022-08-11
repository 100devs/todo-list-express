const express = require('express') // create a variable holding a call to the use of express
const app = express() // create a variable and store an instance of express as a function
const MongoClient = require('mongodb').MongoClient // create a function and store a call to the mongo client functionality like communicating to MongoDB 
const PORT = 2121 // creates a variable and stores the chosen port number
require('dotenv').config() // allow use of variables in the .env file


let db, // create global variable db
    dbConnectionStr = process.env.DB_STRING, // create global variable and assign it to the database connection string in .env
    dbName = 'todo' // create a variable and assign it to the name of our database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Creating a connection to MongoDB, passing into it the connection string in the variable, and choosing to use the Unified Topology
    .then(client => { // Uses the promise retruned from MongoClient if it's successful and storing it in client
        console.log(`Connected to ${dbName} Database`) // log to console a template literal with the database name inserted to confirm successful access
        db = client.db(dbName) // assigns the db variable to a db client factory method
    }) // clost the then
    
    //middleware to open comunication channels
app.set('view engine', 'ejs') // sets ejs as the default renderer for html
app.use(express.static('public')) // sets the location for static assets like css and js
app.use(express.urlencoded({ extended: true })) // sets express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) // parses JSON content


app.get('/',async (request, response)=>{ // when the root page is requested for read, create an asyncronous function with req and res parameters
    const todoItems = await db.collection('todos').find().toArray()// sets variable to contain the results of an async call to the database for the items on the todo list from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})// set variable and contain the results of an async call to the database for a count of how many tasks have completed: false on them
    response.render('index.ejs', { items: todoItems, left: itemsLeft })// use contents of response and render ejs file to html passing in todoItems and itemsLeft for ejs to finish creating the html for serving to the client
    // db.collection('todos').find().toArray()  //commented out by Leon
    // .then(data => { //commented out by Leon
    //     db.collection('todos').countDocuments({completed: false}) //commented out by Leon
    //     .then(itemsLeft => { //commented out by Leon
    //         response.render('index.ejs', { items: data, left: itemsLeft }) //commented out by Leon
    //     }) //commented out by Leon
    // }) //commented out by Leon
    // .catch(error => console.error(error)) //commented out by Leon
})//close the get

app.post('/addTodo', (request, response) => {// when addTodo is called by client, run create method to add to database, create function with two parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})// run collection function on db to add to database a todo item with the text in the imput on the page saved to thing and completed set to false
    .then(result => {// once promise resolves, run arrow function
        console.log('Todo Added')// log success message to console
        response.redirect('/')// force browser to reload root page
    })// close then
    .catch(error => console.error(error))// catch any promise rejection and log to console
})//close post

app.put('/markComplete', (request, response) => {// when client marks an item complete, run update function and create function with two params
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // goes into the database and updates a specified item in the collection
        $set: {// set a key:value pair
            completed: true // change false to true to enable completed styling line through
          }// close set
    },{// finish first task, open second
        sort: {_id: -1},// moves item just marked completed to end of list
        upsert: false// prevents insertion if item dosen't already exist
    })//end second task
    .then(result => {// handle promise fulfilment if update sucessful
        console.log('Marked Complete') // log success message to console
        response.json('Marked Complete') // send json data to main.js for output to console to fulfil promise
    })// close then
    .catch(error => console.error(error))//catch errors

})// close put

app.put('/markUnComplete', (request, response) => {// when client marks item uncomplete, run update function and create function with two params
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// enter todos collection and update item matching text in element
        $set: {// change items contents
            completed: false // change completed to hold false, removing line through styling for completed items
          }// close set
    },{// end first task, start second
        sort: {_id: -1},// move item to bottom of list
        upsert: false// prevents insertion if item dosen't already exist
    })//close task
    .then(result => {//handle promise fulfil if update successful
        console.log('Marked Complete')// log success to console
        response.json('Marked Complete')// send json success string back to main.js to fulfil promise
    })// close then
    .catch(error => console.error(error))// catch errors

})//close put

app.delete('/deleteItem', (request, response) => {//when user clicks trashcan, run delete method, create function with two params
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})// enter collection to delete one item with matching thing data
    .then(result => {// handle fulfil on successful update
        console.log('Todo Deleted')// log delete success to console
        response.json('Todo Deleted')// return json string to main.js to fulfil promise
    })//close then
    .catch(error => console.error(error))//catch errors

})//close delete

app.listen(process.env.PORT || PORT, ()=>{// setting the port to be listening on from .env file or variable we set in this file
    console.log(`Server running on port ${PORT}`)// log success to console
})// close listen