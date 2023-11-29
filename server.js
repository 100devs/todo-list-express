//import and require() modules for express, assign to const 'express'
const express = require('express')

//assign express to variable 'app' 
const app = express()

//import and require() modules for MongoDB, assign to const 'MongoClient'
const MongoClient = require('mongodb').MongoClient

//assign const 'PORT' to 2121
const PORT = 2121

//imports 'dotenv' module required for Node.js, used to load env variales from '.env' into 'process.env.' The config() method reads the variables from the '.env' file and adds them to the 'process.env' object. Allows us to access to process.env.XXXX variables below. 
require('dotenv').config()

//assigns db and dbConnectionStr variables equal the DB_STRING in the process.env file. Also assigns dbName variable to 'todo.'
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//Utilizes MongoClient to establish connection with MongoDB using the connection string assigned above, and log successful message to the console while assigning the dbName to the variable declared above (dbName)
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//Tells Express middleware to set the 'view' in MVS to expect EJS.
app.set('view engine', 'ejs')

//Tells Express to serve files from the 'public' directory. 
app.use(express.static('public'))

//Tells express to parse returned data and make it available in request.body object. 
app.use(express.urlencoded({ extended: true }))

//Tells express to parse incoming JSON data and populate the request.body object. 
app.use(express.json())

//GET method for root endpoint to asynchronously render all todo items from the database into an array and render the homepage, 'index.ejs.'
app.get('/', async (request, response) => {
    // const todoItems = await db.collection('todos').find().toArray()
    // const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()
        .then(data => {
            db.collection('todos').countDocuments({ completed: false })
                .then(itemsLeft => {
                    response.render('index.ejs', { items: data, left: itemsLeft })
                })
        })
        .catch(error => console.error(error))
})

//POST method to insert new to-do items into the database, and refresh the home page. Catch and log any errors. 
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        .then(result => {
            console.log('Todo Added')
            response.redirect('/')
        })
        .catch(error => console.error(error))
})

//PUT method to update to-do items in the database to be 'complete,' sorting returned items with incomplete tasks at the top, logs result to the console, catches any errors and returns them in the console. 
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: true
        }
    }, {
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        .catch(error => console.error(error))

})

//PUT method the toggle or rather, mark to-do items incomplete again, sorts the data again to reflect incomplete tasks at the top, logs successful message in the console or any errors. 
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: false
        }
    }, {
        sort: { _id: -1 },
        upsert: false
    })
        .then(result => {
            console.log('Marked Uncomplete')
            response.json('Marked Uncomplete')
        })
        .catch(error => console.error(error))

})

//DELETE method for deleting a to-do item from the database, return successful message to the console or catch any errors. 
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        .then(result => {
            console.log('Todo Deleted')
            response.json('Todo Deleted')
        })
        .catch(error => console.error(error))

})

//Starts the Express server and binds it to a listener for connections on the specified port (2121 above). Logs success message to the console. This allows for the app to run in different environments as needed (e.g., production vs. local)
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})