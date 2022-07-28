const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

// variable that will store reference to database
let db,
    // variable to hold verification string for using database
    dbConnectionStr = process.env.DB_STRING,
    // holds name to database
    dbName = 'todo'

// allows servers to connent and communicate with database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // a call to the then method from the promise object that is returned
    .then(client => {
        // prints the name of the database that was connected to in server console
        console.log(`Connected to ${dbName} Database`)
        // stores database object inside of db variable
        db = client.db(dbName)
    })
    
// establishes the templating lanugages to use for create our html files
app.set('view engine', 'ejs')

// sets the root route from which to search for files when a request is made
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
// makes it to where json information is automatically parsed into javascript information
app.use(express.json())

// An api that listens for read requests on the root route
app.get('/',async (request, response)=>{
    
    // goes into database and finds our todo collection and puts all the todo items into an array
    const todoItems = await db.collection('todos').find().toArray()

    // retrieves the number of list items that have not been completed within our database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    // creates a new html file based on information within our todoitems object and itemsLeft variable
    // then sends back the newly created html file to the client
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

// api that listens for create requests on the route of /addTodo
app.post('/addTodo', (request, response) => {
    // adds a new document to our todo collection in the database with the value given from the request object
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        // redirects clients page back to the home or root page
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// api that listens for an update request on the route of /markComplete
app.put('/markComplete', (request, response) => {
    // updates a document within our database that is identified by the value received from the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // sets the completed property of specified document to have a value of true
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        // sends back an okay message to client to let it know operation was successful
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// api that listens for an update request on the route of /markUnComplete
app.put('/markUnComplete', (request, response) => {
    // updates a document within our database that is identified by the value received from the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
      // sets the completed property of specified document to have a value of false
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        // sends back an okay message to client to let it know operation was successful
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// api that listens for a delete request on the route of /deleteItem
app.delete('/deleteItem', (request, response) => {
    // deletes a document within our database that is identified by the value received from the request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        // sends back an okay message to client to let it know operation was successful
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// makes server listens for request on provided port if available or the local host port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})