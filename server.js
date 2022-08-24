const express = require('express') // Import express
const app = express() // Create an instanse of express app
const MongoClient = require('mongodb').MongoClient // import MongoDb client
const PORT = 2121 // Set the default value of the port
require('dotenv').config() // add .env to environmental variables

// declare variables for database, connection string and database name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect mongoclient to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') // set ejs as a templating engine
app.use(express.static('public')) // set the default folder for static files
app.use(express.urlencoded({ extended: true })) // set the middleware to parse the request body of content-type x-www-form-urlencoded
app.use(express.json())  // parse request with json body

// hsndler of GET request at '/' endpoint
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() // get todos collection and convert to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // cound the number of completed todos
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render the index.ejs file plugging in the values of two previous lines
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// handle the POST request at '/addTodo' route
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // create a new todo with the 'thing' taken from the request body and completed status of false
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') // after inserting the data to database redirect to '/'
    })
    .catch(error => console.error(error)) // if there's an error console.log it
})

// handle PUT request at '/markComplete'
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update the item indicated in the body
        $set: {
            completed: true // change the status to true
          }
    },{
        sort: {_id: -1}, // sort in reverse order
        upsert: false // if the document doesn't exist, don't add a new one
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') // respond with a json 
    })
    .catch(error => console.error(error)) // console.log the error if there's one

})

// handle PUT request at '/markUnComplete'
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update the item indicated in the body
        $set: {
            completed: false // change the status to false
          }
    },{
        sort: {_id: -1}, // sort in reverse order
        upsert: false  // if the document doesn't exist, don't add a new one
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') // respond with json
    })
    .catch(error => console.error(error))

})

// handle DELETE request at '/deleteItem'
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // find one item indicated in the request body and delete it
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted') // respond with the json
    })
    .catch(error => console.error(error))

})

// start the server
app.listen(process.env.PORT || PORT, ()=>{ // use port from environmentalal variable or defined in the beginning of the document
    console.log(`Server running on port ${PORT}`)
})