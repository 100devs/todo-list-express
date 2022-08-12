//Import express package
const express = require('express')
//Create variable for express
const app = express()
//Connect to database
const MongoClient = require('mongodb').MongoClient
//Making a port variable
const PORT = 2121
//makes us able to use .env file
require('dotenv').config()


//Creating variables for Mongo connection
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//Returns promise and console logs if connected
//Set dbname to db variable
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
//Allows the use of views folder.ejs    
app.set('view engine', 'ejs')
//Allows any static file in public folder to be used
app.use(express.static('public'))
//Allows access query params
app.use(express.urlencoded({ extended: true }))
//Allows server to use json
app.use(express.json())


//Read the root url
app.get('/',async (request, response)=>{
    //Finding all todos in the database and put them into an array of objects
    const todoItems = await db.collection('todos').find().toArray()
    //Counts documents with key value pair of completed:false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Render index.ejs file with items
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

//Create item in the localhost:2121/addTodo url
app.post('/addTodo', (request, response) => {
    //Create an item with thing key and completed key
    //Grab item that came with POST request and save it to db
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //run promise and console.log(todo added)
    .then(result => {
        console.log('Todo Added')
        //respond and refresh
        //if it works redirected to home, GET request
        response.redirect('/')
    })
    //Catches an error if it doesn't work
    .catch(error => console.error(error))
})

//Update request to localhost:2121/markComplete
app.put('/markComplete', (request, response) => {
    //Update document that has thing: of entered
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //Set completed key to true
        $set: {
            completed: true
          }
    },{
        //Sort it in descending orders
        sort: {_id: -1},
        //If property doesn't exist and if it's true, create property
        upsert: false
    })
    //Respond
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//Update request to localhost:2121/markUncomplete
//Will undo markcomplete
//Sets completed key to false
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //Set completed key to false
        $set: {
            completed: false
          }
    },{
        //Sort it in descending order
        sort: {_id: -1},
        //If property doesn't exist and if it's true, create property
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//Send a delete request to delete item
app.delete('/deleteItem', (request, response) => {
    //Look through the documents for thing that matches text entered
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//Sets up a port to host the server
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
