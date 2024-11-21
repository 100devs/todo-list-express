// Import the express library
const express = require('express')
// Initialize express in the application
const app = express()
// Add mongoDB to the application
const MongoClient = require('mongodb').MongoClient
// Set a specific port where the server can listen locally
const PORT = 2121
// Add any key-value pairs from our .env file to our process.env object so that we can access them in our server while keeping them private
require('dotenv').config()

// Create an empty variable that will eventually point to our database
let db,
    // Store the MongoDB connection string from the .env file
    dbConnectionStr = process.env.DB_STRING,
    // Specify the name of our MongoDB collection so that we'll be able to access it later
    dbName = 'todo'

// Connect to the MongoDB database via the connection string and specify that we want to handle our database items in the default way
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// If connection is successful, 
    .then(client => {
        // Print a confirmation message to the console
        console.log(`Connected to ${dbName} Database`)
        // Specify that our db variable should point to the collection called 'todo' from the database we just connected to
        db = client.db(dbName)
    })

// Set EJS as the view engine so that we can serve dynamic HTML with JavaScript behavior
app.set('view engine', 'ejs')
// Use express to serve static files from the public directory
app.use(express.static('public'))
// Set up middleware to parse URL-encoded data, like from form submissions, and specify that the data can be in copmlex formats like arrays and objects
app.use(express.urlencoded({ extended: true }))
// Set up middleware to parse JSON data and convert it to JavaScript objects
app.use(express.json())

// Tell the server what to do when a user reaches the home page (root directory)
app.get('/',async (request, response)=>{
    // Store a list of todo items by going to the database, finding every item there, and converting that set of items to an array of objects
    const todoItems = await db.collection('todos').find().toArray()
    // Store the number of unfinished items by going to the database and counting all of the documents with a completed status of 'false'
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Render the list of to-do items and the count of how many items are left in the EJS, which will output HTML that will display in the DOM
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

// Tell the server what to do when a user adds a new todo
app.post('/addTodo', (request, response) => {
    // Go to the database collection 'todos' and add one todo with the completed value of false and the text set to whatever the user put in the form
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // If that action is successful,
    .then(result => {
        // Print a confirmation message to the console
        console.log('Todo Added')
        // Refresh the page to display to run the GET request at the root directory (show the new list, including the added todo)
        response.redirect('/')
    })
    // Otherwise, throw an error
    .catch(error => console.error(error))
})

// Tell the server what to do when a user clicks on an item, marking it as complete
app.put('/markComplete', (request, response) => {
 // Go to the database collection 'todos' and find the first todo where the todo's text is the same as what the user clicked
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Specify that we want to edit the todo that contains the text we specified above
        $set: {
            // In that todo, change the completed value to 'true'
            completed: true
          }
    },{
        // Sort the todos in descending order
        sort: {_id: -1},
        // Specify that we do not want to create a todo if no matching item is found
        upsert: false
    })
    // If the completed status update is successful,
    .then(result => {
        // Print a confirmation message to the console that is visible to whoever is running the server
        console.log('Marked Complete')
        // Send a confirmation message back to the client-side JavaScript
        response.json('Marked Complete')
    }) 
    // Otherwise, throw an error
    .catch(error => console.error(error))

})

// Tell the server what to do when the user clicks a completed item, marking it as uncomplete
app.put('/markUnComplete', (request, response) => {
    // Go to the database collection 'todos' and find the first todo where the todo's text is the same as what the user clicked
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Specify that we want to edit the todo that contains that text
        $set: {
            // In that todo, update the 'completed' value to false
            completed: false
          }
    },{
        // Sort the todos in reverse order
        sort: {_id: -1},
        // Specify that we do not want to add a new todo if a matching todo is not found
        upsert: false
    })
    // If the action above is successful,
    .then(result => {
        // Print a confirmation message to the console that is visible to whoever is running the server
        console.log('Marked Complete')
        // Send a confirmation message to the client-side JavaScript
        response.json('Marked Complete')
    })
    // Otherwise, throw an error
    .catch(error => console.error(error))

})

// Tell the server what to do when the user clicks the trash can icon next to a todo, deleting that todo
app.delete('/deleteItem', (request, response) => {
    // Go to the database collection 'todos' and delete the first todo where the text is the same as the text next to the clicked trashcan
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // If the deletion is successful
    .then(result => {
        // Print a confirmation message to the console that is visible to whoever is running the server
        console.log('Todo Deleted')
        // Send a confirmation message to the client-side JavaScript
        response.json('Todo Deleted')
    })
    // Otherwise, throw an error
    .catch(error => console.error(error))

})

// Tell the server to listen on the port we set in our ENV file, or if that doesn't work, listen the port that we set in our PORT variable above
app.listen(process.env.PORT || PORT, ()=>{
    // If that works, print a confirmation message to the console
    console.log(`Server running on port ${PORT}`)
})