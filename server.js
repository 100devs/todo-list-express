const express = require('express')
// use express in this file
const app = express()
//setting a variable and assigning it to express
const MongoClient = require('mongodb').MongoClient
//use methods associated with MongoClient and talk to our DB
const PORT = 2121
require('dotenv').config()
// allows us to look for variables inside of the .env file


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//declaring a variable and assigning our database connection string to it

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //create a connection to mongodb and passing in our connection string.
    .then(client => { //waiting for the connection and proceeeding if successful and passing in all the client information
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
        // assigning a value to previously declared db variable that contains a db client factory method
    })
    
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode urls where the header matches the content. Supports arrays and objects
app.use(express.json())// parses JSON content from incoming requests


app.get('/',async (request, response)=>{//starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })// render EJS file and passing through the db items and the count remaining inside of an object

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
    // starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') // gets rid of the /addTodo route, and redirects back to the homepage
    })
    .catch(error => console.error(error)) // catches error
})

app.put('/markComplete', (request, response) => {
    //starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one item matching the name of the item passed in
        $set: {
            completed: true // set completed status to true
          }
    },{
        sort: {_id: -1}, //sorts item in desceding order
        upsert: false //prevents insertion if item does not exist
    })
    .then(result => {
        console.log('Marked Complete')
        //logging successful completion
        response.json('Marked Complete')
        //sending a response back to the sender
    })
    .catch(error => console.error(error)) //catch errors

})

app.put('/markUnComplete', (request, response) => { 
    // starts a PUT method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS}, //look in the db for one item matching the name // 
    {
        $set: {
            completed: false // changes completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') //starts a then if update was successful
        response.json('Marked Complete')//sending a response back to the sender
    })
    .catch(error => console.error(error))
//catch errors
})

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})// look inside the todos collection for the one item that has a matching name
    .then(result => {
        console.log('Todo Deleted')//logging successful completion
        response.json('Todo Deleted')//sending a response back to the sender
    })
    .catch(error => console.error(error))
//catch errors
})

//controls the enviornment and allows it to host
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})