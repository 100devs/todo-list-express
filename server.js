/**
    Class 42 Homework - Comment out every single line of TODO-LIST-EXPRESS
 */


// import the express module so we can use its methods to run a server
const express = require('express')
// express() is a method that is the first step in starting the server
const app = express()
// MongoClient is the first step taken to be able to connect to a MongoDB Atlas server
const MongoClient = require('mongodb').MongoClient
// Define the PORT that the express() server is going to run on
const PORT = 2121
// Import .env so we can use sensitive keys without showing the whole world
require('dotenv').config()

// initialize three variables, and use .env to hide the connection string, which is needed to access the mongoDB server
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

/**
    -   connect to the MongoDB server by using the connection string stored in your .env
    -   { useUnifiedTopology: --- } false by default. Set to true to use MongoDB drivers which
        is a connection management engine
 */
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // specify the database name that will be targetted
        db = client.db(dbName)
    })
  
// use EJS to create dynamic HTML elements from the mongoDB data
app.set('view engine', 'ejs')
// creates a public folder that files of js, css and html can be placed so server endpoints don't need to be created
app.use(express.static('public'))

/**
    -   this built in middleware from express. It parses incoming requests with urlencoded payloads and
        is based on body-parser. 
    -   only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option.
    -   extended:true, allows to choose between parsing the URL-encoded data with the querystring library (when false), 
        or the qs library when true. the extended syntax allows for rich objects and arrays to be encoded into the URL format,
        allowing for a JSON like experience with URL encoded
 */
app.use(express.urlencoded({ extended: true }))
// this is needed to parse application/json
app.use(express.json())


// when the root is requested, fire off this async callback:
app.get('/',async (request, response)=>{
    // find all data in the 'todo'database, and assemble it into an array
    const todoItems = await db.collection('todos').find().toArray()
    // returns the count of documents that match the query for a collection or view
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})


    // return this rendered data using ejs, and store the information in 'items' and 'left'
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// incert data into the mondo collection and redirect the client to the root when done
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// update data via a put
app.put('/markComplete', (request, response) => {
    // go into 'todos' collection, locate thing: request.body.itemFromJS and update completing 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        // If the value of upsert in a sharded collection is true then you have to include the full shard key in the filter.
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// update data via a put
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

// delete request
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})


// if the .env port is present use that, or default to PORT 2121
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})