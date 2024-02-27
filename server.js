//import the express framework
const express = require('express')
//set the variable app to express
const app = express()
//import the mongodb package
const MongoClient = require('mongodb').MongoClient
//set the network port
const PORT = 2121
//import dotenv to enable environment variables
require('dotenv').config()

//set database connection string and databasename
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

connect to MongoDB and display success message
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//Middleware

//set view engine to EJS
app.set('view engine', 'ejs')

//set public folder so HTML, CSS, and JS files
app.use(express.static('public'))

//configure express to parse url encoded request bodies
app.use(express.urlencoded({ extended: true }))

//configure express to parse JSON request bodies
app.use(express.json())

//set up a route for the root
//this functioin is asyncronous as it is waiting for a response from the database
//once the database responds, the data is templated with EJS and rendered into an HTML file
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

//set up a route for a POST request (create)
//once the todo list item is added, the page refreshes to show the new note
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//set up a route for a PUT request (update)
//set the value to true in the database
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

//set up a route for a PUT request (update)
//set the value to false in the database
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

//set up a route for a DELETE request (delete)
//delete the value from the database
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//set up the Node.js server to listen on the specified port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})