const express = require('express') // Import express
const app = express() // Create express app
const MongoClient = require('mongodb').MongoClient // Import mongo client
const PORT = 2121 // Set port
require('dotenv').config() // Import dotenv


let db,  // Declare db and collection
    dbConnectionStr = process.env.DB_STRING, // Set db connection string
    dbName = 'todo' // Set db name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Connect to db
    .then(client => { // If connected
        console.log(`Connected to ${dbName} Database`) // Log connection
        db = client.db(dbName) // Set db
    }) // End if connected
    
app.set('view engine', 'ejs') // Set view engine
app.use(express.static('public')) // Set static folder
app.use(express.urlencoded({ extended: true })) // Set extended true
app.use(express.json()) // Set json true


app.get('/',async (request, response)=>{ // Get /
    const todoItems = await db.collection('todos').find().toArray() // Get todo items
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Get items left
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Render index.ejs
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // Post /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Insert todo item
    .then(result => { // If inserted
        console.log('Todo Added')   // Log insert
        response.redirect('/') // Redirect to /
    }) // End if inserted
    .catch(error => console.error(error)) // Catch error
})

app.put('/markComplete', (request, response) => { // Put /markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  // Update todo item
        $set: { 
            completed: true // Set completed to true
          } 
    },{ 
        sort: {_id: -1}, // Sort by id
        upsert: false // Do not insert if not found
    })
    .then(result => { // If updated
        console.log('Marked Complete') // Log update
        response.json('Marked Complete') // Send json
    })
    .catch(error => console.error(error)) // Catch error

})

app.put('/markUnComplete', (request, response) => { // Put /markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Update todo item
        $set: {
            completed: false // Set completed to false
          }
    },{
        sort: {_id: -1}, // Sort by id
        upsert: false // Do not insert if not found
    })
    .then(result => { // If updated
        console.log('Marked Complete') // Log update
        response.json('Marked Complete') // Send json
    })
    .catch(error => console.error(error)) // Catch error

})

app.delete('/deleteItem', (request, response) => { // Delete /deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Delete todo item
    .then(result => { // If deleted
        console.log('Todo Deleted') // Log delete
        response.json('Todo Deleted') // Send json
    })
    .catch(error => console.error(error)) // Catch error

})

app.listen(process.env.PORT || PORT, ()=>{ // Listen on port
    console.log(`Server running on port ${PORT}`) // Log port
})