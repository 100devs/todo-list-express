const express = require('express') // Import express
const app = express() // Create express app
const MongoClient = require('mongodb').MongoClient // Import mongo client
const PORT = 2121 // Set port
require('dotenv').config() // Import dotenv


let db, // Create db variable
    dbConnectionStr = process.env.DB_STRING, // Set db connection string
    dbName = 'todo' // Set db name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Connect to db
    .then(client => { // If connected
        console.log(`Connected to ${dbName} Database`) // Log connection
        db = client.db(dbName) // Set db to client db
    })
    
app.set('view engine', 'ejs') // Set view engine to ejs
app.use(express.static('public')) // Set static folder
app.use(express.urlencoded({ extended: true })) // Set body parser to parse form data
app.use(express.json()) // Set body parser to parse json data


app.get('/',async (request, response)=>{ // Get request to root 
    const todoItems = await db.collection('todos').find().toArray() // Get all todo items from db
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Get number of incomplete items from db
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Render index.ejs with todo items and number of incomplete items
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // Post request to add todo item
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Insert todo item into db
    .then(result => { // If inserted 
        console.log('Todo Added') // Log insert
        response.redirect('/') // Redirect to root
    })
    .catch(error => console.error(error)) // If error log error and redirect to root
})

app.put('/markComplete', (request, response) => { // Put request to mark todo item as complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Update todo item in db
        $set: { // Set completed to true
            completed: true // Set completed to true
          }
    },{
        sort: {_id: -1}, // Sort by id descending to get most recent item to update first (so it doesn't update the wrong item) (-1 means descending) (1 means ascending) (0 means no sort) 
        upsert: false // Do not insert if not found
    })
    // why do we have to sort in this way?
    .then(result => { // If updated
        console.log('Marked Complete') // Log update
        response.json('Marked Complete') // Return json response
    })
    .catch(error => console.error(error)) // If error log error and return json response

})

app.put('/markUnComplete', (request, response) => { // Put request to mark todo item as incomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Update todo item in db
        $set: { // Set completed to false
            completed: false // Set completed to false
          }
    },{
        sort: {_id: -1}, // Sort by id-1 for 0 indexing
        upsert: false // Do not insert if not found
    })
    .then(result => { // If updated
        console.log('Marked Complete') // Log update
        response.json('Marked Complete') // Return json response
    })
    .catch(error => console.error(error)) // If error log error and return json response

})

app.delete('/deleteItem', (request, response) => { // Delete request to delete todo item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Delete todo item from db
    .then(result => { // If deleted
        console.log('Todo Deleted') // Log delete
        response.json('Todo Deleted') // Return json response
    })
    .catch(error => console.error(error))   // If error log error and return json response

})

app.listen(process.env.PORT || PORT, ()=>{ // Listen on port
    console.log(`Server running on port ${PORT}`) // Log port
})