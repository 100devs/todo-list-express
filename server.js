const express = require('express') //import express module
const app = express() //assign express function to app variable
const MongoClient = require('mongodb').MongoClient //import mongoDB module
const PORT = 2121 //assign default port to PORT variable
require('dotenv').config() //import env keys


let db, //assign db variable to easily access database
    dbConnectionStr = process.env.DB_STRING, //the key to access the database
    dbName = 'todo' //dbName in mongoDB

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to mongoDB database
    .then(client => {
        console.log(`Connected to ${dbName} Database`) //console log successful connection
        db = client.db(dbName) //assign variable to database
    })
    
app.set('view engine', 'ejs') //use ejs template engine via express
app.use(express.static('public')) //allows public folde to run without routing
app.use(express.urlencoded({ extended: true })) //middleware to parse incoming POST and PUT request objects as strings or arrays
app.use(express.json()) //allows parsing json data


app.get('/',async (request, response)=>{ //reads root request
    const todoItems = await db.collection('todos').find().toArray() //finds todo collection in the database and puts it into an array called todoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//counts the documents where completed, stoted in itemsleft variable
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //uses ejs template to render todo Items and itemsLeft into html
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //write request to 'addTodo'
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //adds todoItem to the document
    .then(result => {
        console.log('Todo Added') // console logs 'Todo Added'
        response.redirect('/') //refreshes the page to root
    })
    .catch(error => console.error(error)) //console logs an error if an error occurs
})

app.put('/markComplete', (request, response) => { //updates request to '/markComplete'
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updates document to itemFromJs
        $set: { //sets properties in the object
            completed: true //sets status of completed to true
          }
    },{
        sort: {_id: -1}, //sets sort _id: -1
        upsert: false //update if already exists or add if it doesn't.
    })
    .then(result => {
        console.log('Marked Complete') //console logs completed
        response.json('Marked Complete') //jspn responds to server as completed
    })
    .catch(error => console.error(error)) //console logs error if an error occurs

})

app.put('/markUnComplete', (request, response) => { //writes request to markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ ///updates document to itemFromJs
        $set: { //sets properties in the object
            completed: false //sets status of completed to false
          }
    },{
        sort: {_id: -1}, //sets sort _id: -1
        upsert: false //updates if already exists or add if it doesn't
    })
    .then(result => {
        console.log('Marked Complete') //console logs 'Marked Complete'
        response.json('Marked Complete')  //json reponds to server as 'Marked Complete'
    })
    .catch(error => console.error(error)) //console logs error if and error occurs

})

app.delete('/deleteItem', (request, response) => { //delete request to delteItem route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //deletes document itemFromJs
    .then(result => {
        console.log('Todo Deleted') //console logs 'Todo Delected'
        response.json('Todo Deleted') //json reponse to server 'Todo Delected'
    })
    .catch(error => console.error(error)) //console logs error if an error occurs

})

app.listen(process.env.PORT || PORT, ()=>{ //listens for env port or default port that is assigned
    console.log(`Server running on port ${PORT}`)//console logs which port the server is running on
})