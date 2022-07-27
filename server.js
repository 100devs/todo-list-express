//install the express module
const express = require('express')
//initialize the app with express
const app = express()
//install the mongoDB module, specifically the "MongoClient" constructor
const MongoClient = require('mongodb').MongoClient
//set a default port (other ports can be set in the environment variables)
const PORT = 2121
//install and configure "dotenv" module to load environment variables
require('dotenv').config()

//initialize db variable, but don't assign to anything
let db,
//initialize and set the "dbConnectionStr" variable, set to DB_STRING in the environment variable file
    dbConnectionStr = process.env.DB_STRING,
//initialize the DB name, and set to "todo"
    dbName = 'todo'

//connect server to DB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//once connected, run the code in {}s after this line
    .then(client => {
        //print a status update to the console, saying that we're connected to the database
        console.log(`Connected to ${dbName} Database`)
        //TODO
        db = client.db(dbName)
    })
    
//set the rendering engine to "EJS"
app.set('view engine', 'ejs')
//set static assests (css and client-side js) to load from the "public" folder
app.use(express.static('public'))
//tells express to parse urlencoded data
app.use(express.urlencoded({ extended: true }))
//use .json() method in the app
app.use(express.json())

//respond to GET requests to the base URL
app.get('/', async (request, response)=>{
    //async function that connects to the database and finds the "todos" collection and puts it into array
    const todoItems = await db.collection('todos').find().toArray()
    //async function that connects to the database, finds the "todos" collection, and counts the number of documents that have "completed" listed as "false"
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //take the todoItems and itemsLeft and render them into the DOM, showing the total tasks and the number left to do
    //passes todoItems called "items" and "itemsLeft" called "left" to EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //same code as above, rewritten without async/await
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//responds to POST requests sent to [site name]/addTodo
app.post('/addTodo', (request, response) => {
    //finds  "todoItem" in the body of the request, adds to the DB "todos" collection with a status of "completed: false"
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //once the document has been added to the collection, run the code after this line
    .then(result => {
        //print "todo added" to the server console
        console.log('Todo Added')
        //refresh the page once the request is complete
        response.redirect('/')
    })
    //if the request fails, print the error to the server console
    .catch(error => console.error(error))
})

//responds to PUT requests sent to [site name]/markComplete
app.put('/markComplete', (request, response) => {
    //get the "todos" collection and update an item
    //specifically the object that has the "thing" property that's the same as request.body.itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set the "completed" value of the "thing" object 
        $set: {
            //set to be to be true
            completed: true
          }
    },{
        //sort items by ID in descending order
        sort: {_id: -1},
        //attempt to update, if that doesn't work then DO NOT allow the database to create a new item
        upsert: false
    })
    //if the update request is complete, run the code below
    .then(result => {
        //log "marked complete" to the server side console
        console.log('Marked Complete')
        //turn "Marked complete" into json and send that back as the resonse
        response.json('Marked Complete')
    })
    //if the request fails, print the error to the server console
    .catch(error => console.error(error))

})

//responds to PUT requests sent to [site name]/markUnComplete
app.put('/markUnComplete', (request, response) => {
    //get the "todos" collection and update an item
    //specifically the object that has the "thing" property that's the same as request.body.itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set the "completed" value of the "thing" object 
        $set: {
            //set to be "true"
            completed: false
          }
    },{
        //sort items by ID in descending order
        sort: {_id: -1},
        //attempt to update, if that doesn't work then DO NOT allow the database to create a new item
        upsert: false
    })
    //if the update request is complete, run the code below
    .then(result => {
        //log "marked complete" to the server side console
        console.log('Marked Complete')
        //turn "Marked complete" into json and send that back as the response (should pprobably be "INcomplete")
        response.json('Marked Complete')
    })
    //if the request fails, print the error to the server console
    .catch(error => console.error(error))

})

//responds to DELETE requests sent to [site name]/deleteItem
app.delete('/deleteItem', (request, response) => {
    //get the "todos" collection and update an item
    //specifically the object that has the "thing" property that's the same as request.body.itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //if the update request is complete, run the code below
    .then(result => {
        //log "todo deleted" to the server side console
        console.log('Todo Deleted')
        //turn "todo deleted" into json and send that back as the response
        response.json('Todo Deleted')
    })
    //if the request fails, print the error to the server console
    .catch(error => console.error(error))

})

//start the server, using either the port number from the environment variables file on the server, or the port number defined at the top
app.listen(process.env.PORT || PORT, ()=>{
    //print this message to the server console, telling us the server is ryunning onm which port
    console.log(`Server running on port ${PORT}`)
})