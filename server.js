const express = require('express') // Making it possible to use express in this file
const app = express() //Storing express call to variable called app, shortcut
const MongoClient = require('mongodb').MongoClient // Making it possible to use methods associated with MongoClient and talk to out DB
const PORT = 2121 // Set a variable to store our port location where our server will be listening.
require('dotenv').config() // Making it possible that allows use to create and use our .env file to hide our files and still access what is hidden


let db, // declaring variables, first one db
    dbConnectionStr = process.env.DB_STRING, // declare variable dbConnectionStr  and assigning our database connection string to it
    dbName = 'todo' //declare and store todo in dbName, naming our database that we want to access.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Makes request to connect to mongo client database and passing our connection string and addition props.
    .then(client => { //takes request and then when successful does something
        console.log(`Connected to ${dbName} Database`) //console logs a message 
        db = client.db(dbName) //assigning db to be the client database that we want to connect to
    }) //Closing our then
    
app.set('view engine', 'ejs') // middleware to allow use to render html using ejs
app.use(express.static('public')) // middleware to set the location for static assests, css, js, images, etc.
app.use(express.urlencoded({ extended: true })) // Tells the express to decode and encode urls where the header matches the content. Supports arrays and objects
app.use(express.json()) //


app.get('/',async (request, response)=>{ //
    const todoItems = await db.collection('todos').find().toArray() //
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //
    .then(result => { //
        console.log('Todo Added') //
        response.redirect('/') //
    }) //
    .catch(error => console.error(error)) //
}) //

app.put('/markComplete', (request, response) => { //
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //
        $set: { //
            completed: true //
          } //
    },{ //
        sort: {_id: -1}, //
        upsert: false //
    }) //
    .then(result => { //
        console.log('Marked Complete') //
        response.json('Marked Complete') //
    }) //
    .catch(error => console.error(error)) //

}) //

app.put('/markUnComplete', (request, response) => { //
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //
        $set: { //
            completed: false //
          } //
    },{ //
        sort: {_id: -1}, //
        upsert: false //
    }) //
    .then(result => { //
        console.log('Marked Complete') //
        response.json('Marked Complete') //
    }) //
    .catch(error => console.error(error)) //

}) //

app.delete('/deleteItem', (request, response) => { //
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //
    .then(result => { //
        console.log('Todo Deleted') //
        response.json('Todo Deleted') //
    }) //
    .catch(error => console.error(error)) //

}) //

app.listen(process.env.PORT || PORT, ()=>{ //
    console.log(`Server running on port ${PORT}`) //
}) //