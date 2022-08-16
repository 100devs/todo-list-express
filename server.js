const express = require('express') // set constant to utilize express to handle this file
const app = express() // assign constant to this instance of express
const MongoClient = require('mongodb').MongoClient // set constant to utilize MongoClient and associated methods to talk to database
const PORT = 2121 // set constant to location where our server will be listening
require('dotenv').config() // configure dotenv to use variables inside local .env file

let db, // set global to reference database after connection to database
    dbConnectionStr = process.env.DB_STRING, // set global to reference database connection string from .env file
    dbName = 'todo-list' // set global to reference database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // set promise to create connection to MongoDB database using database connection string plus unified topology to support server drivers, reduce topology maintenance, streamline functionality (???)
    .then(client => { // once connected, pass in client information
        console.log(`Connected to ${dbName} Database`) // log connection success to console
        db = client.db(dbName) // assign value from db client factory method to database name global
    })
// express middleware facilitates requests/responses between server and client
app.set('view engine', 'ejs') // set ejs templating engine to serve rendered files
app.use(express.static('public')) // set location for static assets in public folder
app.use(express.urlencoded({ extended: true })) // set URL encoding/decoding to match header and content, support arrays + objects
app.use(express.json()) // set parsing for request content with JSON

app.get('/', async (request, response) => { // set GET method for route to root; collect request/response parameters
    const todoItems = await db.collection('todos').find().toArray() // use await operator to reference array of documents from 'todos' collection in 'todo-list' database
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }) // use await operator to reference count of documents from 'todos' collection where "completed" key is false
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // send response with rendered ejs file with document array + count collected from 'todos' and stored in above awaited constants (will still provide error if there's an issue processing response)
    // PROMISE ABOVE: async-await; PROMISE BELOW: then-catch
    // db.collection('todos').find().toArray() // 
    // .then(data => { // 
    //     db.collection('todos').countDocuments({completed: false}) // 
    //     .then(itemsLeft => { // 
    //         response.render('index.ejs', { items: data, left: itemsLeft }) // 
    //     })
    // })
    // .catch(error => console.error(error)) // 
})

app.post('/addTodo', (request, response) => { // set POST method from form to route '/addTodo', receive request, send response
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // insert new document from todoItem from form input in request into 'todos' collection and set its 'completed' key to false by default
    .then(result => { // and then, if the insert is successful,
        console.log('Todo Added') // log success message to console
        response.redirect('/') // and reroutes to updated main page with new todos
    })
    .catch(error => console.error(error)) // log error to console if insert does not happen
}) // end POST method

app.put('/markComplete', (request, response) => { // set PUT method for route '/markComplete'; parameters to receive request, send response
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update first document with property 'thing' matching text from 'itemFromJS' in request body from form input in request (NOTE: better to use unique identifiers rather than a property which could be shared by multiple documents)
        $set: { // set its property
            "completed": true // 'completed' to true
          }
    },{ // 
        sort: {_id: -1}, // moves document to end of collection
        upsert: false // prevents automatic insertion if document does not already exist
    })
    .then(result => { // and then, if the update is successful,
        console.log('Marked Complete') // log success message to console
        response.json('Marked Complete') // send result back to client in JSON
    })
    .catch(error => console.error(error)) // log error to console if update does not happen

}) // end PUT method

app.put('/markUnComplete', (request, response) => { // set PUT method for route '/markUnComplete'; parameters to receive request, send response
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // update first document with property 'thing' matching text from 'itemFromJS' in request body from form input in request (NOTE: better to use unique identifiers rather than a property which could be shared by multiple documents)
        $set: { // set its property
            "completed": false // 'completed' to false
          }
    },{ // 
        sort: {_id: -1}, // moves document to end of collection
        upsert: false // prevents automatic insertion if document does not already exist
    })
    .then(result => { // and then, if the update is successful,
        console.log('Marked Incomplete') // log success message to console
        response.json('Marked Incomplete') // send result back to client in JSON
    })
    .catch(error => console.error(error)) // log error to console if update does not happen

}) // end PUT method

app.delete('/deleteItem', (request, response) => { // set DELETE method for route '/deleteItem'; parameters to receive request, send response
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete first document with property 'thing' matching text from 'itemFromJS' in request body from form input in request (NOTE: better to use unique identifiers rather than a property which could be shared by multiple documents)
    .then(result => { // and then, if the update is successful,
        console.log('Todo Deleted') // log success message to console
        response.json('Todo Deleted') // send result back to client in JSON
    })
    .catch(error => console.error(error)) // log error to console if update does not happen

}) // end DELETE method

app.listen(process.env.PORT || PORT, () => { // set express to listen on port specified in .env file or declared above
    console.log(`Server running on port ${PORT}`) // if listening, log message to console
})