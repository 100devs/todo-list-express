 const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

// initialize global variables
let db,
    // assign values to variables to get the database string from the local env file to write to a database
    dbConnectionStr = process.env.DB_STRING,
    // setting the name of the database I want to access
    dbName = 'todo'
// connect to database and then assign 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // .then used to handle resolution of asynchronus task, proceeds if successful 
    .then(client => {
        // after the asychronous task has resolved a console log will show that we have successfully connected to the database
        console.log(`Connected to ${dbName} Database`)
        // sets the previously assigned variable to a be a factory method for the current clent
        db = client.db(dbName)
    })

    // Middleware setup
// set the viewing engine to embedded javaScript to render HTML
app.set('view engine', 'ejs')
// sets up the environment to only access files in the public folder
app.use(express.static('public'))
// sets post and put information to be encoded properly and safely to send data, extended part supports arrays, objects, nested arrays etc
app.use(express.urlencoded({ extended: true }))
// sets the body parser to use expresses json method
app.use(express.json())


// express read request, route set to the root/default, sets request and response params
app.get('/',async (request, response)=>{
    // sets varable, assigns the value of --awaitng the retrieval of ALL the todos, makes it an array -- 
    const todoItems = await db.collection('todos').find().toArray()
    // set variable that awaits a count of uncompleted items to later display in EJS
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // render the EJS, passes in an object that contains todoItems, and itemsLeft 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // this does the same as the lines 35 to 41, uses classic promises syntax not async await
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// create request, set to the addTodo route, sets params to req and res
app.post('/addTodo', (request, response) => {
    // adds a todo item to the todos database collection under todoItem witha completed status of false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // .then used to handle an asynchronous task, proceeeds if successful
    .then(result => {
        // logs that a todo item was added when the .then resolves
        console.log('Todo Added')
        // leaves current route of addTodo and goes back to the root/home route
        response.redirect('/')
    })
    // if any errors are thrown, catch block will handle them and log the error
    .catch(error => console.error(error))
})


// update request under the markComplete route, sets params to req and res
app.put('/markComplete', (request, response) => {
    // look in the db for a name to match the name of the item that was passed in from the main.js file that was clicked on
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true // sets completed status to be true
          }
    },{
        // move item to the bottom/end of the list
        sort: {_id: -1},
        // if item does not exist the item will not go in
        upsert: false
    })
    // start of .then if request was resolved successfully
    .then(result => {
        // console logs marked complete
        console.log('Marked Complete')
        // sending a response back to the sender, closing our .then
        response.json('Marked Complete')
    })
    // if an error occurs, catch block handles it and logs the error
    .catch(error => console.error(error))

})


// update request under the markUnComplete route, sets params to req and res
app.put('/markUnComplete', (request, response) => {
    // look in the db for a name of an item that was passed in from clicking proper item on main js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // set completed status to false
        $set: {
            completed: false
          }
    },{
        // set item as bottom/last thing in the list
        sort: {_id: -1},
        // if item doesnt exist it wont be added
        upsert: false
    })
    // .then fires if task was successfully resolved
    .then(result => {
        // console logs complete
        console.log('Marked Complete')
        // responds back to show the req and res are both successful
        response.json('Marked Complete')
    })
        // if an error occurs, catch block handles it and logs the error
    .catch(error => console.error(error))

})

// delete request under the deleteItem route, sets params to req and res
app.delete('/deleteItem', (request, response) => {
    // look in the db for the todos item with the name that matches from our js file, deletes it
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // if the delete was successful
    .then(result => {
        // console.logs the results
        console.log('Todo Deleted')
        // responds to complete request
        response.json('Todo Deleted')
    })
    // if error, catch block handles it and logs error
    .catch(error => console.error(error))

})

// specifies which port we will be listening on, from env file or the variable at the top
app.listen(process.env.PORT || PORT, ()=>{
    // console logs that the server is running
    console.log(`Server running on port ${PORT}`)
})