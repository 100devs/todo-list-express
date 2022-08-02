//adds express into project
const express = require('express')
//defines app with express value
const app = express()
//adds mongodb into project
const MongoClient = require('mongodb').MongoClient
//defines port
const PORT = 2121
//adds environment variable configuration for private information
require('dotenv').config()

//define mongodb data base
let db,
    //assign connnection string to enviroment variable
    dbConnectionStr = process.env.DB_STRING,
    //define database name as 'todo'
    dbName = 'todo'

//connect to mongodb with connection string variable
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //connection returns promise; run .then promise method to assign variable for the database
    .then(client => {
        //log database name into console
        console.log(`Connected to ${dbName} Database`)
        //store database into variable
        db = client.db(dbName)
    })
//assign ejs into app
app.set('view engine', 'ejs')
//uses static middleware to serve public folder
app.use(express.static('public'))
//tells express to use urlencoded middleware to parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }))
// parses json content from incoming requests
app.use(express.json())

// reading '/' endpoint with higher order get function
app.get('/',async (request, response)=>{
    // creates a constant variable and awaits all items from todos mongodb collection, and saves as an array
    const todoItems = await db.collection('todos').find().toArray()
    // creates a constant variable and awaits the count from todos mongodb collection that are marked as uncompleted
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //render the information from todoItems and itemsLeft variables
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    
    //another method to the above code
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// once endpoint matches '/addTodo', create a new item into the db
app.post('/addTodo', (request, response) => {
    //grabs collection and inserts one thing, with the completed set to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //promise object method because above line returns a promise
    .then(result => {
        //console logs added confirmation
        console.log('Todo Added')
        //redirects page
        response.redirect('/')
    })
    //if promise object fails, log the reason it failed
    .catch(error => console.error(error))
})

// once endpoint matches '/markComplete', update item in db
app.put('/markComplete', (request, response) => {
    //in the todos collection, update the task name given from user input
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //sets updates to be made
        $set: {
            //changes completed property value for selected item to true
            completed: true
          }
    },{
        //moves item to bottom of list
        sort: {_id: -1},
        //prevents insertion if item does not exist
        upsert: false
    })
    //promise object method that runs if update was successful
    .then(result => {
        //console logs update confirmation
        console.log('Marked Complete')
        //sending response back to sender
        response.json('Marked Complete')
    })
    //catches errors and logs the error
    .catch(error => console.error(error))

})

// once endpoint matches '/markUnComplete', update item in db
app.put('/markUnComplete', (request, response) => {
    //go into db and find item that was clicked based on user input
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //setting updates to be made
        $set: {
            //changes completed property value for selected item to true
            completed: false
          }
    },{
        //moves item to bottom of list
        sort: {_id: -1},
        //prevents insertion if item does not exist
        upsert: false
    })
    //if promise succeeds, run promise object method
    .then(result => {
        //logs update confirmation
        console.log('Marked Complete')
        //sending response back to sender
        response.json('Marked Complete')
    })
    //if promise fails, log reason it failed
    .catch(error => console.error(error))

})

//once endpoint matches '/deleteItem', remove an item from the db
app.delete('/deleteItem', (request, response) => {
    //in todos collection, delete user selected item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //if delete was successful
    .then(result => {
        //log deletion confirmation
        console.log('Todo Deleted')
        //send response back to sender
        response.json('Todo Deleted')
    })
    //if promise fails, log reason for failure
    .catch(error => console.error(error))

})

//listen method that specifies the port that will be used for the server
app.listen(process.env.PORT || PORT, ()=>{
    //log server running confirmation
    console.log(`Server running on port ${PORT}`)
})