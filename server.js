const express = require('express') // Requires the express package
const app = express() // Init's that express package
const MongoClient = require('mongodb').MongoClient // Requires MongoDB
const PORT = 2121 // Sets port to execute
require('dotenv').config() // Holds secret variables like mongoDB keys or tokens, exists outside of code (ignored in gitignore)

let db, // Establish some vars
    dbConnectionStr = process.env.DB_STRING, // Secret db string to coneect to it
    dbName = 'todo' // Name of db

// Mongo API code to connect to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) 
// Unified Topology = keeps open watch on the connection to make sure the data is ready. More efficient but not as stable yet.
    .then(client => { // after connecting, then...
        console.log(`Connected to ${dbName} Database`) // log that we're connected
        db = client.db(dbName) // take client, connect to database, set it to this var
    })
    
// middleware
app.set('view engine', 'ejs') // sets ejs as the default render method
app.use(express.static('public')) // look in public folder for routes we call up later, btwn call/response
app.use(express.urlencoded({ extended: true })) // tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) // Parses JSON content from incoming requests

// NOTE: The async makes sure the response ONLY sends when the response actually exists 
app.get('/',async (request, response)=>{ // app.get = when the client requests something. code executed below sends a response.
    const todoItems = await db.collection('todos').find().toArray() // sets a constant variable and awaits ALL items from the todos collection in db
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a constant variable and gets count of items in todos that have the completed status of "false" 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // rendering the EJS file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()  -> more efficient, one DB connection, and filters out completed:false items b/c you already got them
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) // Catches any errors, just in case
})

app.post('/addTodo', (request, response) => { // starts a POST method when the add route in passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, gives it a completed value of false by default NOTE: this is bad b/c no validation
    .then(result => { // if insert is successful, then do something
        console.log('Todo Added') // let us know in the log that we successfully added a todo
        response.redirect('/') // gets rid of the /addTodo route and goes back to the route screen
    }) // closing the .then
    .catch(error => console.error(error)) //catching errors
}) // ending the POST

app.put('/markComplete', (request, response) => { // UPDATE parts of DATABASE
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // change the todos, update one that matches name of item  passed in from the main.js file that was clicked on and sets to be true
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // sorts them in descending (biggest to lowest) order by id, e.g. newest one 
        upsert: false // DON'T update and insert and same time
    })
    .then(result => { // if insert is successful, then do something
        console.log('Marked Complete') // let us know it worked
        response.json('Marked Complete') // let the client know it worked
    })
    .catch(error => console.error(error)) // catch errors

})

app.put('/markUnComplete', (request, response) => {  // update our docs in the DB round 2
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // change one item
        $set: {
            completed: false // set as not completed
          }
    },{
        sort: {_id: -1}, // sort by id: this guy goes last
        upsert: false // don't update/insert at same time, don't add a double
    })
    .then(result => { // if insert is successful, then do something
        console.log('Marked Uncomplete') // let us know it worked // TYPO: Should be uncomplete
        response.json('Marked Uncomplete') // let the client know it worked
    })
    .catch(error => console.error(error)) // catch errors

})

app.delete('/deleteItem', (request, response) => { // Deletes an item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete one item from todos
    .then(result => { // starts a then if delete was successful
        console.log('Todo Deleted') // print result like before, catch error, etc
        response.json('Todo Deleted') // sending a response back to the sender
    })
    .catch(error => console.error(error)) // catch errors

})

app.listen(process.env.PORT || PORT, ()=>{ // listen on this port, first one is for haroku. second is for the one declared.
    console.log(`Server running on port ${PORT}`) // log that we are listening when this executes.
})