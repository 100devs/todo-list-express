const express = require('express') //import express module
const app = express() //assign express functions to app variable
const MongoClient = require('mongodb').MongoClient //import mongodb module
const PORT = 2121 //assign default port to PORT variable
require('dotenv').config() //import env keys


let db, //assign db variable to easily access database
    dbConnectionStr = process.env.DB_STRING, //the key to access the database
    dbName = 'todo' //dbName in mongodb

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to mongodb database
    .then(client => {
        console.log(`Connected to ${dbName} Database`) //console logs successful connection
        db = client.db(dbName) //assign variable to database
    })
    
app.set('view engine', 'ejs') //use ejs template engine via express
app.use(express.static('public')) //allows public folder to run without routing
app.use(express.urlencoded({ extended: true })) //middleware to parse incoming POST and PUT request objects as strings or arrays
app.use(express.json()) //allows parsing json data


app.get('/',async (request, response)=>{ //read root request
    const todoItems = await db.collection('todos').find().toArray() //finds todos collection in the database and puts it into an array called todoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //counts the documents where completed: false, stored in itemsLeft variable
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //uses ejs template to render todoItems and itemsLeft into html
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //write request to /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //adds todoItem to document
    .then(result => {
        console.log('Todo Added') //console logs 'Todo Added'
        response.redirect('/') //refreshes the page to root
    })
    .catch(error => console.error(error)) //console logs error if an error occurs
})

app.put('/markComplete', (request, response) => { //update request to /markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // updates document to itemFromJS
        $set: { //sets properties in the object
            completed: true //sets status of completed to true
          }
    },{
        sort: {_id: -1}, //sets sort _id: -1
        upsert: false //update if already exists or add if it doesn't. since set to false, it doesn't add if it doesn't exist.
    })
    .then(result => {
        console.log('Marked Complete') //console logs completed
        response.json('Marked Complete') //json responds to server as completed
    })
    .catch(error => console.error(error)) //console logs error if an error occurs

})

app.put('/markUnComplete', (request, response) => { //write request to markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updates document to itemFromJS
        $set: { //sets properties in the object
            completed: false //sets status of completed to false
          }
    },{
        sort: {_id: -1}, //sets sort _id: -1
        upsert: false //update if already exists or add if it doesn't. since set to false, it doesn't add if it doesn't exist.
    })
    .then(result => {
        console.log('Marked UnComplete') //console logs uncompleted
        response.json('Marked UnComplete') //json responds to server as uncompleted
    })
    .catch(error => console.error(error)) //console logs error if an error occurs

})

app.delete('/deleteItem', (request, response) => { //delete request to deleteItem route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //deletes document itemFromJS
    .then(result => {
        console.log('Todo Deleted') //console logs Todo Deleted
        response.json('Todo Deleted') //json response to server Todo Deleted
    })
    .catch(error => console.error(error)) //console logs error if an error occurs

})

app.listen(process.env.PORT || PORT, ()=>{ //listens for env port or default port that is assigned
    console.log(`Server running on port ${PORT}`) //console logs which port the server is running on
})