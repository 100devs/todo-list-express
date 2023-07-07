const express = require('express') // import express and assign it to a variable so we can use it
const app = express() // assign express instance to an app variable
const MongoClient = require('mongodb').MongoClient // importing mongoClient and assign it to a variable
const PORT = 2121 // declaring a port number for where server will be listening
require('dotenv').config() // set up the use of .env file for the environment variables


let db, // declare a db variable without a value
    dbConnectionStr = process.env.DB_STRING, // declaring a variable that pulls in the DB_STRING (Database connection string) environment variable from .env file
    dbName = 'todo' // create a variable for database name of 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to MongoDB with database connection string and opt in to using MongoDB driver's connection
    .then(client => { // once successfully connected then:
        console.log(`Connected to ${dbName} Database`) // print to the console 'Connected to 'todo' Database'
        db = client.db(dbName) // assign db client factory method to existing db variable
    })
    
app.set('view engine', 'ejs') // set templating language to ejs
app.use(express.static('public')) // tell express that the public folder holds all static files (css, client side js)
app.use(express.urlencoded({ extended: true })) // tell express to decode and encode URLs to pull data from requests
app.use(express.json()) // tell express to parse JSON content from requests


app.get('/',async (request, response)=>{ // start GET (read) method when root page is loaded
    const todoItems = await db.collection('todos').find().toArray() // create a constant variable that waits for the todo collection in the database, finds all the docs in the collection, and places them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // create a constant variable that waits for the todo collection in the database and count the number of docs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // render EJS template with array of items found in the collection and count of uncompleted items
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // start POST (create) method when /addTodo route is passed in (creating a new task)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert a new doc in the todo collection, thing property get its value from the request body 
    .then(result => {
        console.log('Todo Added') // print a 'Todo added' in the console
        response.redirect('/') // respond by reloading the page
    })
    .catch(error => console.error(error)) // if there is an error, print the error message to console
})

app.put('/markComplete', (request, response) => { // Start PUT (update) method when /markComplete route is passed in (making a task complete by clicking on it)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update a doc in the todo collection that has the exact thing property with the same value of request body
        $set: { // prepare to change something about the document
            completed: true // set the completed property to true
          }
    },{ // prepare to do more things to the document
        sort: {_id: -1}, // move the document to last in the collection
        upsert: false // do not insert a new document if an existing document cannot be found
    })
    .then(result => { // once successfully updated then: 
        console.log('Marked Complete') // print to the console 'Marked Complete'
        response.json('Marked Complete') // response with 'Marked Complete'
    })
    .catch(error => console.error(error)) // if there is an error, print the error message to the console

})

app.put('/markUnComplete', (request, response) => { // Start PUT (update) method when /markUnComplete route is passed in (making a task unComplete by clicking on it)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update a doc in the todo collection that has the exact thing property with the same value of request body
        $set: { // prepare to change something about the document
            completed: false // set the completed property to false
          }
    },{
        sort: {_id: -1}, // move the document to the last in the collection
        upsert: false // do not insert a new document if an existing document cannot be found
    })
    .then(result => { // once successfully updated then: 
        console.log('Marked Complete') // print to the console 'Marked Complete'
        response.json('Marked Complete') // response with 'Marked Complete'
    })
    .catch(error => console.error(error)) // if there is an error, print the error message to the console

})

app.delete('/deleteItem', (request, response) => { // Start DELETE (delete) method when /deleteItem route is passed in (clicked the trash icon)
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete a doc in the todo collection that has the exact thing property with the same value of request body
    .then(result => { // once successfully deleted then: 
        console.log('Todo Deleted') // print to the console 'Todo Deleted'
        response.json('Todo Deleted') // response with 'Todo Deleted'
    })
    .catch(error => console.error(error)) // if there is an error, print the error message to the console

})

app.listen(process.env.PORT || PORT, ()=>{ // listen at either the host environment's port or the port set above in line 4
    console.log(`Server running on port ${PORT}`) // console log a message with the port number when the server is running
})
