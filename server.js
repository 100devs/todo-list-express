const express = require('express')
// imports the express framework
const app = express()
// creates an app variable from the express application
const MongoClient = require('mongodb').MongoClient
// creates a variable called MongoClient that imports the MongoClient from the MongoDB library
const PORT = 2121
// sets the port to listen to "2121"
require('dotenv').config()
// loads environment variables from a .env file

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
// declares variables for the db connection and db name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// connects the mongodb database using the dbConnectionStr variable
    .then(client => {
    // creates a callback if connected to client
        console.log(`Connected to ${dbName} Database`)
        // logs the name of the database connected
        db = client.db(dbName)
        // changes the db variable to the db reference
    })

app.set('view engine', 'ejs')
// lets express know we are using ejs as our templating language
app.use(express.static('public'))
// set up the public folder so any static files that get put in public folder dont need to be routed
app.use(express.urlencoded({ extended: true }))
// replaced body parser
app.use(express.json())
// replaced body parser


app.get('/',async (request, response)=>{
    // reads a request on the root rout and passes the request and eventually the response
    // const todoItems = await db.collection('todos').find().toArray()
    // const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()
    // request goes to the todo db collection and finds all everything in the db collection and turns it to an array
    .then(data => {
    // do something with the data from the db
        db.collection('todos').countDocuments({completed: false})
        // count the documents within the db and check to see if its completed
        .then(itemsLeft => {
        // whatever item is left, run a function
            response.render('index.ejs', { items: data, left: itemsLeft })
            // the response is to render the ejx using the items data
        })
    })
    .catch(error => console.error(error))
    // if the function catches an error log that error to the console
})

app.post('/addTodo', (request, response) => {
    // create and add the request to create a todo item on the addTodo route and waits for a response
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // go to the todos collection in the db and insterts the todoItem
    .then(result => {
    // a callback function that runs the result of the todo creation if it runs successfully
        console.log('Todo Added')
        // logs "Todo Added" to the console
        response.redirect('/')
        // response by redirecting to the route route
    })
    .catch(error => console.error(error))
    // if theres an error log the error to the console
})

app.put('/markComplete', (request, response) => {
    // updates the request being taken in from the markComplete route and waits to respond
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // go to the todos db collection and update the data
        $set: {
            // set the data to something
            completed: true
            // set completed to true
        }
    },{
        sort: {_id: -1},
        // sort the data from top to bottom
        upsert: false
        // dont upsert the data
    })
    .then(result => {
        // run a callback if its successfully completed
        console.log('Marked Complete')
        // log "Marked Complete" to the console
        response.json('Marked Complete')
        // respond the string in json format
    })
    .catch(error => console.error(error))
    // if theres an error log the error to the console

})

app.put('/markUnComplete', (request, response) => {
    // update the markUnComplete route with the request and wait for the response
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // go to the todos collection in the database and update the body from the data
        $set: {
            // change the data
            completed: false
            // change completed to false
        }
    },{
        sort: {_id: -1},
        // sort ascending
        upsert: false
        // set upsert to false
    })
    .then(result => {
        // run a callback if its successfully completed
        console.log('Marked Complete')
        // log "Marked Complete" to the console
        response.json('Marked Complete')
        // respond the string in json format
    })
    .catch(error => console.error(error))
    // if theres an error log the error to the console

})

app.delete('/deleteItem', (request, response) => {
    // delete an item from the request and wait to respond
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // go to find the item from the todos collection in the db and delete the item matching the requests body
    .then(result => {
        // run a callback if its successfully completed
        console.log('Todo Deleted')
        // log "Todo Deleted" to the console
        response.json('Todo Deleted')
        // respond to the string "Todo Deleted" in json format
    })
    .catch(error => console.error(error))
    // if theres an error console log the error

})

app.listen(process.env.PORT || PORT, ()=>{
// listen for the PORT from the .env file or the variable from this file and run a function
    console.log(`Server running on port ${PORT}`)
    // if successful console.log the template literal string
})
