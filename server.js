const express = require('express') //allows to use express in this file
const app = express() //assigns app to the instance of express
const MongoClient = require('mongodb').MongoClient //allows to use methods associated with MongoClient and talk to DB
const PORT = 2121 //sets location where server will listen
require('dotenv').config() //allows to look for variables in .env file


let db, //declares a variable named db 
    dbConnectionStr = process.env.DB_STRING, //assigns database connection string to dbConnectionStr
    dbName = 'todo' //assigns name of the database we'll use as 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creates connection to MongoDB, passes in our connection string, passes in an additional property
    .then(client => { //waits for the connection and proceeds if successful, passes in all client info
        console.log(`Connected to ${dbName} Database`) //logs "Connected to todo Database"
        db = client.db(dbName) //assigns a value to previously declared db variable that contains a db client factory method
    })
    
//this is all middleware
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode urls where the header matches the content, supports arrays and objects
app.use(express.json()) //parses JSON content from incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and res params
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits all items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments ({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders ejs file and passes through the db items and the count remaining, inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts a post method when add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts new item into todos collection, gives it a completed value of false by default
    .then(result => { //if insert is successful, then do this something
        console.log('Todo Added') //console log action
        response.redirect('/') //gets rid of /addTodo route, redirects back to the homepage
    })
    .catch(error => console.error(error)) //catches any errors
})

app.put('/markComplete', (request, response) => { //starts put method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //looks in db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: true //sets completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item doesn't already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logs successful completion
        response.json('Marked Complete') //sends response back to the sender
    })
    .catch(error => console.error(error)) //catches errors

})

app.put('/markUnComplete', (request, response) => { //starts put method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in db for one item matching the name of the item passed in from the main.js file that was clicked on
        $set: {
            completed: false //sets completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to bottom of list
        upsert: false //prevents insertion if item doesn't already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logs successful completion
        response.json('Marked Complete') //sends a response back to the sender
    })
    .catch(error => console.error(error)) //catches errors

})

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //looks inside todos collection for the one item that has a matching name from js file
    .then(result => { //starts a then if delete was successful
        console.log('Todo Deleted') //logs successful completion
        response.json('Todo Deleted') //sends response back to the sender
    })
    .catch(error => console.error(error)) //catches errors

})

app.listen(process.env.PORT || PORT, ()=>{ //sets port we will be listening on, either the port from .env file or the port vairable we set
    console.log(`Server running on port ${PORT}`) //logs this given message so we know the port is running
})