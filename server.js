//setup express
const express = require('express')
const app = express()

//set up MONGODB Client methods
const MongoClient = require('mongodb').MongoClient

//setup PORT
const PORT = 2121

//set up dotenv -- its a dependency that load environment variables from an .env file into a process.env so that you can hide away your sensitive variables 
require('dotenv').config()

//setup variables for your MONGO connection string and the database name
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to the MONGO DB client 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//setup ejs amd the public folder. The public folder contains all static content so that you can reference it easily
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//READ: 
//todoItems --> find all the list items on the database put it in an array
//itemsLeft --> counts the documents for which completed equals false
//response.render --> template the data called 'items' and 'left' using the data from the above 2 variables
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
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

//CREATE
//insert one document into MONGO DB taken from the data of the /addTodo form. Takes the todo value from the form and puts it into the 'thing' variable. Also adds a completed value of false
//redirects the page back to the main page when the value has been added to MONGO DB
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//UPDATE
//updates the todo item based on a clickevent on the main page. This triggers a function that sends 'itemFromJS' to the database.  Based on this, the database knows which item to update to completed.
//sort -1 will sort it backwards. 
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

//UPDATE
//same as above but instead of marking something as complete, we are marking as incomplete. Same logic as above
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

//DELETE
//Deletes an item when a click event is triggered which triggers the deleteItem() function. This function will send the item in question to this express function so that the database knows which todo item to delete. We use the deleteOne method to delete the function. 
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