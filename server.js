const express = require('express')//make it possible to use express 
const app = express()//create a variable and assign it to the instance of express
const MongoClient = require('mongodb').MongoClient//makes it possible to use methods associated with MongoClient and talk to the DB
const PORT = 2121//setting a constant to define where our server is listening
require('dotenv').config()//allows us to look for variables inside of the .env file


let db,//declaring a variable
    dbConnectionStr = process.env.DB_STRING,//declaring a variable and assigning our DB string to it
    dbName = 'todo'//declaring a variable and assigning the name of the db we'll be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to mongodb and passing in the connection string and passing in an additional property
    .then(client => {//waiting for the connection and proceeding if successful
        console.log(`Connected to ${dbName} Database`)//log a template literal to a console
        db = client.db(dbName)//assigning a value to a previously declared variable that contains a db client factory method
    })//closing the .then
 
//middleware
app.set('view engine', 'ejs')//how to expect pages to be rendered
app.use(express.static('public'))//sets the location for static assets
app.use(express.urlencoded({ extended: true }))//tells express to encode and decode urls when the header matches the content, arrays and objects
app.use(express.json())//parses json content from incoming requests


app.get('/',async (request, response)=>{//sets a GET mehod when the root route is passed in, gives req and resp parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of uncomplete items to later display in the js
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the EJS file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//starts a POST method when the add route is passed through
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => {//if insert is successful, do something
        console.log('Todo Added')//console log action
        response.redirect('/')//gets rid of the addToDo route and goes back to the home page
    })//closing 
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {//start a put method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for one tiem matchign the name of the item passed in the main.js file that was licked on
        $set: {
            completed: true//set completed status to true
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starting a then if update was successful
        console.log('Marked Complete')//log successful completion
        response.json('Marked Complete')//sending a response back to the sender
    })//closing .them
    .catch(error => console.error(error))//catching errors

})

app.put('/markUnComplete', (request, response) => {//starts a put method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the db for the item that matches based on what was clicked on
        $set: {
            completed: false//set completed status to false
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if the item does not already exist
    })
    .then(result => {//sarts a then if the update was successful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//sending a response back to the sender
    })//closing then
    .catch(error => console.error(error))//catching errors

})

app.delete('/deleteItem', (request, response) => {//starts a delete method when the deleteIteme route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look in the db for the item that matches based on what was clicked on
    .then(result => {//starts a then if the delete was sucessful
        console.log('Todo Deleted')//logging successful completion
        response.json('Todo Deleted')//sending a response back to the sender
    })
    .catch(error => console.error(error))//catching errors

})

app.listen(process.env.PORT || PORT, ()=>{//setting up which port to be listening on - either from .env or port variable
    console.log(`Server running on port ${PORT}`)//console log the running port
})//end the listen method