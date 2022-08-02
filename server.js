const express = require('express') // making it possible to use express in this file //
const app = express() // we're assigning an instance of express to the constant of app //
const MongoClient = require('mongodb').MongoClient // this makes it possible for us to use methods associated with MongoClient and talk to our database //
const PORT = 8000 // this assigns the location to where our server will be listening to a global constant //
require('dotenv').config() // this allows us to access variables inside our .env file //


let db, // this declares an empty global variable of db //
    dbConnectionStr = process.env.DB_STRING, // this declares a variable for our dbconnectionstring and gets its value from the .env file //
    dbName = 'todo' // this declares a variable of our database name that matches our mongodb db name //

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // we're creating a connection to mongodb, then passing in our connection string, and then passing in additional property of useUnifiedTopology //
    .then(client => { // using a promise statement to wait for a successful connection, and passing in all the client information //
        console.log(`Connected to ${dbName} Database`) // we're logging to the console that we're successfully connected to our db //
        db = client.db(dbName) // assigning a value to our previously declared db variable that contains a db client factory method //
    }) // closing our then statement //

// **MIDDLEWARE** //
app.set('view engine', 'ejs') // an express method that tells our app that ejs is our default render method //
app.use(express.static('public')) // an express method that tells our app to look in our public folder for static assets //
app.use(express.urlencoded({ extended: true })) // an express method that tells our app to decode and encode URLs where the header matches the content... supports arrays and objects //
app.use(express.json()) // an express method that allows our app to parse JSON content from incoming requests //


app.get('/',async (request, response)=>{ // starts a get method when the root route is passed in, sets up req and res parameters //
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits all items from the todos collection //
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in EJS //
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing through the db items and the count remaining inside of an object //
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // closing our express get method //

app.post('/addTodo', (request, response) => { // starts a post method when the add route is passed in //
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new document into todos collection. this is an object with two properties, thing property (the todo item) and a completed property of false //
    .then(result => { // if insert is successful... do something... //
        console.log('Todo Added') // console logging ithe action //
        response.redirect('/') // we're forcing a refresh to display our change and return us to our root route //
    }) // closes our then portion of promise statement //
    .catch(error => console.error(error)) // catches our errors //
}) // ends the post method //

app.put('/markComplete', (request, response) => { // starts a put method when the markComplete route is passed in //
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the database for one item that matches the name of the item passed in from the main.js file that was clicked on //
        $set: {  
            completed: true // we're setting the completed status of that document to true //
          }
    },{
        sort: {_id: -1}, // moves the item to the bottom of the list //
        upsert: false // prevents insertion if item does not already exist //
    })
    .then(result => { // starts a then if update was successful //
        console.log('Marked Complete') // will console log marked complete //
        response.json('Marked Complete') // sending a response back to the sender //
    }) // closing our then statement //
    .catch(error => console.error(error)) // catching errors //

}) // ending our put //

app.put('/markUnComplete', (request, response) => { // starts a put method when the markComplete route is passed in //
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the database for one item that matches the name of the item passed in from the main.js file that was clicked on //
        $set: {  
            completed: false // we're setting the completed status of that document to false //
          }
    },{
        sort: {_id: -1}, // moves the item to the bottom of the list //
        upsert: false // prevents insertion if item does not already exist //
    })
    .then(result => { // starts a then if update was successful //
        console.log('Marked Uncomplete') // will console log marked complete //
        response.json('Marked Uncomplete') // sending a response back to the sender //
    }) // closing our then statement //
    .catch(error => console.error(error)) // catching errors //

}) // ending our put //

app.delete('/deleteItem', (request, response) => { // starts a delete method when the delete route is passed //
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look in the database for one item that matches the name of the item passed in from the main.js file that was clicked on //
    .then(result => { // if the delete was successful... then statement begins //
        console.log('Todo Deleted') // log a successful delete to our console //
        response.json('Todo Deleted') // sends a response back to our sender //
    }) // closes our then statement // 
    .catch(error => console.error(error)) // catches any errors //

}) // ends delete method //

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on (either from our .env file... else from the PORT variable declared earlier in our file) //
    console.log(`Server running on port ${PORT}`) // will log the port we're running on to the console //
}) // closes our express listen method //