//defining variable to use express in server.js
const express = require('express')

//initiating express app, allows you to use variable name app
const app = express()

//importing mongodb in order to connect to a mongo database
const MongoClient = require('mongodb').MongoClient

//variable for port number
const PORT = 2121

//allows us to use .env file
require('dotenv').config()

/*
* let db = database
* dbConnectionStr = allows us to connect to mongo atlas db
* dbName = database name
*/
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

/*
* connecting app to mongoclient
* useUnifiedTopology = allows us to 
*/
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // create a new name db with the name you pass to it, allows you to access mongoDB
        db = client.db(dbName)
    })


//sets our view engine to ejs, allows us to use ejs
app.set('view engine', 'ejs')

//sets up public folder that will serve files to client
app.use(express.static('public'))

//parses incoming request with urlencoded payloads and is based on body-parser -parser is deprecated.
app.use(express.urlencoded({ extended: true }))

//It parses incoming JSON requests and puts the parsed data in request.
app.use(express.json())

// defines a GET request at default endpoint "/"
app.get('/', async (request, response) => {
    // accessing db collection called 'todos', .find returns documents and converts them into an array
    const todoItems = await db.collection('todos').find().toArray()

    //count documents in database that have false as a value for key "completed"
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    //passes todoItems and itemLeft to index.ejs file in order to be rendered.
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


//defined a POST request at /addToDo endpoint, used to Create a new document
app.post('/addTodo', (request, response) => {
    // adds new document to do todos collection, todoItem property is pulled from our request body
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        // redirects to base endpoint after the document is added 
        response.redirect('/')
    })
    // catches any errors from previous code
    .catch(error => console.error(error))
})


//defined a PUT request at /markComplete endpoint, used to update a document
app.put('/markComplete', (request, response) => {

    //updates a document from the todos collection
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //sets the completed key to true (in our ejs, will add a class "completed" in the span)
            completed: true
          }
    },{
        // method specifies the order in which the quert returns the match documents from the given collection
        sort: {_id: -1},
        // makes sure a new document isn't created if the document isn't found in our DB
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        // respond with json indicatin the marking is complete
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //sets the completed key to true (in our ejs, will add a class "completed" to the span) 
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked UnComplete')
        response.json('Marked UnComplete')
    })
    .catch(error => console.error(error))

})


//adds a DELETE request to /deleteItem endpoint
app.delete('/deleteItem', (request, response) => {
    //delete document from todos collection that has the thing key's value as the document passed to the request.
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