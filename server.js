const express = require('express') // Load Express
const app = express() // Creates app keyword for express, a common convention
const MongoClient = require('mongodb').MongoClient // load module to create manipulate connect to a Mongo DB
const PORT = 2121 // ser port to 2121
require('dotenv').config() // load & use .env file


let db, // delare db
    dbConnectionStr = process.env.DB_STRING, // create var for db url
    dbName = 'todo' // create var for db name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connecting to db and passing option to use newist engine and remove warning
    .then(client => {
        console.log(`Connected to ${dbName} Database`) // log message confirming DB connected
        db = client.db(dbName) // ?
    })
    
app.set('view engine', 'ejs') // tell express we're using ejs as temp engine
app.use(express.static('public')) // tell express to make public folder accessible to public middleware
app.use(express.urlencoded({ extended: true })) // convert form data to json   
app.use(express.json()) // convert request to json      


app.get('/',async (request, response)=>{ // handles get request
    const todoItems = await db.collection('todos').find().toArray() // get to do items from db
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // count db items that aren't completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // express meth to render html 
    
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // inserts a new item into todos collection, gives a completed value by default
    .then(result => { // if inset is successfull, do something
        console.log('Todo Added') //console log action
        response.redirect('/') // gets rid of the '/addTodo' route, and redirects back to '/' homepage
    }) // closing the .then
    .catch(error => console.error(error)) // catching errors
}) // ending the POST

app.put('/markComplete', (request, response) => { // starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, // moves item to bottom of the list
        upsert: false // prevents insertion if item doesnt already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // console logging successful completion
        response.json('Marked Complete') // sending a response back to sender
    }) // closing .then
    .catch(error => console.error(error)) // catching errors

}) // ending PUT

app.put('/markUnComplete', (request, response) => { // starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false // set completed status to false
          }
    },{
        sort: {_id: -1}, // moves item to bottom of the list
        upsert: false // prevents insertion if item doesnt already exist
    })
    .then(result => { // starts a then if update was successful
        console.log('Marked Complete') // console logging successful completion
        response.json('Marked Complete')// sending a response back to sender
    }) // closeing .then
    .catch(error => console.error(error)) // cathcing errors

}) // ending PUT

app.delete('/deleteItem', (request, response) => { // starts a delete when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // looks inside the todos collection for the ONE iten that has a watching name from our JS file
    .then(result => { //starts a .then if delete was successful
        console.log('Todo Deleted') // logging successful completion
        response.json('Todo Deleted') // sending a response back to the sender
    }) // closing then
    .catch(error => console.error(error)) // catching errors

})// ending delete

app.listen(process.env.PORT || PORT, ()=>{ // setting up which port will be listening on - either the port from the .env file or the port var we set
    console.log(`Server running on port ${PORT}`) // console.log the running port
}) // end listen method