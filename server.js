const express = require('express') // express helps us set up our server and routing
const app = express() // we create an instance of express and store it in a variable called app
const { MongoClient } = require('mongodb') // we pull out the MongoClient class from the mongodb library, which allows us to connect to a MongoDB database use it
const PORT = 2121 // we set a port number for our server to listen on - it can be any
require('dotenv').config() // we use the dotenv library to load environment variables from a .env file into process.env, which allows us to keep sensitive information out of the codebase


let db,
    dbConnectionStr = process.env.DB_STRING, // we get the database connection string from the env file
    dbName = 'todo' // we set the name of our database

MongoClient.connect(dbConnectionStr) // we connect to the database using the connection string, which returns a promise that resolves to a MongoClient instance
  .then(client => { 
    console.log(`Connected to ${dbName} Database`) // we log a message to the console to confirm that we've connected to the database
    db = client.db(dbName) // we set the db variable to the database instance, which we can use to interact with the database in our routes and other parts of the code

    app.listen(process.env.PORT || PORT, () => { // we start the server and have it listen on the port, set to either the env variable PORT or the const PORT
      console.log(`Server running on port ${process.env.PORT || PORT}`) // the server will now not accept requests until it has connected to the database
    })
  })
  .catch(error => console.error(error)) // we catch any errors that occur during the connection process and log them to the console

    
app.set('view engine', 'ejs') // we set the view engine to ejs, which allows us to render ejs templates in our routes and send them as responses to the client
app.use(express.static('public')) // we use the express.static middleware to serve static files from the 'public' directory, which allows us to include CSS and client-side JavaScript in our API
app.use(express.urlencoded({ extended: true })) // we use the express.urlencoded middleware to parse incoming request bodies in a middleware before our handlers, which allows us to access form data sent from the client in our routes
app.use(express.json()) // we use the express.json middleware to parse incoming request bodies in a middleware before our handlers, which allows us to access JSON data sent from the client in our routes


app.get('/',async (request, response)=>{ // we define a route for the root URL of our server, which will render the main page of our application
    const todoItems = await db.collection('todos').find().toArray() // we get all the todo items from the database by finding all documents in the 'todos' collection and converting them to an array, which we can then pass to our template for rendering
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // we count the number of documents in the 'todos' collection that have a 'completed' field set to false, which gives us the number of items left to complete
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // we render the 'index.ejs' template and pass it an object with the todo items and the number of items left, which allows us to display this information on the page
    // db.collection('todos').find().toArray()
    // .then(data => { this is the same as the two lines above, but using promises instead of async/await
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // we define a route for handling POST requests to the '/addTodo' URL, which will add a new todo item to the database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // we insert a new document into the 'todos' collection with the 'thing' field set to the value of the 'todoItem' field from the request body and the 'completed' field set to false, which adds a new todo item to the database
    .then(result => { // we log a message to the console to confirm that the item was added and send a response back to the client to indicate that the operation was successful
        console.log('Todo Added') // we log a message to the console to confirm that the item was added
        response.redirect('/') // we redirect the client back to the root URL, which will trigger a new GET request and render the updated list of todo items
    })
    .catch(error => console.error(error)) // we catch any errors that occur during the insertion process and log them to the console
})

app.put('/markComplete', (request, response) => { // we define a route for handling PUT requests to the '/markComplete' URL, which will update a todo item in the database to mark it as completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // we find a document in the 'todos' collection that has a 'thing' field matching the value of the 'itemFromJS' field from the request body, which identifies the item to update
        $set: { // we use the $set operator to update the 'completed' field of the matching document to true, which marks the item as completed in the database
            completed: true // we set the 'completed' field to true, which indicates that the item is completed
          }
    },{
        sort: {_id: -1}, // we sort the documents in descending order by their _id field, which ensures that if there are multiple documents with the same 'thing' value, we update the most recently added one
        upsert: false // we set upsert to false, which means that if no matching document is found, we do not create a new one
    })
    .then(result => { // we log a message to the console to confirm that the item was marked as completed and send a response back to the client to indicate that the operation was successful
        console.log('Marked Complete') // we log a message to the console to confirm that the item was marked as completed
        response.json('Marked Complete') // we send a JSON response back to the client with a message indicating that the item was marked as completed, which allows the client-side JavaScript to handle the response and update the UI
    })
    .catch(error => console.error(error)) // we catch any errors that occur during the update process and log them to the console

})

app.put('/markUnComplete', (request, response) => { // we define a route for handling PUT requests to the '/markUnComplete' URL, which will update a todo item in the database to mark it as not completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // we find a document in the 'todos' collection that has a 'thing' field matching the value of the 'itemFromJS' field from the request body, which identifies the item to update
        $set: { // we use the $set operator to update the 'completed' field of the matching document to false, which marks the item as not completed in the database
            completed: false // we set the 'completed' field to false, which indicates that the item is not completed
          }
    },{
        sort: {_id: -1}, // we sort the documents in descending order by their _id field, which ensures that if there are multiple documents with the same 'thing' value, we update the most recently added one
        upsert: false // we set upsert to false, which means that if no matching document is found, we do not create a new one
    })
    .then(result => { // we log a message to the console to confirm that the item was marked as not completed and send a response back to the client to indicate that the operation was successful
        console.log('Marked Complete') // we log a message to the console to confirm that the item was marked as not completed
        response.json('Marked Complete') // we send a JSON response back to the client with a message indicating that the item was marked as not completed, which allows the client-side JavaScript to handle the response and update the UI
    })
    .catch(error => console.error(error)) // we catch any errors that occur during the update process and log them to the console

})

app.delete('/deleteItem', (request, response) => { // we define a route for handling DELETE requests to the '/deleteItem' URL, which will delete a todo item from the database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // we find a document in the 'todos' collection that has a 'thing' field matching the value of the 'itemFromJS' field from the request body and delete it from the database, which removes the item from the database
    .then(result => { // we log a message to the console to confirm that the item was deleted and send a response back to the client to indicate that the operation was successful
        console.log('Todo Deleted') // we log a message to the console to confirm that the item was deleted
        response.json('Todo Deleted') // we send a JSON response back to the client with a message indicating that the item was deleted, which allows the client-side JavaScript to handle the response and update the UI
    })
    .catch(error => console.error(error)) // we catch any errors that occur during the deletion process and log them to the console

})