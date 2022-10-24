const express = require('express') // making it possible to use express in this file
const app = express() // Setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //Setting a constant for our local port
require('dotenv').config() // allows us to look for variables inside of the .env file


let db,// declaring a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, // declaring a variable d
    dbName = 'todo'// declaring a variable and assigning the name of the database we will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Creating a connection to MongoDB, and passing in out connection string.
// Also passing in an additional property
    .then(client => { // waiting for the connection and proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`) // log to the console a template literal "connected to todo database"
        db = client.db(dbName) // assigning a value to prevbiouslydeclared db variable that containsa db client factory method
    }) // closing our .then
    
//Middleware
app.set('view engine', 'ejs') // sets ejs as the default render
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // Tells express to decode and encode URLs where the header matches the content.Supports arrays and objects
app.use(express.json()) // Parsses JSON content from incoming requests


app.get('/',async (request, response)=>{ // Starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits ALL items from the todos Collection 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Sets a variable and awaits a count of uncompleted items to later display in EJS 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Rendering the ejs file and passing through the db items and the count remaining inside of an object 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error)) // Catch any errors
}) // closing the get medthod 

app.post('/addTodo', (request, response) => { // Starts a POST method when the add route is passed in.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos coolection, 
    .then(result => { // if insert is successful, do something 
        console.log('Todo Added') // console log action 
        response.redirect('/') // gets rid of the /addTodo route, and redirects back to the homepage 
    }) // closing .then
    .catch(error => console.error(error)) // catching errors
}) // ending the POSt 

app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main .js file that was clicked on 
        $set: {
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false    // prevents insertion if item does not already exist 
    })
    .then(result => { // starting a then if update was successful 
        console.log('Marked Complete') // console log complete
        response.json('Marked Complete') // sending a response back to the sender 
    }) // closing our then 
    .catch(error => console.error(error)) // catching our errors 

}) // closing put 

app.put('/markUnComplete', (request, response) => { // Starts a PUT method when the markUnComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main .js file that was clicked on
        $set: {
            completed: false// set completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false  // prevents insertion if item does not already exist
    })
    .then(result => { // starting a then if update was successful 
        console.log('Marked Complete') // console log complete
        response.json('Marked Complete')// sending a response back to the sender 
    }) // closing our then 
    .catch(error => console.error(error))// catching our errors 

}) // closing put 

app.delete('/deleteItem', (request, response) => { // Starts a delete method when the markUnComplete route is passed in 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection for the ONE item that has a matcing name form our JS file
    .then(result => {// starting a then if update was successful 
        console.log('Todo Deleted')// console log complete
        response.json('Todo Deleted')// sending a response back to the sender 
    })// closing our then 
    .catch(error => console.error(error))// catching our errors 

})// closing delete

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on - either the port from the .env file or the port vairable we set 
    console.log(`Server running on port ${PORT}`) // console log the running port 
}) // closing port listening 