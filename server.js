//requires express to be imported to node
const express = require('express')
//creates express application
const app = express()
//loading mongodb library into node
const MongoClient = require('mongodb').MongoClient
//running on localhost can use this port to look at app
const PORT = 2121
//allows you to bring in hidden env variables to use without showing it publically
require('dotenv').config()

//creates database
let db,
    //db_string is what you get from mongodb to get the url it needs to get to database
    //process.env lets you use url provided by mongodb
    dbConnectionStr = process.env.DB_STRING,
    //sets database name to 'todo'
    dbName = 'todo'
//defines how we connect to MongoDB
//useUnifiedTopology makes sure that things are returned in a clean manner
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //responding on client side
    .then(client => {
        //logging in console the message that we successfully connected to database
        console.log(`Connected to ${dbName} Database`)
        //defines the database as whatever you said it was
        db = client.db(dbName)
    })

//express is determining how are we gonna use a view (template) engine to render
//ejs (embedded JS) commands for our app
app.set('view engine', 'ejs')
//tells app to use folder named "public" for all of our static files (images, CSS)
app.use(express.static('public'))
//call to middleware that cleans up how things are displayed and how our server
//communicates with our client (similar to useUnifiedTopology)
app.use(express.urlencoded({ extended: true }))
//tell app to use express's json method to take object and turn into json string so that
//we can read it
app.use(express.json())

//GET stuff to display to use on client side (index.ejs) using async function
app.get('/',async (request, response)=>{
    //create a constant "todoItems" that goes into database, going to create
    //collection "todos", finding anything in that database, and turn it into 
    //array of objects
    const todoItems = await db.collection('todos').find().toArray()
    //create another constant in todos collection, look at documents in collection,
    //use countDocuments method to count number of documents that are in criteria of false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //send response that renders number of documents in our collection and number of items 
    //left (items that don't have "true" for "completed") in index.ejs
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

//adding element to database via addTodo
app.post('/addTodo', (request, response) => {
    //server will go into collection called "todos", insert one thing named 'todoItem'
    //gonna get a status completed: false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //print "todo added" to console
        console.log('Todo Added')
        //refresh ejs page and show the new thing we added to database
        response.redirect('/')
    })
    //assume something didn't work and didn't go to database, print error to console
    .catch(error => console.error(error))
})

//UPDATE method, click something on client side
app.put('/markComplete', (request, response) => {
    //go in todos collection and go to one thing and update status completed: true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
        }
    },{
        //once a thing has been marked completed: true, it removes from left todo list and
        //adds it to completed list
        sort: {_id: -1},
        //reduce left todo total by 1, on ui it's grayed out todo item
        //upsert will update db if note is found and insert a new note if not found
        upsert: false
    })
    //assuming that everyting went ok and we got result
    .then(result => {
        //print marked completed in console
        console.log('Marked Complete')
        //send back to response  "marked complete"
        response.json('Marked Complete')
    })
    //if something broke where it couldn't return a response, log error in console
    .catch(error => console.error(error))

})

//this route unclicks a thing that you've marked as completed - will take away completed
//status
app.put('/markUnComplete', (request, response) => {
    //go into todo collections and look for an item from itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //undo what we did with markCompleted -changes completed: true to false
        $set: {
            completed: false
        }
    },{
        //one a thing is been marked and Uncomplated, this sorts the array by 
        //descending order
        sort: {_id: -1},
        //doesn't create a document for todo if item isn't found
        upsert: false
    })
    .then(result => {
        //console log marked completed
        console.log('Marked Complete')
        //return response of marked completed to the fetch
        response.json('Marked Complete')
    })
    //if something broke, error is logged
    .catch(error => console.error(error))

})

//DELETE method
//req, res is the other half of async await in main.js
app.delete('/deleteItem', (request, response) => {
    //go into collection todos and find a thing that matches the name of the thing you
    //clicked on and run deleteOne to delete it
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //assuming everything went ok
    .then(result => {
        //log once item is deleted
        console.log('Todo Deleted')
        //send confirmation is deleted where const data await is waiting for response
        response.json('Todo Deleted')
    })
    //if then block can't run, then  catch will log an error message
    .catch(error => console.error(error))

})

//tells server to listen for connect on the PORT we define as constant earlier in code
//or uses the app's PORT
app.listen(process.env.PORT || PORT, ()=>{
    //prints what PORT our server is running on
    console.log(`Server running on port ${PORT}`)
})