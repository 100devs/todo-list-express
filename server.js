const express = require('express') // making it possible to use express with all its goodies
const app = express() // saving the express function in the 'app' variable
const MongoClient = require('mongodb').MongoClient // makes it possible to use methods associated with MongoClient and talk to our DB .MongoClient is what allows us to speak to MongoDB
const PORT = 2121 // setting a variable to a location where we can listen to the server
require('dotenv').config() // this allows us to look for variables inside of the .env file


let db, // declaring a variable
    dbConnectionStr = process.env.DB_STRING, // setting a variable to store our database connection string. we're declaring it globally so we can use it everywhere.
    dbName = 'todo' // declaring a variable and storing the name of the database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Call the static `connect` method on the `MongoClient` class, passing the `dbConnectionStr` and an options object with the `useUnifiedTopology` property set to `true` to use the new Server Discover and Monitoring engine.
    .then(client => {// we have a then now because MongoClient is returning a promise. we are waiting for the connection and proceeding if successful
        console.log(`Connected to ${dbName} Database`) // a confirmation message that we are connected to our database.
        db = client.db(dbName) // assiging a value to a previously declared variable that contains a db client factory method
       
    }) // closing our then
   
// MIDDLEWARE - processes our requests, either adding things to or handling the entire requests as they go through the server

// Templating Engine
app.set('view engine', 'ejs') // sets 'ejs' as the rendering method
// Static folder
app.use(express.static('public')) // setting the folder for static assets (main.js & styles.css)
// For posting data
app.use(express.urlencoded({ extended: true })) // its for handling form data so when that comes in the URL then you can pull that data out as a parameter
app.use(express.json()) // if JSON data is submitted, to be able to get that data out


app.get('/', async (request, response)=>{ // handling a read request from the CRUD. When the root route is passed in, sets up request/response parameters.
    const todoItems = await db.collection('todos').find().toArray() // sets a variable that awaits mongoDB to return ALL the documents from the collection of 'todos', as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable that awaits mongoDB to return the COUNT that matches the filter, which is, the documents that have a property of completed and a value of false. 
    const totalItems = await db.collection('todos').countDocuments({completed: true})
    // console.log(totalItems)
    response.render('index.ejs', {items: todoItems, left: itemsLeft, total: totalItems}) // we are rendering index.ejs and inside that render method, we're passing an object that has properties of the items to do and count of items left to do.
    // db.collection('todos').find().toArray()
    // .then(data => { 
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // starts a POST method when the form is submitted
    console.log(request.body)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // look into the database, in the todos collection, insert a new document(object) with a 'thing' of the todoItem (from the name property of the form) and a completed of false. We're setting up the properties in that object to thing and completed. 
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') 
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
   
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
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

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
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

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})