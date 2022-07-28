// Require the express module, set it to a variable; requiring a module brings it into the app
// Express will be used to serve files easily
const express = require('express')
// Set the express function to a variable to create an application object and gives access to its functionality
const app = express()
// Require the mongodb module
// mongodb serves as the database, storing items on the todo list
const MongoClient = require('mongodb').MongoClient
// Set the port number for the server to listen on – when running it will be found on that port via localhost
const PORT = 2121
// Require the dotenv module
// dotenv gives access to the environment, used to store necessary info (in this case the DB_STRING)
// this allows the app to be easily used in other environments
require('dotenv').config()

// Create db variable, set dbConnectionStr to the value in the .env file, and set dbName
// Use let to allow global use, while also enabling db to be set after the connection is made
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

 // Connect to database using dbConnectionStr
 // useUnifiedTopology prevents an outdated message
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // Await a response from the database
    .then(client => {
        // if connection made, log database name
        console.log(`Connected to ${dbName} Database`)
        // assign db to connected db for later use
        db = client.db(dbName)
    })

// Set EJS as view engine – allows dynamic creation of html based on data 
app.set('view engine', 'ejs')
// Allow express to easily access to files in the public folder – don't have to hardcode paths
// to files in the folder
app.use(express.static('public'))
// Use express's built-in method to recognize request object as strings or arrays
app.use(express.urlencoded({ extended: true }))
// Use express's built-in method to recognize request object as json
app.use(express.json())

// set response for the default path
app.get('/',async (request, response)=>{
    // Grab all items that have been added to the todo list already and returns them as an array
    // Use an await to allow the creation of the function outside of Mongo.connect
    const todoItems = await db.collection('todos').find().toArray()
    // Grab all items that haven't been checked off the list
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Send response: items in index.ejs fill with toDoItems, left fills itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    
    // This next section does the exact same thing, just by using promises instead of async await
    // It is commented out, as its unnecessary.
    
    // This creates a promise, gets all of the items listed in todos in the database and puts them in an array
    // db.collection('todos').find().toArray()
        // This line runs if the promise suceeds
    // .then(data => {
        // This creates another promise, grabbing only the items in todos that haven't been completed
    //     db.collection('todos').countDocuments({completed: false})
            // If the promise succeeds, this line runs
    //     .then(itemsLeft => {
                // Render index.ejs as a response, with items filled with data, and left filled with itemsLeft
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
        // This line runs if a promise fails – if so, it logs the error
    // .catch(error => console.error(error))
})
// set post for the path /addToDo
app.post('/addTodo', (request, response) => {
    // Create a promise; add an item to todos, todoItem from request.body will be thing, completed set to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // Runs when promise suceeds
    .then(result => {
        // log confirmation of todo added
        console.log('Todo Added')
        // return to default path
        response.redirect('/')
    })
    // If error, log the error
    .catch(error => console.error(error))
})
// Set put for the path /markComplete
app.put('/markComplete', (request, response) => {
    // Create a promise; update an item from todo, thing is gotten from request body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // continuing the same function, sets completed to true for item specified by thing
        $set: {
            completed: true
          }
    },{

        sort: {_id: -1},
        // Prevent insertion of new document if no match is found
        upsert: false
    })
    // If the promise succeeds, this line runs
    .then(result => {
        // log marked complete
        console.log('Marked Complete')
        // sends a response json containing marked complete
        response.json('Marked Complete')
    })
    // If an error occurs, log it
    .catch(error => console.error(error))

})
// Set put for the path /markUnComplete
app.put('/markUnComplete', (request, response) => {
    // Create a promise; in the todos collection update one item, thing will be itemFromJS in the request body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Set completed for that item to false
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        // Prevent insertion of new document if no match is found
        upsert: false
    })
    // Run if promis succeeds
    .then(result => {
        // Log marked incomplete
        console.log('Marked Incomplete')
        // Responsd with json containing marked incomplete
        response.json('Marked Incomplete')
    })
    // If promise fails, log error
    .catch(error => console.error(error))

})
// Set delete for path /deleteItem
app.delete('/deleteItem', (request, response) => {
    // Create promise; from collection todos, delete an item, thing taken from itemFromJS in request body
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // Run if promise succeeds
    .then(result => {
        // Log todo deleted
        console.log('Todo Deleted')
        // Respond with json containing todo deleted
        response.json('Todo Deleted')
    })
    // If promise fails, log error
    .catch(error => console.error(error))

})
// Setup server on port, either in .env file, or contained in port variable
app.listen(process.env.PORT || PORT, ()=>{
    // log that server is running on port number
    console.log(`Server running on port ${PORT}`)
})