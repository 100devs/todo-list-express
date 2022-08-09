// Import express library
const express = require('express')
// Instaniate express
const app = express()

// Create database client
const MongoClient = require('mongodb').MongoClient

//Open port
const PORT = 2121
require('dotenv').config()

// Create database variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

    // Connect to mongodo once connected set database tothe mongodb database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

    // Set express view engines and folders for static sites
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Publish the static main site
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
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

// Add a new to do item by listening on /addTodo for a post
app.post('/addTodo', (request, response) => {
    // Add new to do into the database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // refresh the page after todo is added
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// Listen for a update on the /markComplete
// Update the completed property on database
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    // respond to client with result marked complete
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// Similar to mark complete, but set completed to false
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

// Listen for a delete request at /deleteItem
//remove item from database
// Respond with todo completion when completed
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// Listen on the defined port to serve the site
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})