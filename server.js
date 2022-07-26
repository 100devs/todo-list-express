const express = require('express')
// Allowing the code to use express
const app = express()
// Simplify the express function into a variable
const MongoClient = require('mongodb').MongoClient
// Assign the database (MongoDB) to a variable
const PORT = 2121
// Providing a route (homepage) for our code to run
require('dotenv').config()
// Implement dotenv - used for private key for database and/or port#


let db,
    //Start assigning the variable to our database (db)(Global assignment)
    dbConnectionStr = process.env.DB_STRING,
    // Assigning the route to the db file password to allow access
    dbName = 'todo'
    // todo is db name


MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  // connecting the Mongo database
    .then(client => { // promise
        console.log(`Connected to ${dbName} Database`) // confirmation connection to the database which is show in the Terminal
        db = client.db(dbName) // assigment of the database (Local assignment)
    })


//SET MIDDLEWARE
app.set('view engine', 'ejs') // creation of the index.ejs file
app.use(express.static('public')) // route to the main.js and style.css files (client files)
app.use(express.urlencoded({ extended: true })) // parses all URL request
app.use(express.json()) // enable to use JSON


// CRUD Methods:
app.get('/',async (request, response)=>{ // reading the home page, client make the request and response is sent
    const todoItems = await db.collection('todos').find().toArray() // creating variable(todoItems), wait for response from db.  It will find the specific object/objects and put it in an Array. 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // creating variable(itemsLeft), wait for response from db. Count the documents in the db and run until it is completed.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // send the data to the index.ejs file via the variables.
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
