const express = require('express') //making it possible to use express in this file
const app = express() // setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 // setting a constant that will dictate the location where our server will be listening
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declaring a variable without assigning it a value
    dbConnectionStr = process.env.DB_STRING, // declaring a variable and assigning our database connection string to it
    dbName = 'todo' // declaring a variable and assigning the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection via promise to Mongodb and passing our connection string, also passing in an additional property
    .then(client => { // only execute this method if the above promise is successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) // assigning a value to previously declared db variable that contains a db client factory method
    })
    
// middleware
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decose and encode URLs where the header matches the content. supports arrays and objects
app.use(express.json()) // parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits ALL items from the todos collection and converting that data into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits the number of items that are marked as incomplete
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the ejs file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, and marks it as incomplete
    .then(result => { // if insert is successful, do something
        console.log('Todo Added')
        response.redirect('/') // redirect the user back to the home page
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to bottom of list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete')
        response.json('Marked Complete') // sending a response back to the sender
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { // starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // set completed statusd to true
          }
    },{
        sort: {_id: -1}, // moves item to bottom of list
        upsert: false // prevents insertion if item does not already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete')
        response.json('Marked Complete') // sending a response back to the sender
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { // starts a PUT method when the deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})// look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
    .then(result => { // starts a then if update was successful
        console.log('Todo Deleted')
        response.json('Todo Deleted') // sending a response back to the sender
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port we will be listening on - either the port in the .env file or the PORT variable declared
    console.log(`Server running on port ${PORT}`)
})