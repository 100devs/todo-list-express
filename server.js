const express = require('express') // making it possible to use express in this file
const app = express() // setting a variable and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // mongoclient contains a static method called `connect` that we use to connect to the database. it makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //setting a constant variable to define the location where our server will be listening
require('dotenv').config() // allows us to look for variables inside of the .env file


//CONNECT TO MONGODB
let db, //declaring a variable called db with no value assigned
    dbConnectionStr = process.env.DB_STRING, //Declaring a variable and assigning our database connecting sting to it
    dbName = 'todo' // declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to mongodb and passing in our connection string. aslo passing in an additional property
    .then(client => { //promise chaining. waiting for the connection and then proceeding if successfuk and passing in all the client informaion
        console.log(`Connected to ${dbName} Database`) //logs a template literal to the console
        db = client.db(dbName) //assgning a value to previously declared db variable that contains a db client factory method
    })// close the promise chain
 
    
// MIDDLEWARE   - pipelines for our request 
app.set('view engine', 'ejs') // sets ejs as the default render method
app.use(express.static('public')) // default folder for static access.  sets the location for sta7tic asset
app.use(express.urlencoded({ extended: true })) // Tells express to decode and encode URLs where the header matches the content. supports arrays and objects
app.use(express.json()) //parses json. same logic, but for content of `application/json` type, adding the parsed JSON the response body property


//METHODS
app.get('/',async (request, response)=>{ //read request; starts a get method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a variablele and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted item to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray() //promise version of the same thing above
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //closes the async function

app.post('/addTodo', (request, response) => { //create request; starts a post method when the /addTodo route is passed in, sets up req and res parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { // if insert is successful, do something
        console.log('Todo Added') // console log action
        response.redirect('/') // redirecting to the root route. gets rid of the /addTodo route and redirect to root route(homepage)
    }) // closing the .then
    .catch(error => console.error(error)) //catching errors
}) // ending the POST

app.put('/markComplete', (request, response) => { // update request; starts a put method when the /markComplete route is passed in, sets up req and res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: { // 
            completed: true // setting completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false //insert and update; prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful 
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response back to the sender
    })
    .catch(error => console.error(error)) // catching errors

}) // ending PUT

app.put('/markUnComplete', (request, response) => { // update request; starts a put method when the /markUncomplete route is passed in, sets up req and res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // setting completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false //insert and update; prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful 
        console.log('Marked Complete') // logging successful completion
        response.json('Marked Complete') // sending a response back to the sender
    })
    .catch(error => console.error(error)) // catching errors

}) // ending PUT

app.delete('/deleteItem', (request, response) => { // starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collectionfor the ONE item that has amatching nam efrom out JS file
    .then(result => { // starts a then if delete was successful
        console.log('Todo Deleted') // logging successful completion
        response.json('Todo Deleted') // sending a response back to sender
    })// closing .then
    .catch(error => console.error(error)) // catching errors

}) // ending DELETE

app.listen(process.env.PORT || PORT, ()=>{ // setting up the port we will be listening on - either  the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) // console log the running port
}) // ending LISTEN