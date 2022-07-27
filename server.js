const express = require('express') //loads express module for project
const app = express() // easier way to access express, uses express as a variable
const MongoClient = require('mongodb').MongoClient //loads the Mongo Client module 
const PORT = 2121 // sets the port
require('dotenv').config() // loads dotenv


let db, //variable to be named
    dbConnectionStr = process.env.DB_STRING, // pulls the connection string from .env file
    dbName = 'todo' // database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connects to the database
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //Connects or creats 'todo' database
    })
    
app.set('view engine', 'ejs') // sets ejs as the rendering engine
app.use(express.static('public')) //go to the public folder as the root folder
app.use(express.urlencoded({ extended: true })) 
app.use(express.json())// returns as json


app.get('/',async (request, response)=>{ //responds to client fetch request for default url
    const todoItems = await db.collection('todos').find().toArray() //gets todo list from database and put it into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Obtains a count of items in the database with completed marked as false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rrenders the html using the EJS file index.ejs and returns to client 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // responds to POST request from form
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // adds item from form input
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
        sort: {_id: -1}, //sorts it by id
        upsert: false // false it doesnt do anything, true it will make a new field 
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) //catch error

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

app.delete('/deleteItem', (request, response) => { //responds to client side delete request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // finds the database item that mwatches itemfrom JS client request and deletes it
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted') // responds with json
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ // listen on port
    console.log(`Server running on port ${PORT}`)
})