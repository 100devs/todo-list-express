const express = require('express') // making it possible to use Express
const app = express() // using app as a placeholder to use the express functions
const MongoClient = require('mongodb').MongoClient // making it possible to use the mongodb client
const PORT = 2121 // setting a port constant to determine the location where our server will be listening
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, // declare a db variable globally so we can use it in multiple functions
    dbConnectionStr = process.env.DB_STRING, // assigning our db connection string to the dbConnectionStr variable
    dbName = 'todo' // declaring a variable and assigning the name of the Database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating a connection to Mongodb and passing in our connection string. Plus an additional property
    .then(client => { // waiting for connection, proceeding if successful.
        console.log(`Connected to ${dbName} Database`) // log to console connected to 'todo' Database
        db = client.db(dbName) // assign a value to previously declared db variable that contains a db client factory method
    }) // close then

app.set('view engine', 'ejs') // sets ejs as the deafault render method
app.use(express.static('public')) // sets the location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. supports arrays and objects
app.use(express.json()) // parses JSON content


app.get('/',async (request, response)=>{ // triggers GET method on root route, either page load or refresh
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // set a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing through the db items and the count remaining inside of an object
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
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into the todos collection, defaults to false for the completed value
    .then(result => { // if insert is successful, do something
        console.log('Todo Added') // console log action
        response.redirect('/') // gets rid of the //addTodo route and redirects back to the homepage
    }) // close .then
    .catch(error => console.error(error)) // catches any error and logs it
}) // close post

app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the DB for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true // changes completed value to true
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if the item does not already exist
    })
    .then(result => { //starts a then if the update was successful
        console.log('Marked Complete') // log successful completion
        response.json('Marked Complete') // sending a response back to the sender
    })
    .catch(error => console.error(error)) // catch errors

})

app.put('/markUnComplete', (request, response) => { // starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the DB for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // changes completed value to false
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list
        upsert: false // prevents insertion if the item does not already exist
    })
    .then(result => { //starts a then if the update was successful
        console.log('Marked Complete') // log successful completion
        response.json('Marked Complete') // sending a response back to the sender
    })
    .catch(error => console.error(error)) // catch errors

})

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { // starts a then if the delete was successful
        console.log('Todo Deleted') // log successful
        response.json('Todo Deleted') // sending a response back to the sender
    })
    .catch(error => console.error(error)) // catch errors

})

app.listen(process.env.PORT || PORT, ()=>{ // setting up the port we will be listening on - either the default PORT or from the .env file
    console.log(`Server running on port ${PORT}`) // log successful server running
})
