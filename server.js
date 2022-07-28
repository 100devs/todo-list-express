//Modules and global variables
//express module, MongoDB module, and dotenv module being used and requiring it for the app
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
//declaring the local port number as a variable
const PORT = 2121
require('dotenv').config()

//declaring db, mongodb connection link, and database name as global variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connecting to the database
// passing in the connectiong string to tell the connect method which server to connect to
// useUnifiedTopology determines the version of MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        // establishes the client with its given name
        db = client.db(dbName)
    })

// telling the app which view engine to use, so that we can use ejs
app.set('view engine', 'ejs')
// setting up the use of the public folder and tells ejs where to find the compatible files
app.use(express.static('public'))
// negates the need for body-parser
// and tells express to encode and decode URLs automatically
app.use(express.urlencoded({ extended: true }))
// tells express that everything we're doing in JSON
app.use(express.json())

// the operations to do when going to the different pages
// this is for the home page
app.get('/', async (request, response) => {
    // converts the todoItems into an array
    const todoItems = await db.collection('todos').find().toArray();
    // counts how many items still need to be done and counts them
    // then sets their boolean completed value to false
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false });
    // renders the index.ejs page and passes the parameters into that page
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

// the method to create additional items to the todo list
app.post('/addTodo', (request, response) => {
    // adds a new item to the todo list and sets its completed boolean to false
    db.collection('todos').insertOne({thing: request.body.todoItem.trim(), completed: false})
        .then(result => {
        // alerts via the console that the item has been added
        // once added, the page returns to the main page with the list of items
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// with a PUT method we can update the items on the list to 
app.put('/markComplete', (request, response) => {
    // updates an item in your list itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // marks the item as completed
            completed: true
          }
    }, {
        // tells the item to go to the bottom of the list
        sort: { _id: -1 },
        // if you don't find something, don't automatically assign something new
        upsert: false
    })
    // console logging that it's been marked complete, and also responding back to the client in JSON saying it's been marked complete
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))
})


// with a PUT method we can update the items on the list to 
app.put('/markUnComplete', (request, response) => {
    // updates an item in your list itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // marks the item as incompleted
            completed: false
          }
    }, {
            // tells the item to go to the bottom of the list
        sort: { _id: -1 },
        // if you don't find something, don't automatically assign something new
        upsert: false
    })
        .then(result => {
        // console logging that it's been marked complete, and also responding back to the client in JSON saying it's been marked Incomplete
        console.log('Marked Incomplete')
        response.json('Marked Incomplete')
    })
    .catch(error => console.error(error))

})


// responding to a DELETE request
app.delete('/deleteItem', (request, response) => {
    console.log(`request`, request.body)
    // deletes the item from the itemFromJS object
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
        .then(result => {
        // console logging that it's been deleted, and also responding back to the client in JSON saying it's been deleted
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})


// tells the server which port to use, either from the .env file, or the hard-coded value at the beginning
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})