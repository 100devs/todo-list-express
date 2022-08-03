// making it possible to use express in our project
const express = require('express')
// we're assigning the express function call as a variable called app
const app = express()
// makes it possible to use methods associated with MongoClient (class) and talk to our DB
const MongoClient = require('mongodb').MongoClient
// setting a caonstant to define the posrt of the location of where our server will be listening a fixed, all caps because its a global constant
const PORT = 2121
// Allows us to look for or access variables inside the dotenv fime (i.e: database passwords, usernames and api keys)
require('dotenv').config()

// declaring a variable not assigning it a value
let db,
    // declaring a variable and assigning it out database connection string
    dbConnectionStr = process.env.DB_STRING,
    // decalring a variable and setting the name of the data base we want to access
    dbName = 'todo'

// creating a connection to mondoDB and passing in our connection string as well as well an another property. this is establishing a promise
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // promise is if the connection is successfull do the following. waiting for the connection and processding if successful and also passing in all the client information
    .then(client => {
        // log the connection to the todo database 
        console.log(`Connected to ${dbName} Database`)
        // we are assigning a value to previously declared db variable that contains the db client factory method
        db = client.db(dbName)
    // closing out .then
    })
 
// the following is middleware = helps open the communiction channels for our requests

// sets as the default render method
app.set('view engine', 'ejs')
// sets the location for static assests, backend knows where to look fot them
app.use(express.static('public'))
// tell express to deocde and encode URLs where the header matches the content. suppports arrays and object
app.use(express.urlencoded({ extended: true }))
// Parses JSON content from incoming requests
app.use(express.json())


// starts a get request when the route is passed in, sets req and res parameters
app.get('/',async (request, response)=>{
    // sets a variable and awaits all items from the todos collection and turns to an array
    const todoItems = await db.collection('todos').find().toArray()
    // sets a variable and awaits count of the items from the todos collection where completed == false to later display in EJS
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // respond with the rendered EJS and passing through the db items and count remaining inside of an object so that we can access it in our EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// starts post request (create) on the '/addTodo' route (route comes from form) and passes and req and res parameter. used to add something to our database
app.post('/addTodo', (request, response) => {
    // go to the todos collection and add an object with 2 keys, thing and completed. value for thing comes from the input box from the form that has the name toDoItem, key completed is made false. inserts a new item in the todo collection
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // promise syntax, if insert successful do the following
    .then(result => {
        // log the action
        console.log('Todo Added')
        // take response and redirect from '/addTodo' route to the homepage '/' 
        response.redirect('/')
    })
    // catch block to handle errors and log the error if one is found
    .catch(error => console.error(error))
})

// starts PUT request (update) when '/markComplete' route is passed
app.put('/markComplete', (request, response) => {
    // look in the db for for one item matching the name of the item passed from the main.js file that was clicked on. better to target the ID instead of the text
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // updating the items complete value to true
        $set: {
            completed: true
          }
    },{
        // moves item to the bottom of the list
        sort: {_id: -1},
        // prevents insertion if item does not already exist
        upsert: false
    })
    // starts a then if update was successful
    .then(result => {
        // log that the update was complete
        console.log('Marked Complete')
        // triggers our main.js function and gets put to data variable and then that variable is consoled log, tells main that the request was completed. sending response back to sender
        response.json('Marked Complete')
    })
    // catch to handle errors
    .catch(error => console.error(error))

})

// same as put request as above, but the opposite
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// starts DELETE request when the /deleteItem route is passed
app.delete('/deleteItem', (request, response) => {
    // looking inside todos collection and use the delete one method match item and find it against the name that was passed from EJS to main.js 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // starts a .then if delete was successful
    .then(result => {
        // log success
        console.log('Todo Deleted')
        // sendign a resonse back to sender
        response.json('Todo Deleted')
    })
    // catch for errors
    .catch(error => console.error(error))

})

// setting up which port we will be listening on and gets the one from ENV file OR the PORT variable we set earlier
app.listen(process.env.PORT || PORT, ()=>{
    // if the server is running log it
    console.log(`Server running on port ${PORT}`)
})