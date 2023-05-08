//import modules
const express = require('express')  // create an express application
const app = express() // create an app with express
const MongoClient = require('mongodb').MongoClient // connect to MongoDB
const PORT = 2121 // assigns the port value to 2121
require('dotenv').config()  // configure dotenv module to manage environment variables


let db, 
    dbConnectionStr = process.env.DB_STRING, // connects to database with environment variable
    dbName = 'todo' //name of DB is set to todo

// Connection to MongoDB database
// { useUnifiedTopology: true } -> MongoDB driver will use the new server discovery and monitoring engine
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) 
    // once the connection is established
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // set the db variable to todo
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') // set view engine to EJS
app.use(express.static('public')) // serve static files from the public directory
app.use(express.urlencoded({ extended: true })) // parse incoming requests with url-encoded payloads
app.use(express.json()) // parse requests with JSON payloads

// READ request
app.get('/',async (request, response)=>{  // set a route handler for the homepage
    const todoItems = await db.collection('todos').find().toArray() // retrieve all the documents from todos collection in DB
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // count number of incomplete tasks
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render 'index.ejs' and passes 'items' and 'left' to the view 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// CREATE request
app.post('/addTodo', (request, response) => { // set route handler for the POST request
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert new todo item into the todos collection 
    // if the insertion is successful
    .then(result => {
        console.log('Todo Added') // log 'todo added'
        response.redirect('/') // redirect user back to the homepage
    })
    .catch(error => console.error(error)) // if there is an error, log it to the console
})

// UPDATE request
app.put('/markComplete', (request, response) => { // set route handler for the PUT request to the /markComplete url 
    // update the todos collection
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ 
        $set: {
            completed: true // set the todo property to completed
          }
    },{
        sort: {_id: -1}, // sort the todo in reversed order
        upsert: false  // prevent creation of new todos when updating
    })
    // if successful ... 
    .then(result => {
        console.log('Marked Complete') // ... log a message to the console
        response.json('Marked Complete') // ... send a JSON response
    })
    // if not successful ... 
    .catch(error => console.error(error)) // log error to console

})

// UPDATE request to mark the todo as incomplete 
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false  // set the todo property to incomplete 
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

// DELETE request
app.delete('/deleteItem', (request, response) => {  // set a route handler for the DELETE request to the /deleteItem URL
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete one todo item matching the thing.itemFromJS value 
    // if deletion is successful... 
    .then(result => {
        console.log('Todo Deleted') // ... log a message to the console
        response.json('Todo Deleted') // send a JSON message 'Todo deleted'
    })
    // if there's an error, log the error to the console
    .catch(error => console.error(error))

})

// start the Express server and make it listen for port 2121
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) // log message indicating that the server is running
})