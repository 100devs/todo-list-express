const express = require('express')  // use express
const app = express()   // set the variable 'app' to the method express(), in order to use the methods in the express module
const MongoClient = require('mongodb').MongoClient  // use mongodb and set MongoClient to call its methods
const PORT = 2121   // set the server's default port to 2121
require('dotenv').config()  // use dotenv for env files

let db, // declare the db variable
    dbConnectionStr = process.env.DB_STRING,    // declare a var that stores the database uri
    dbName = 'todo' // set the dbname that we're going to call from the db to todo

// connect to mongodb using the connectionstring, log the name of the db, and store a reference to the db in the var db    
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//middleware
app.set('view engine', 'ejs')   // use ejs to render html pages
app.use(express.static('public'))   // look in the 'public' folder for static files
app.use(express.urlencoded({ extended: true })) // lets express parse url requests
app.use(express.json()) // lets express understand json files

// routes
// when a client tries to get the '/' route , get todo items from the database and store them in the todoItems var as an array,
// then store the number of incomplete items in itemsLeft
app.get('/', async (request, response) => {
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
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

// when a client tries to post to the 'addTodo' route, insert an incomplete todo item into the database, using the request body's todoItem parameter,
// then console log 'todo added' and load the '/' route. If any errors occur, log them in the console
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false })
        .then(result => {
            console.log('Todo Added')
            response.redirect('/')
        })
        .catch(error => console.error(error))
})

// when a client tries to put to the 'markComplete' route, find the item in the 'todos' db that matches the request's body's itemFromJS param, and mark it as complete.
// then responds to the requester. If any errors are caught, they'll be logged in the console
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: true
        }
    }, {
        sort: { _id: -1 }, // if there are multiple entries found, sorts them by id such that only the first one by id is updated
        upsert: false   // don't create a new entry if one doesn't exist
    })
        //log the results in the console and respond to the requester with 'marked complete'
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        .catch(error => console.error(error))

})

//when a client tries to put to the 'markUnComplete' route, find the item in the 'todos' db that matches the request's body's itemFromJS param, and mark it as incomplete
//then responds to the requester. If any errors are caught, they'll be logged in the console
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({ thing: request.body.itemFromJS }, {
        $set: {
            completed: false
        }
    }, {
        sort: { _id: -1 },  // if there are multiple entries found, sorts them by id such that only the first one by id is updated
        upsert: false   // don't create a new entry if one doesn't exist
    })
        // log the results in the console and respond to the requester with 'marked complete'
        .then(result => {
            console.log('Marked Complete')
            response.json('Marked Complete')
        })
        .catch(error => console.error(error))

})

// when a client tries to delete via the 'deleteItem' route, find the item in the 'todos' db that matches the request's body's itemFromJS param, and delete it
// then responds to the requester. If any errors are caught, they'll be logged in the console
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS })
        // log the results in the console and respond to the requester with 'todo deleted'
        .then(result => {
            console.log('Todo Deleted')
            response.json('Todo Deleted')
        })
        .catch(error => console.error(error))

})

// the server listens for requests on either the port as defined in the process.env file, or whatever our PORT var is set to
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)   // console logs our default port
})