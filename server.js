//load in express library and store as a constant
const express = require('express')
//store express instance as a constant
const app = express()
//store the way to talk to MongoDB as a constant
const MongoClient = require('mongodb').MongoClient
//store the Port value as a constant
const PORT = 2121
//use .env files
require('dotenv').config()

//declare the db variable
let db,
//declare dbConnectionStr variable and assign it to the DB_STRING variable in the process.env file
    dbConnectionStr = process.env.DB_STRING,
    //declare dbName variable and assign it to 'todo'
    dbName = 'todo'
//connect to MongoDB using your credentials stored in the .env file
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //log to the console that the connection was successful
        console.log(`Connected to ${dbName} Database`)
        //assign the output of client.db(dbName) to the db variable
        db = client.db(dbName)
    })
//using ejs as templating language
app.set('view engine', 'ejs')
//tell the app to look into the public folder for js and css files
app.use(express.static('public'))
//look at requests that are coming in and pull data from the body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//define what to do when the server receives a get request from the client
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    //find all the entries in the todos collection and store each as an element in an array
    db.collection('todos').find().toArray()
    //pass the completed promise using the .then method
    .then(data => {
        //in the todos collection count each document that has not been completed
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            //respond by rendering documents into the EJS template
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    //log to console if the code throws an exception
    .catch(error => console.error(error))
})

//define what to do when the server receives a post request from the client
//set path for post to form action value
app.post('/addTodo', (request, response) => {
    //insert document into the todos collection with the thing property set to the value entered by the user in the form and with the completed property set to false.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //log to the console that the post was successful
        console.log('Todo Added')
        //respond to the client with a refresh
        response.redirect('/')
    })
    //log to the console if an exception is thrown
    .catch(error => console.error(error))
})
//define what the server does when a user clicks on a todo item
app.put('/markComplete', (request, response) => {
    //look into the todos collection and update the first document that has a thing property of "request.body.itemFromJS"
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set item completed property to true
        $set: {
            completed: true
          }
    },{
        //update whatever comes first
        sort: {_id: -1},
        //do not insert a new document if it does not exist
        upsert: false
    })
    .then(result => {
        //console log the success message
        console.log('Marked Complete')
        //respond to the client that the task was completed
        response.json('Marked Complete')
    })
    //console log if there is an error
    .catch(error => console.error(error))

})

//define what the server does when a user unchecks a todo item 
app.put('/markUnComplete', (request, response) => {
    //looks for first document in todos collection that contains a thing value equal to request.body.itemsFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set completed property to false
        $set: {
            completed: false
          }
    },{
        //update whatever comes first
        sort: {_id: -1},
        // do not insert an object containg the above info if you can't find it
        upsert: false
    })
    .then(result => {
        //console log the success message
        console.log('Marked Inomplete')
        //return to client success message
        response.json('Marked Inomplete')
    })
    //console log the error
    .catch(error => console.error(error))

})
//define what the server does when the user deletes a todo item
app.delete('/deleteItem', (request, response) => {
    //deletes the first document from the todos collection that contains itemFromJS value in the thing property
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //console log success message
        console.log('Todo Deleted')
        //respond to the client with the success message
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//run the app and use the assigned port or one assigned by the hosting service
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})