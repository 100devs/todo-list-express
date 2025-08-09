const express = require('express')  // Load the express so we can use it in the file
 const app = express() // We call express() and store the server in 'app' so we can use all its methods without writing express each time

 const MongoClient = require('mongodb').MongoClient; // Load MongoClient from the mongodb  to connect to MongoDB

const PORT = 2121  // Listining od port 2122
require('dotenv').config()




    let db, // will hold our database connection
    dbConnectionStr = process.env.DB_STRING, // get the database connection string from .env
    dbName = 'todo' // name of the database we want to use

// Connect to MongoDB using the connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`) // confirm connection
        db = client.db(dbName) // store the database connection in 'db'
    })

    
app.set('view engine', 'ejs') // Tell Express to use EJS for rendering views
app.use(express.static('public')) // Let Express serve files from the 'public' folder (CSS, JS, images, etc.)
app.use(express.urlencoded({ extended: true })) // Read form data from POST requests

app.use(express.json()) // Take JSON data from requests and put it into req.body



app.get('/',/*async*/ (request, response)=>{
    // const todoItems = await db.collection('todos').find().toArray()
    // const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()
    .then(data => {
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// Mark a todo as complete
app.put('/markComplete', (request, response) => {

    // FILTER: find the todo whose "thing" text matches what the browser sent us.
    //    main.js sent it as { itemFromJS: 'the text' } in the request body.
    db.collection('todos').updateOne({thing: request.body.itemFromJS}, 
        { 
        $set: {
            completed: true // set completed -> true
          }
    },
    { // prefer newest match; don’t create if missing
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') // reply to the client
    })
    .catch(error => console.error(error))

})
// Mark a todo as NOT complete
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne(

         // Find the doc by its text again.
        {thing: request.body.itemFromJS},{
        $set: {
            completed: false // set completed -> false
          }
    },{ // prefer newest match; don’t create if missing
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete') // reply to the client
    })
    .catch(error => console.error(error))

})

// Delete a todo
app.delete('/deleteItem', (request, response) => {

    // Remove exactly ONE document whose "thing" matches the text we got from the browser.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) 
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// Start server (use provider’s PORT if available)
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})


