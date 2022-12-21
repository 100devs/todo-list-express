const express = require('express') // Import express module
const app = express() //create express app
const MongoClient = require('mongodb').MongoClient // Import MongoClient to connect to a MongoDB database
const PORT = 2121 // Set the port for the server to listen on
require('dotenv').config() // Load environment variables from the .env file


let db, // declare a variable to hold the database connection
    dbConnectionStr = process.env.DB_STRING, // get the connection string for the database from an environment variable
    dbName = 'todo' // define the name of the database

    // connect to the database using the MongoClient and save the connection to the db variable
    MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') // Set the view engine to EJS
app.use(express.static('public')) // Serve static files from the "public" directory
app.use(express.urlencoded({ extended: true })) // Enable app to parse URL-encoded bodies
app.use(express.json()) //Enable app to parse JSON-encoded bodies


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //get all the todo items from the todos collection, convert to array, and assign them to the todoItems variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //get the number of items that are not completed from todos collection, count them and assign value to itemsLeft variable
    response.render('index.ejs', { items: todoItems, left: itemsLeft })// Render the EJS template, passing in the todo items and the count of items left to complete
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    // Insert a new document into the 'todos' collection in the database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // Log a message and redirect the client to the root path '/'
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => {
        // Log any errors that occur
        console.error(error)
    })
})


app.put('/markComplete', (request, response) => {
    // Update the document in the 'todos' collection that matches the 'itemFromJS' field in the request body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Set the 'completed' field to true
        $set: {
            completed: true
          }
    },{
        // Sort the documents in descending order by _id and do not upsert if no documents match the query
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // Log a message and send a JSON response to the client
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => {
        // Log any errors that occur
        console.error(error)
    })

})

app.put('/markUnComplete', (request, response) => {
    // Update the document in the 'todos' collection that matches the 'itemFromJS' field in the request body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Set the 'completed' field to false
        $set: {
            completed: false
          }
    },{
        // Sort the documents in descending order by _id and do not upsert if no documents match the query
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // Log a message and send a JSON response to the client
        console.log('Marked Uncomplete')
        response.json('Marked Uncomplete')
    })
    .catch(error => {
        // Log any errors that occur
        console.error(error)
    })

})


app.delete('/deleteItem', (request, response) => {
    // Delete the document in the 'todos' collection that matches the 'itemFromJS' field in the request body
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // Log a message and send a JSON response to the client
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => {
        // Log any errors that occur
        console.error(error)
    })

})


// Start the server and listen on the specified port
app.listen(process.env.PORT || PORT, ()=>{
    // Log a message when the server is started
    console.log(`Server running on port ${PORT}`)
})
