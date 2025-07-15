
//Import the Express framework to create the server
const express = require('express')

//create an instance of the Express app
const app = express()

//Import MongoClient from the MongoDB library to connect to the database
const MongoClient = require('mongodb').MongoClient

//Define the port number, using either the environment or defaulting to 2121
const PORT = 2121
require('dotenv').config()

//Declare variables for the database connection
let db,
    dbConnectionStr = process.env.DB_STRING,//Get the connection string from the .env file
    dbName = 'todo'//Name of the database

//Connect to MongoDB using the connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)//Log successful connection
        db = client.db(dbName)//Store the database connection in the db variable
    })

//Set tthe view engine to EJS so we can use templating in our HTML
app.set('view engine', 'ejs')

//Make the "public" folder accessible to the browser (for CSS, JS, images, etc.)
app.use(express.static('public'))

//Middleware to parse form data(from POST request)
app.use(express.urlencoded({ extended: true }))

//Middleware to parse JSON data 
app.use(express.json())

//GET route for the homepage
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()//Get all to-do items from the collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//Count how many items are not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//Render the index page and pass the data to it 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})


//POST route to add a new to-do item
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//Insert a new item into the database 
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//PUT route to mark an intem as complete 
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true //set the "completed" field to true  
          }
    },{
        sort: {_id: -1},//sort by newest if there are duplicates 
        upsert: false //Do not insert a new document if none is found 
    })
    .then(result => {
        console.log('Marked Complete') // Log a success message 
        response.json('Marked Complete') //Send a response to the client 
    })
    .catch(error => console.error(error)) //Handle any errors 

})

//PUT route to mark an item as incomplete
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false //Set the "completed" field to false 
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

//DELETE route to remove an item 

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//delete the item that matches the name
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//Start the server and listen on the defined port

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})