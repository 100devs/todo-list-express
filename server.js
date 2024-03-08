// Comments explaining each line of code for the server.

// Telling the server to use Express
const express = require('express')
// Declaring a variable for Express
const app = express()
// Telling the server to use MongoDB and creates a usable binding
const MongoClient = require('mongodb').MongoClient
// declareing the port for the server to listen to
const PORT = 2121
// adding environment variables
require('dotenv').config()

// declaring variables to use with the database
let db,
// MongoDB connection string. Declared as a variable in the .env file
    dbConnectionStr = process.env.DB_STRING,
// defining the name of the MongoDB database
    dbName = 'todo'

// Connecting to the Database using the connection string from the variable declared earlier
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// After the database is connected the server runs this code
    .then(client => {
// Alerting that the server is connected to the database
        console.log(`Connected to ${dbName} Database`)
// Re-naming the earlier db variable with infrom responded from the Database
        db = client.db(dbName)
    })

// Telling the server it is using the Enhanced JS templating engine.
app.set('view engine', 'ejs')
// Telling Express to look for files and folders in the 'public' folder.
app.use(express.static('public'))
// URLencoded allows Express to pull data out of incoming requests.
app.use(express.urlencoded({ extended: true }))
// Allows Express to convert into and out of JSON.
app.use(express.json())

// Start of a Get or 'read' request.
// Server is listening to the default url with two variables representing incoming and out going information
app.get('/',async (request, response)=>{
// declaring a binding for information recieved from the database
    const todoItems = await db.collection('todos').find().toArray()
// Another binding for information from the database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
// Once information has been recieved in the above variable it will be renderd on the page using EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

//Below is another way of writing the above by declaring the db bindings within the get request
    
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// Start of a post or create request
// Telling the server to listen to the /addTodo endpoint, and gives the function instructions on what to do with the requests and responses.
app.post('/addTodo', (request, response) => {
// An instruction to enter the database and add one thing that has not been completed    
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
// After the item is inserted the following information will be sent to the browser
    .then(result => {
// Console message that the 'thing' was added
        console.log('Todo Added')
// Instruction to be sent back to the default page triggering a new get request
        response.redirect('/')
    })
// If an error happens along the way with the post there will be an error in the console
    .catch(error => console.error(error))
})

// Starting a Put or 'update' request
// Telling the server to listen to the '/markComplete' end point and what information to expect and send back
app.put('/markComplete', (request, response) => {
// Go into the database and find on item to update. In this case looking for 'request.body.itemFromJS'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
// Set tells the database what to change
        $set: {
// in this case it is changing the 'completed' key to true
            completed: true
          }
    },{
// Sorting the database in decending order
        sort: {_id: -1},
// If there isn't a 'completed' on the item, do not add one automatically.
        upsert: false
    })
// Once the above is completed do the following
    .then(result => {
// Console message that the item was marked completed
        console.log('Marked Complete')
// Send a response back to the browser. In this case the json message 'marked completed'
        response.json('Marked Complete')
    })
// If ther above encounters an error put an error message in the console
    .catch(error => console.error(error))
})

// Another put or update request similar to the above
// Telling the server to listen to the /markUnComplete endpoint and what infomation is recieved and sent back to the browser
app.put('/markUnComplete', (request, response) => {
// Access the database and find one thing to update. In this case update 'request.body.itemsFromJS'    
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
// Instructions to Mongo to change an element in an item
        $set: {
// Changing the 'completed' element to false
            completed: false
          }
    },{
// soring the elements in decending order
        sort: {_id: -1},
// if the element doesn't exist do not automatically add it.
        upsert: false
    })
// After the above is completed do the following
    .then(result => {
// Put a message in the console saying the job is done
        console.log('Marked Complete')
// Send a message back to the browser that the job is done
        response.json('Marked Complete')
    })
// If there is an error above put the error message in the console
    .catch(error => console.error(error))

})

// The start of a delete request
// telling the server to listen to the /deleteItem with the delete method
app.delete('/deleteItem', (request, response) => {
// enter the database and look for an element with request.body.itemFromJS and remove it from the database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
// Once the above is complete do the following
    .then(result => {
// put a message in the console saying the element was deleted
        console.log('Todo Deleted')
// Send a message back to the browser that the element was deleted
        response.json('Todo Deleted')
    })
// if the above caused an error put that error in the console
    .catch(error => console.error(error))

})

// instructing Express to listen either to the PORT defined by the environment, or to the hardcoded PORT from earlier
app.listen(process.env.PORT || PORT, ()=>{
// Putting a message in the console that the server is running on a specific PORT
    console.log(`Server running on port ${PORT}`)
})