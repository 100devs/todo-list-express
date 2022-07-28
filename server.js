const express = require('express') //making it possible to use express in this file
const app = express() //setting a constant and assigning it to express
const MongoClient = require('mongodb').MongoClient //allows us to use methods associated with MongoClient and talk to our database
const PORT = 2121 //setting a constant to set the location where the server will be listening
require('dotenv').config() //allows access to the variables we set in the .env file


let db, //declaring a global variable named db but it is not assigned a value
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and setting it to our db string in the .env file
    dbName = 'todo' //declaring a varible and assigning it to the name of our database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connecting to MongoDB
    .then(client => { //waiting for the connection and proceeding if successful and then passing in client info
        console.log(`Connected to ${dbName} Database`) //logging to console when the database connection is complete
        db = client.db(dbName) //assigning the db variable to a db client factory method
    }) //closing the then
//middleware    
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the header matches the content. Supports arrays and objects
app.use(express.json()) //parses json content from incoming request


app.get('/',async (request, response)=>{ //starts the get method when the root is passsed in and sets the req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //setting a variable and awaits all the items from the todo collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits the number of uncompleted items
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

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})