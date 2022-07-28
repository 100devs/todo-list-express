//require the express package
const express = require('express')
//initialize express, save to a variable
const app = express()
//require the mongodb package
const MongoClient = require('mongodb').MongoClient
//set up a port to listen to
const PORT = 2121
//require dotenv so that we can create .env files
require('dotenv').config()

//create variables, assign connection string from .env file
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connect to mongo using the connection string in .env
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//once the promise resolves
    .then(client => {
        //set global db variable to hold the reference to mongo database
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//tell express to use ejs as the templating engine
app.set('view engine', 'ejs')
//tells client to look in the public folder to retreive any static files (CSS or JS)
app.use(express.static('public'))
//this tells express that posts requests can have nested objects
app.use(express.urlencoded({ extended: true }))
//this parses all incoming JSON requests and puts the parsed data in req.body
app.use(express.json())

//this is the base route when you connect to the port and do not specify a path
app.get('/',async (request, response)=>{
    //this searches our db for all todos and converts to an array, saving the result to todoItems
    //there is an await because this process can take time so we want to wait for the process
    //to complete before moving on
    const todoItems = await db.collection('todos').find().toArray()
    //this finds all documents where the completed property is false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //this sends back a response with an ejs file, passing in 
    //all todos and those todos that are not completed
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

//this is a route that takes in a request triggered by a form
app.post('/addTodo', (request, response) => {
    //insert a new todo into the database
    //passing in the request body as an argument
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //when promise resolves, redirect to the root route
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //if there is an error, console.log it
    .catch(error => console.error(error))
})

//this is the route for updating a todo and marking complete
app.put('/markComplete', (request, response) => {
    //update the db, finding the todo based off the name
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //update completed to be true
        $set: {
            completed: true
          }
    },{
        //sort by id in reverse desc order
        sort: {_id: -1},
        //do not create a new document if none are found that match the criteria
        upsert: false
    })
    //when promise resolves
    .then(result => {
        //return a response and console.log that the update was successful
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //if there are any errors, log the error
    .catch(error => console.error(error))

})

//this is an update route that will mark complete as false
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

//this is a delete route
app.delete('/deleteItem', (request, response) => {
    //taking in the name of the todo as the key of which object to delete
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //when promise resolves
    .then(result => {
        //return a success message and console.log
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //if there is an error, log it to the console
    .catch(error => console.error(error))

})

//this activates our exoress app and tells it on which port to listen for activity
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})