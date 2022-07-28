// importing express
const express = require('express')
// using express as a funciton
const app = express()
// importing mongodb
const MongoClient = require('mongodb').MongoClient
// setting a port number
const PORT = 2121
// importing a .env file
require('dotenv').config()

// our entire database => collections => documents
let db
// get database connection string
let dbConnectionStr = process.env.DB_STRING
// set database
// document: an object that's sitting in the database somewhere
// multiple objects that are related to one another => collection
// multiple collections together => database
// multible databases => cluster0

// new project = new database AND new collections

// name for the database
let dbName = 'todo'

// connect to mongo
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // confirm connection was made
        console.log(`Connected to ${dbName} Database`)
        // setting db variable to entire database
        db = client.db(dbName)
})

// app.set = setting a setting
// this needs to be done before any app.use

// hey, we're using ejs please
app.set('view engine', 'ejs')

// hey, everything in the "public" folder is up for grabs if a user pings you
app.use(express.static('public'))

// a newer way of using bodyparser
app.use(express.urlencoded({ extended: true }))
// also a part of bodyparser for using json
app.use(express.json())

// this happens when a user goes to the webpage
// homepage = '/' google.com/
app.get('/', async (request, response)=> {
    // request = what comes in (req)
    // response = what goes out (res)

    // find everything in the todos collection and put it in an array
    const todoItems = await db.collection('todos').find().toArray()
    // count the number of documents (objects) inside of the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // show our ejs

    // show the user an ejs file
    // give the ejs file two objects
    // items = all of our objects in the database
    // left = number of items in the database
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // promise chaining syntax
    //      do something
    //          .then(do something else)
    //          .catch(some kind of error)
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// creating something new in the database
app.post('/addTodo', (request, response) => {
    // go into the todos database and insert a new object
    // object = {thing: todoItem}
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})

    .then(result => {
        // confirm something was added with a console.log
        console.log('Todo Added')
        // tell the user to go to home directory
        response.redirect('/')
    })
    // print error if something goes wrong
    .catch(error => console.error(error))
})

// update something in the database
app.put('/markComplete', (request, response) => {
    // find something with a matching name in the database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // mark is complete by setting completed to true
        $set: {
            completed: true
          }
    },{
        // sort it in descending order
        sort: {_id: -1},
        // don't create a new one  if it doesn't exist
        upsert: false
    })
    .then(result => {
        // confirm marked complete
        console.log('Marked Complete')
        // tell the user that it was marked complete
        response.json('Marked Complete')
    })
    // if an error happens tell the server about it
    .catch(error => console.error(error))
})

// update something
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // completed is now false
            completed: false
          }
    },{
        // sort in descending order again
        sort: {_id: -1},
        // don't create anything new
        upsert: false
    })
    // afterwards...
    .then(result => {
        // confirmed that it was marked uncomplete
        console.log('Marked Uncomplete')
        // send json to the user telling them the same thing
        response.json('Marked Uncomplete')
    })
    // tell me if something exploded during this
    .catch(error => console.error(error))
})

// go into the database and delete something
app.delete('/deleteItem', (request, response) => {
    // delete matching database object from todos
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // confirm the deletion was made
        console.log('Todo Deleted')
        // give the json to the user to confirm the deletion
        response.json('Todo Deleted')
    })
    // blah blah error
    .catch(error => console.error(error))
})

// actually start the server 
app.listen(process.env.PORT || PORT, ()=>{
    // confirm the port is running
    console.log(`Server running on port ${PORT}`)
})