const express = require('express') // requires express
const app = express() // calls express when app is used throughout the code
const MongoClient = require('mongodb').MongoClient // requires mongoDB
const PORT = 2121 // sets the PORT for localhost
require('dotenv').config() // used to hide the database connection string

// Variables
let db,
    dbConnectionStr = process.env.DB_STRING, // calls the db connection string from the .env file
    dbName = 'todo' // sets the database name

// Connects to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') // sets the view ending to ejs
app.use(express.static('public')) // sets the server to look at the public folder 
app.use(express.urlencoded({ extended: true })) // used to exctract data from forms and add it tot he body property.  
app.use(express.json()) // used by the server to read JSON

// handles a get request
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() // finds the todo items from the 'todos' db and creates an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // counts the items in the 'todos' db
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders index.ejs and passes items and left data
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// handles a post request
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts one items with a hardcoded completed
    .then(result => {
        console.log('Todo Added') // log to console
        response.redirect('/') // refreshes after the item is added
    })
    .catch(error => console.error(error)) // catches error
})

// handles a put request that adds a strikethrough on the item and marking completed
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  // updates one item
        $set: {
            completed: true // sets completed to true
          }
    },{ 
        sort: {_id: -1}, // sorts
        upsert: false // does not create a new item if it doesn't exist
    })
    .then(result => {
        console.log('Marked Complete') // logs to console
        response.json('Marked Complete') // responds with 'marked complete'
    })
    .catch(error => console.error(error)) // catches error

})

// handles put request that removes the strikethrough of the item and marking it uncompleted
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updates one item
        $set: {
            completed: false // sets completed to false
          }
    },{
        sort: {_id: -1}, // sorts
        upsert: false // does not create a new item if it doesn't exist
    })
    .then(result => {
        console.log('Marked Uncomplete') // logs to console
        response.json('Marked Uncomplete') // reponds with 'Marked Incomplete' (updated this part since it had 'Complete')
    })
    .catch(error => console.error(error)) // catches error

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // deletes one that matches the passed text content
    .then(result => {
        console.log('Todo Deleted') // logs to console
        response.json('Todo Deleted') // responds with 'Todo Deleted'
    })
    .catch(error => console.error(error)) // catches error

})

// listener
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) // consoles log the port that is running on
})