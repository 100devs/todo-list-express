const express = require('express') // make it possible to use express in this file
const app = express() // sets a variable and assigns it to the instance of express
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with Mongoclient and talk to our DB
const PORT = 2121 // sets constant to define the location where our server will be listening 
require('dotenv').config() // allows us to access variables inside .env file


let db, // declares variable
    dbConnectionStr = process.env.DB_STRING, // declares variable assigned to our database connection string to it
    dbName = 'todo' // declares variable assigning the name of the database we will use 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creates connection to MongoDB and passes in our connection string
    .then(client => { // if the connection is succesful, do what follows. it passes in all the client information
        console.log(`Connected to ${dbName} Database`) // logs to the console a template literal connected to todo database
        db = client.db(dbName) // assigns value to previously declared db variable that contains a db client factory method
    }) // closes our .then
    
    //middleware
app.set('view engine', 'ejs') // sets ejs as the default render
app.use(express.static('public')) // sets location for static assets
app.use(express.urlencoded({ extended: true })) // tells express to decade and encode urls where the header matches the content
app.use(express.json()) // parses JSON content from incoming requests


app.get('/',async (request, response)=>{ // handles a GET method when the root route is passed in, sets up request and response parameters
    const todoItems = await db.collection('todos').find().toArray() // sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders the EJS file and passes through the db items and the count remaining inside of an object 
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