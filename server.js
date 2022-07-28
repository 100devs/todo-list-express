//declare variables
//require express in order to install it
const express = require('express')
//assigning express function call to variable for easier use
const app = express()
//installing mongoclient to connect to db
const MongoClient = require('mongodb').MongoClient
//designating default port
const PORT = 2121
//installing dotenv to enable us to use environemnt variables
require('dotenv').config()

//connect database
//initialize db vairable
let db,
    //variable that stores db connection string
    dbConnectionStr = process.env.DB_STRING,
    //variables stores db name
    dbName = 'todo'

//connect to database using mongoclient
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //promise once connection is stablished
    .then(client => {
        //log to check connection
        console.log(`Connected to ${dbName} Database`)
        //assing database name to db string
        db = client.db(dbName)
    })

//setup middleware
//declare templating language    
app.set('view engine', 'ejs')
//declare use of static folder
app.use(express.static('public'))
//body parser to enable express to access the body of the request
app.use(express.urlencoded({ extended: true }))
//converts incoming data to json
app.use(express.json())

//get endpoint, asynchronous callback function with req and rest objects as parameters
app.get('/',async (request, response)=>{
    //search database collection named todos, finds all documents, converts to array
    const todoItems = await db.collection('todos').find().toArray()
    //count all documents that are marked as completed inside of the database and store number inside of variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //render response inside of ejs, sending todoItems and itemsLeft as properties inside of objects.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    //promise based syntax that does the same thing as the async/await above
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//post endpoint, k function with req and rest objects as parameters
app.post('/addTodo', (request, response) => {
    //go to collection named todos, insert a document 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //after insertion log message to console and redirect to '/'
    .then(result => {
        console.log('Todo Added')
        //redirects to get endpoint above which re renders the page
        response.redirect('/')
    })
    //if the promise gets rejected, the error handler runs
    .catch(error => console.error(error))
})

//update function with /markComplete endpoint, req res callback function
app.put('/markComplete', (request, response) => {
    //search collection named todos, update the one element with a matching thing: value
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set the targeted documents completed value to true
        $set: {
            completed: true
          }
    },{
        //sort database ascending depending on _id
        sort: {_id: -1},
        //ensures that no upsert operation takes place
        //even if there were to be dom manipulation
        upsert: false
    })
    //after completion logs to console 
    .then(result => {
        console.log('Marked Complete')
        //sends a response to complete the request
        response.json('Marked Complete')
    })
    //error handling in case anything goes wrong
    .catch(error => console.error(error))

})

//reverses mark complete, /markUnComplete ednpoints, req res objects
app.put('/markUnComplete', (request, response) => {
    //find document inside of todos database whose thing value matches
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set its completed to false
        $set: {
            completed: false
          }
    },{
        //sort ascending
        sort: {_id: -1},
        //ensures that no upsert operation takes place
        //even if there were to be dom manipulation
        upsert: false
    })
    .then(result => {
        //after completion logs to console 
        console.log('Marked Complete')
        //sends a response to complete the request
        response.json('Marked Complete')
    })
    //error handling in case anything goes wrong
    .catch(error => console.error(error))

})

// /deleteItem endoin, callback function with req and res objects
app.delete('/deleteItem', (request, response) => {
    //searches collection todos, deletes an entry whose thing property value matches the requests itemFromJS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //after completion log todo
    .then(result => {
        console.log('Todo Deleted')
        //send response back to client
        response.json('Todo Deleted')
    })
    //catch in case error occurs
    .catch(error => console.error(error))

})
//listens either on the port specified inside of the .env or the PORT
app.listen(process.env.PORT || PORT, ()=>{
    //logs server is running on port
    console.log(`Server running on port ${PORT}`)
})