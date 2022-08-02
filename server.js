const express = require('express') //loads the express modules allowing for our app to use express
const app = express() // puts the express functions into a variable which can be used later
const MongoClient = require('mongodb').MongoClient // loads the mongobd functions 
const PORT = 2121 //initial port to run the app on 
require('dotenv').config() //allows the app to use the data from the .env file so that the sensitive data can stay hiddden


let db, //creates a db variable
    dbConnectionStr = process.env.DB_STRING, //assigns the dbConnectionString variable the value from the DB_String in the env file
    dbName = 'todo' //variable for the name of the database to pull the data from 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //this is how we send data and connect to the mongo database
    .then(client => { // after the client has connected to the database, these things should happen
        console.log(`Connected to ${dbName} Database`) //this lets the user know that there was a successful connection to the database
        db = client.db(dbName) //assigns variable db to the 
    })
    
app.set('view engine', 'ejs') //middleware to allow our app to use view and ejs
app.use(express.static('public')) //express will use the public folder in order to serve up the main js file and css files
app.use(express.urlencoded({ extended: true })) //not sure 
app.use(express.json()) //parses data into json


app.get('/',async (request, response)=>{ //root endpoint for the app. async function
    const todoItems = await db.collection('todos').find().toArray() // finds all of the to do list items inf the database 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // counts the documents that have been marked not completed 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //returns the todo items as well as the items left 
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