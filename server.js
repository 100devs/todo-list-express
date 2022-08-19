//initialize variable to require express
const express = require('express')
//creating an instance of express
const app = express()
//initialize variable to require MongoClient to use associated methods to talk to mongodb 
const MongoClient = require('mongodb').MongoClient
//assign port on which the server will be listening
const PORT = 2121
//allows us to use variables in the .env file
require('dotenv').config()

//declare global variable db
let db,
    //assign database string to connect to the database
    dbConnectionStr = process.env.DB_STRING,
    //name the database
    dbName = 'todo'

//creating a connection to mongodb 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //waiting for a connection and proceeding if successful
    .then(client => {
        //console logging 'connected to todo Database
        console.log(`Connected to ${dbName} Database`)
        //assigning db client factory method to the variable db
        db = client.db(dbName)
    })

//middleware
//setting ejs as the default render method   
app.set('view engine', 'ejs')
//sets the location for static assets 
app.use(express.static('public'))
//tells express to decode and encode URLs where the header matches the content. Supports
// arrays and objects
app.use(express.urlencoded({ extended: true }))
//parses JSON content from incoming requests
app.use(express.json())

//request the server with the get method to respond to the root route
app.get('/',async (request, response)=>{
    //get all the todo items from the 'todos' collection and convert into an array and store to a variable
    const todoItems = await db.collection('todos').find().toArray()
    //count the todo items left to do with the countDocuments function and store in a variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //respond with the todo items and items left with ejs and output html
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

//request to add item from the input form with 'action' equals to addTodo
app.post('/addTodo', (request, response) => {
    //get a todo item from the request body and store in property 'thing',
    //assign false to a property completed, insert both properties to the db collection 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //if insert is successful, do something
    .then(result => {
        //console log action
        console.log('Todo Added')
        //redirects back to the homepage after done with the /addTodo route
        response.redirect('/')
    })
    //catching errors
    .catch(error => console.error(error))
})

//express uses the put method to update the db
app.put('/markComplete', (request, response) => {
    //go to the thing property in the db which has the item coming from the request body 
    //and set its property completed to true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        //moves item to the bottom of the list
        sort: {_id: -1},
        //prevents inserting an item if it already does not exist
        upsert: false
    })
    //starts a then if update is successful
    .then(result => {
        //logging successful completion
        console.log('Marked Complete')
        //sending a response back to the sender
        response.json('Marked Complete')
    })
    //catching errors
    .catch(error => console.error(error))

})

//express uses the put method to update the db
app.put('/markUnComplete', (request, response) => {
    //go to the thing property in the db which has the item coming from the request body
    //and update its property completed to false
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        //moves item to the bottom of the list
        sort: {_id: -1},
        //prevents inserting an item if it already does not exist
        upsert: false
    })
    //starts a then if update was successful
    .then(result => {
        //logging successful completion
        console.log('Marked Complete')
        //sending a response back to the sender
        response.json('Marked Complete')
    })
    //catching errros
    .catch(error => console.error(error))

})

// express uses the delete method to respond to a fetch request to delete an item 
app.delete('/deleteItem', (request, response) => {
    //go to the thing property in the db where its value is the item from the request body
    //and delete it
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //starts a then if delete is successful
    .then(result => {
        console.log('Todo Deleted')
        //sending a response back to the sender
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//setting up which port the server will be listening on, either the port from
//.env file or the port variable we set  
app.listen(process.env.PORT || PORT, ()=>{
    //console log the running port
    console.log(`Server running on port ${PORT}`)
})