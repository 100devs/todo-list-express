const express = require('express') // requiring Express
const app = express() // calling Express
const MongoClient = require('mongodb').MongoClient // requiring MongoDB
const PORT = 2121 // port in local host
require('dotenv').config() // enables .env file


let db, // declaring an empty 'db' variable (database)
    dbConnectionStr = process.env.DB_STRING, // database connection string from .env
    dbName = 'todo' // name of the database

// connecting to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') // setting up templating language as EJS
app.use(express.static('public')) // setting up the public folder for static pages
app.use(express.urlencoded({ extended: true })) // used to parse incoming requests with URL-encoded data (data submitted via HTML form). the parsed URL-encoded data is accessible through req.body
app.use(express.json()) // enables JSON parsing for incoming requests. the parsed JSON data is accessible through req.body

app.get('/',async (request, response)=>{ // get request for main page
    const todoItems = await db.collection('todos').find().toArray() // all the documents in the 'todo' collection in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // the number of documents with completed value of false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // sending the variables todoItems and itsmeLeft to EJS
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // route comes from action on HTML form 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // adds a document into the 'todo' collection
    .then(result => {
        console.log('Todo Added') // msg in terminal
        response.redirect('/') // refreshes page
    })
    .catch(error => console.error(error)) // if there is an error it will be shown in terminal
})

app.put('/markComplete', (request, response) => { // route comes from main.js function
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true // updates to true
          }
    },{
        sort: {_id: -1}, // grabs the first one if there are several
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') // msg in terminal
        response.json('Marked Complete') // response sent to client
    })
    .catch(error => console.error(error)) // if there is an error it will be shown in terminal

})

app.put('/markUnComplete', (request, response) => { // route comes from main.js function
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false // updates to false
          }
    },{
        sort: {_id: -1}, // grabs the first one if there are several
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') // msg in terminal
        response.json('Marked Complete') // response sent to client
    })
    .catch(error => console.error(error)) // if there is an error it will be shown in terminal

})

app.delete('/deleteItem', (request, response) => { // route comes from main.js function
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // deletes document in 'todo' collection
    .then(result => {
        console.log('Todo Deleted') // msg in terminal
        response.json('Todo Deleted') // response sent to client
    })
    .catch(error => console.error(error)) // if there is an error it will be shown in terminal

})

app.listen(process.env.PORT || PORT, ()=>{ // listening on port provided by hosting site, or local host 2121
    console.log(`Server running on port ${PORT}`) // msg in terminal which port is being used
})