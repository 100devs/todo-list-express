const express = require('express') // Require Express on the server
const app = express() // Make it easier to use the express code
const MongoClient = require('mongodb').MongoClient // Creates our MongoDB connection
const PORT = 2121 // Set the port to twentyone-twentyone
require('dotenv').config() // Allows support of our .env structure to protect our secrets


// Database variables

let db, // Create a db variable to be set later
    dbConnectionStr = process.env.DB_STRING, // Get the DB string from our env file
    dbName = 'todo' // Set the DB name to what is needed

// Database connection

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Connect to the DB
    .then(client => { // once connected, do the following
        console.log(`Connected to ${dbName} Database`) // Console log the DB connection
        db = client.db(dbName) // Setting a value to the db variable we created above
    })
    
app.set('view engine', 'ejs') // Set EJS as our view engine
app.use(express.static('public')) // Set EJS to use the public folder as its destination
app.use(express.urlencoded({ extended: true })) // Set the URL encoding
app.use(express.json()) // Tell Express to use json files


app.get('/',async (request, response)=>{ // Look for root folder requests and do the following
    const todoItems = await db.collection('todos').find().toArray() // A variable to hold all of our todo items from the DB in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // A variable to hold the number of incomplete todo items
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Render the items from the above variables
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {  // Look for requests sent to the addTodo folder do the following
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Insert an item to the DB 
    .then(result => { // then do the following
        console.log('Todo Added') // console log the item that was added
        response.redirect('/') // refresh the page
    })
    .catch(error => console.error(error)) // catch any errors and console log them if detected
})

app.put('/markComplete', (request, response) => { // Look for requests sent to the markComplete folder and do the following
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Update an item property in the DB
        $set: {
            completed: true // set the completed property to true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => { // then do the following
        console.log('Marked Complete')  // console log that an item was completed
        response.json('Marked Complete') // respond via json that it was completed as well
    })
    .catch(error => console.error(error)) // catch any errors and console log them if detected

})

app.put('/markUnComplete', (request, response) => {  // Look for requests sent to the markUnComplete folder and do the following
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Update an item property in the DB
        $set: {
            completed: false // set the completed property to false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => { // then do the following
        console.log('Marked Inomplete') // console log the item that was marked as completed
        response.json('Marked Inomplete') // respond via json that it was completed as well
    })
    .catch(error => console.error(error)) // catch any errors and console log them if detected

})

app.delete('/deleteItem', (request, response) => { // Look for requests sent to the deleteItem folder and do the following
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Delete an item in the DB
    .then(result => { // then do the following
        console.log('Todo Deleted') // console log the item that was deleted
        response.json('Todo Deleted') // respond via json that it was completed as well
    })
    .catch(error => console.error(error)) // catch any errors and console log them if detected

})

app.listen(process.env.PORT || PORT, ()=>{ // Listen on the port we set in the env file, or here if that doesn't exist, then do the following
    console.log(`Server running on port ${PORT}`) // Console log the port that the server is running on
})