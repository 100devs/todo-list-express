// App requires express
const express = require('express')
// Set a variable for express
const app = express()
// App requires mongodb
const MongoClient = require('mongodb').MongoClient
// Variable for port
const PORT = 2121
// App requires the env file for config
require('dotenv').config()

// Set variables for the mongo database using the env file as well as the database name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Connect to mongodb using your connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// Once connected, console log that we're connected to the database and set db to the database name
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
// Set the render engine to use ejs
app.set('view engine', 'ejs')
// allows us to use the static files in our public folder
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{
    // Create a variable that stores the promise(document) found in the todos collection and converts it to an array
    const todoItems = await db.collection('todos').find().toArray()
    // Create a variable that stores the promise(document) foound in the todos collection and count the documents that has a false value in the completed property
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // Send both variables to the ejs and render the HTML with items as the name of the first promise and left as the name of the second
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

// Create a post request that handles form submissions
app.post('/addTodo', (request, response) => {
    // in the todos collection, add a document that has the thing property as the todoItem value and set the completed property to false
    console.log(request, request.body)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // From that promise we're going to console log 'Todo Added' and respond with a refresh
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    // If there are any errors catch them here and respond with the error
    .catch(error => console.error(error))
})

// Put / Update request to mark complete
app.put('/markComplete', (request, response) => {
    // Go to our todos collection and update the document with the text we sent from client side
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Set the completed property to true
        $set: {
            completed: true
          }
    },
    // Set the property of the first document you find with the sorted collection
    {
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // Console log Marked Completed
        console.log('Marked Complete')
        // Respond with some json that says marked complete
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// Put / Update request to mark not complete
app.put('/markUnComplete', (request, response) => {
    // Go to our todos collection and update the document with the text we sent from client side
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // Set the completed property to false
        $set: {
            completed: false
          }
    },
    // Set the property of the first document you find with the sorted collection
    {
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // Console log Marked Completed
        console.log('Marked Complete')
        // Respond with some json that says marked complete
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// Delete request
app.delete('/deleteItem', (request, response) => {
    // Go to our todos collection and delete the document with the text we sent from client side
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // Console log todo deleted
        console.log('Todo Deleted')
        // respond with some json that says todo deleted
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// App will listen to the port and respond with what port server is running on
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})