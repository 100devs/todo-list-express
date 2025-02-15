// import express and mongo (after npm install express, mongodb) and create an instance of MongoClient
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
// set up port
const PORT = 2121
// install dotenv to secure information (place in gitignore)
require('dotenv').config()

// declare the db
let db,
    // receive the connection string (obtained from mongo db) that is stored in the (gitignored) env
    dbConnectionStr = process.env.DB_STRING,
    // name your app after the app name in Mongo Atlas
    dbName = 'todo'

// connect using the connection string and an object and add Unified Topology for UX (tho now standard)
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // take the return from the connect method's Promise
    .then(client => {
        // let us know we're connected to the database
        console.log(`Connected to ${dbName} Database`)
        // set the pre-declared, global db to the clients proper database
        db = client.db(dbName)
    })

// enable use of ejs templating language (npm install ejs --save)
app.set('view engine', 'ejs')
// tell our instance of express to be consistently viewing the public folder
app.use(express.static('public'))
// make sure the instance of express can handle html form submissions
app.use(express.urlencoded({ extended: true }))
// make sure our instance of express can handle the json format
app.use(express.json())

// upon loading the main page '/', call an async function to retrieve information
app.get('/',async (request, response)=>{
    // go into our database's collection thats named 'todos', everything within it, and put it in an array
    const todoItems = await db.collection('todos').find().toArray()
    // access the same collection, get a total number of documents that have a property of completed that = false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // send the response to the browser as an object - with properties item = the array from above, and left = number of incomplete
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    


    // this performs the same as above for the itemsLeft, but does it in the form of Promise chaining. items: data -> items: todoItems
    
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// when our instance of express hears a POST request thats made with the /addTodo action property
app.post('/addTodo', (request, response) => {
    // find our collection called todos and insert an object with properties thing = the request body's todoItem and completed = false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // if a message is sent from the database after the insertion, obtain the 'result' of that message
    .then(result => {
        // ignore the resulting message and log in real language what occurred
        console.log('Todo Added')
        // redirect to the main page
        response.redirect('/')
    })
    // if an error occurred at any point, log it
    .catch(error => console.error(error))
})

// set up our instance of express to receive a PUT request thats made with the /markComplete action
app.put('/markComplete', (request, response) => {
    // go to our db's todo collection and update one object that has the thing property that matches the request body's itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // let mongo db know were planning to set (change) something on that object
        $set: {
            // change its completed property to true
            completed: true
          }
    },{
        // sort the objects in descending order (newest to oldest)
        sort: {_id: -1},
        // don't add another task if the one searched for isnt found
        upsert: false
    })
    // if mongo sends a response to that process, get it
    .then(result => {
        // ignore result
        // log real language completion of task
        console.log('Marked Complete')
        // send the plain english response as a json
        response.json('Marked Complete')
    })
    // if theres an error, tell us whats happening
    .catch(error => console.error(error))

})

// set up the instance of express to receive a PUT requests made to the /markUnComplete endpoint
app.put('/markUnComplete', (request, response) => {
    // see above, access collection and update and object with same prop values
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // were setting / changing something
        $set: {
            // its fake news now
            completed: false
          }
    },{
        // sort newest to oldest
        sort: {_id: -1},
        // dont repeat
        upsert: false
    })
    // get return from mongo
    .then(result => {
        // ignore that return
        // log to server
        console.log('Marked Complete')
        // send to browser
        response.json('Marked Complete')
    })
    // what went wrong?
    .catch(error => console.error(error))

})

// set up the server to handle DELETE requests made with the /deleteItem endpoint
app.delete('/deleteItem', (request, response) => {
    // access the db collection named todo and delete an item in it that has the thing property equal to the request body's itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // get mongos return as a result
    .then(result => {
        // ignore it
        // log to the server that it was deleted
        console.log('Todo Deleted')
        // tell the browser it was deleted
        response.json('Todo Deleted')
    })
    // tells us what went wrong if something did
    .catch(error => console.error(error))

})

// tell the server to listen to the environment's port, or if its unavailable (only hosted locally) to listen at our pre-established local port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})