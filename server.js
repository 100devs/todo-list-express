const express = require('express') //making it possible to use express in this file
const app = express() //setting a variable and assiging it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it possible to use methods associated with Mongo Client and talk yo DB
const PORT = 2121 //setting a constant to define the location where our werver will be listening
require('dotenv').config() //allows us to look for variables inside of the .env file


let db, //declare a variable called db but not assigning a value (being declared globally)
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB, and passing in our connecting string, also passing in an additional property
    .then(client => { //waiting for the connection and proceeding if successful and passing in all the client information
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal "connected to todo database"
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method
    }) // closing .then
    
//middleware - allows communication between client and database    
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode urls where the header matches the content, supports arrays and objects
app.use(express.json()) //parses json content from incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the root is passed in, sets up req and red peramaters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits all items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets variable and awaits a count of uncompleted items to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the ejs file and passing through the bd items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) //

app.post('/addTodo', (request, response) => { //
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //
    .then(result => { //
        console.log('Todo Added') //
        response.redirect('/') //
    }) //
    .catch(error => console.error(error)) //
}) //

app.put('/markComplete', (request, response) => { //
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //
        $set: { //
            completed: true //
          } //
    },{ //
        sort: {_id: -1}, //
        upsert: false //
    }) //
    .then(result => { //
        console.log('Marked Complete') //
        response.json('Marked Complete') //
    }) //
    .catch(error => console.error(error)) //

}) //

app.put('/markUnComplete', (request, response) => { //
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //
        $set: { //
            completed: false //
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