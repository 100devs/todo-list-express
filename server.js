//set express to const express
const express = require('express')
//instance express as const app
const app = express()
//set mongoClient and require mongo to const MongoClient
const MongoClient = require('mongodb').MongoClient
//set PORT const
const PORT = 2121
//require dot-env and then config it
require('dotenv').config()

//create let variable db
let db,
//db sonnection string set to env secret DB_STRING,
    dbConnectionStr = process.env.DB_STRING,
    //set let variable dbName
    dbName = 'todo'
//connect mongo stuff
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //.then after that connects
    .then(client => {
        //console log connection to db using dbName variable in template literal
        console.log(`Connected to ${dbName} Database`)
        //set let variable db to client.db(dbName)
        db = client.db(dbName)
        //closing notation
    })
//set app to use ejs to render views (as a view engine)
app.set('view engine', 'ejs')
//set to serve files from folder public
app.use(express.static('public'))
//use urlencoded
app.use(express.urlencoded({ extended: true }))
//use express json functionality
app.use(express.json())

//define server default ('/) get path
app.get('/',async (request, response)=>{
    //set const todoItems as result of array found from database collection 'todos'
    const todoItems = await db.collection('todos').find().toArray()
    //set const itemsLeft as result of database 'todos' collection count of items
    const itemsLeft = await db.collection('todos').countDocuments(
        //set completed to false
    {completed: false})
    //response renders 'index.ejs' file passing in variables items and left with values from variables todoItems and itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    //commented out code
    // db.collection('todos').find().toArray()
    //commented out code
    // .then(data => {
        //commented out code
    //     db.collection('todos').countDocuments({completed: false})
    //commented out code
    //     .then(itemsLeft => {
        //commented out code
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //commented out code
    //     })
    //commented out code
    // })
    //commented out code
    // .catch(error => console.error(error))

    //closing notation
})
//set app post path '/addTodo' 
app.post('/addTodo', (request, response) => {
    //add post req body to database
    db.collection('todos').insertOne({thing: request.body.todoItem,
        //conpleted set to false 
    completed: false})
    //.then block to run next
    .then(result => {
        //console log it was added
        console.log('Todo Added')
        //response redirects to default ('/')
        response.redirect('/')
        //closing notation 
    })
    //catch errors and console log
    .catch(error => console.error(error))
    //closing notation
})
//put path '/markcomplete'
app.put('/markComplete', (request, response) => {
    //use mongo updateOne to update database object
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //what to set
        $set: {
            //sets completed to true
            completed: true
            //closing notation
          }
          //closing/opening notation
    },{
        //set sort order for id to -1
        sort: {_id: -1},
        //no upsert (don't create if not already there)
        upsert: false
        //closing notation
    })
    //then block
    .then(result => {
        //console log it was completed
        console.log('Marked Complete')
        //response send json that it was completed (error, as you need to send an obnject, like: {"message": "Marked Completed"})
        response.json('Marked Complete')
        //closing notation 
    })
    //catch error and console log
    .catch(error => console.error(error))
    //closing notation 
})
//put path '/markUnComplete'
app.put('/markUnComplete', (request, response) => {
    //mongodb updateOne target thing: req.body.itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //what to set
        $set: {
            //set completed to false
            completed: false
            //closing notation
          }
          //closing/opening notation
    },{
        //set id sort order -1
        sort: {_id: -1},
        //no upsert (don't create new one if item doesn't yet exist)
        upsert: false
        //closing notation
    })
    //then block
    .then(result => {
        //console log it was marked completed
        console.log('Marked Complete')
       //response send json that it was completed (error, as you need to send an obnject, like: {"message": "Marked Completed"})
        response.json('Marked Complete')
        //closing notation
    })
    //catch error and console log it
    .catch(error => console.error(error))
    //closing notation
})
//delete path '/deleteItem'
app.delete('/deleteItem', (request, response) => {
    //use mongo deleteOne to find and delete using filter {thing: request.body.itemFromJS}
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //then block
    .then(result => {
        //console log Todo was deleted
        console.log('Todo Deleted')
        //response send json that it was completed (error, as you need to send an object, like: {"message": "Marked Deleted"})
        response.json('Todo Deleted')
        //closing notation
    })
    //catch error and console log
    .catch(error => console.error(error))
//closing notation
})
//tell app to listen on port: (secret from .env file) OR default port: PORT variable
app.listen(process.env.PORT || PORT, ()=>{
    //console log the server is running and on what port
    console.log(`Server running on port ${PORT}`)
    //closing notation
})