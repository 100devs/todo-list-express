// load and include your modules (express and mongodb) using the "require" function
const express = require('express')
const { MongoClient } = require('mongodb');

// create an express application instance, the foundation for building a web app
const app = express()

// declare an environment variable, in this instance port 2121
const PORT = 2121

// load the .env package to store sensitive data in the application
require('dotenv').config()


// declare and assign the database connection string, hidden in the env file
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect the server to the mongodb database, using the above variable holding the connection string
MongoClient.connect(dbConnectionStr)
    .then(client => {
        // log the string that confirms the database name and the connection status
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    // console log any error
    .catch(err => console.error(err))
    
// set the view engine to "ejs" in order to render templates using ejs
app.set('view engine', 'ejs')

// use the built in middleware function "use" to serve static files in express app
app.use(express.static('public'))

// use the middleware function to parse URL-encoded form data as a JS object in req.body
app.use(express.urlencoded({ extended: true }))

// use middleware function for the app to read JSON data sent from client (like POST or PUT requests) and to make it available in the req.body
app.use(express.json())


app.get('/', async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
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

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
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

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})