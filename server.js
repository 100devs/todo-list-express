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
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
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

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})