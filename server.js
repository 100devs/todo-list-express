// require is a built-in function to include external modules that exist in separate files
// add express
const express = require('express')
// it is convention to initialize express as app
const app = express()
// add mongoDB class MongoClient
const MongoClient = require('mongodb').MongoClient
// assign PORT #
const PORT = 2121
// loading environment variables from .env file 
require('dotenv').config() 

// declare variable db for Database
let db,
// process.env.DB_STRING - DB_string is found in .env file
    dbConnectionStr = process.env.DB_STRING,
// specify the name of the database we are connecting to
    dbName = 'todo'

// connects the server to the database using the dbConnectionStr as an argument
// useUnifiedTopology opts into the most recent topology MongoDB engine
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// once database is connected then the following will occur:
    .then(client => {
        // will console.log that connecting to the Database is successful
        console.log(`Connected to ${dbName} Database`)
        // reassigning the database variable to equal the individual client's to-do list database
        db = client.db(dbName)
    })

// the view engine is set to ejs template engine
app.set('view engine', 'ejs')
// adds in use of the public folder for all client-facing css, js, imgs, etc.
// all in the public folder can be accessed without creating a specific route
app.use(express.static('public'))
// add in url parser
app.use(express.urlencoded({ extended: true }))
// add in ability to use json
app.use(express.json())


// a GET request to '/'
app.get('/',async (request, response)=>{
    // find ALL items listed in the todos collection and return them as an array
    const todoItems = await db.collection('todos').find().toArray()
    // return count of INCOMPLETE tasks
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // index.ejs will render client side with the arguments of ALL items and INCOMPLETE items
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

// a POST request to /addTodo
app.post('/addTodo', (request, response) => {
    // insert the todo task into the todos collection as a thing
    // the default completion status is set to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // successful POST will continue with the following
    .then(result => {
        // the console will show a the action is completed with 'Todo Added'
        console.log('Todo Added')
        // client side will be redirected to the home ('/') page
        response.redirect('/')
    })
    // catch any errors that occur during this process and show them in the console
    .catch(error => console.error(error))
})

// PUT request to '/markComplete
app.put('/markComplete', (request, response) => {
    // updateOne item with itemFromJS property value that matches thing on the database side 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // changes the completed status to true
        $set: {
            completed: true
          }
    },{
        // sort ids in descending order
        sort: {_id: -1},
        // if the item doesn't exist it will not add it
        upsert: false
    })
    // if successful
    .then(result => {
        // then console log will read 'marked complete'
        console.log('Marked Complete')
        // json response to main.js will be 'marked complete'
        response.json('Marked Complete')
    })
    // catch any errors that occur during this process and show them in the console 
    .catch(error => console.error(error))

})

// PUT request to '/markUnComplete
app.put('/markUnComplete', (request, response) => {
    // updateOne item with itemFromJS property value that matches thing on the database side 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // changes the completed status to false
        $set: {
            completed: false
          }
    },{
        // sort ids in descending order
        sort: {_id: -1},
        // if the item doesn't exist it will not add it
        upsert: false
    })
    // if successful
    .then(result => {
        // then console log will read 'marked complete'
        console.log('Marked Complete')
        // json response to main.js will be 'marked complete'
        response.json('Marked Complete')
    })
    // catch any errors that occur during this process and show them in the console 
    .catch(error => console.error(error))

})

// DELETE request to '/deleteItem
app.delete('/deleteItem', (request, response) => {
    // deleteOne item with itemFromJS property value that matches thing on the database side 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // if successful
    .then(result => {
        // then console log will read 'marked complete'
        console.log('Todo Deleted')
        // json response to main.js will be 'marked complete'
        response.json('Todo Deleted')
    })
    // catch any errors that occur during this process and show them in the console 
    .catch(error => console.error(error))

})

// server will run on PORT set by the environment or default PORT value declared earlier (2121)
app.listen(process.env.PORT || PORT, ()=>{
    // will show that it's a successful connection by console.logging the template literal
    console.log(`Server running on port ${PORT}`)
})