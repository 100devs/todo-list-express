const express = require('express')//making express usable in this file
const app = express()//setting variable to an instance of express
const MongoClient = require('mongodb').MongoClient//makes it possible to use methods with asssociated with MongoClient and talk to our DB
const PORT = 2121//setting a constant to determine where our server will be listening
require('dotenv').config()//allows us to look for variables inside of the .env file


let db,//declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING,//declare a variable and assigning our database connection string to it
    dbName = 'todo'//declaring a variable and assigning the name of the database we be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to mongodb, passing in our connection. Passing in additional property 
    .then(client => {//awaiting connection and proceeding if successful, and passsing in all client information if successful
        console.log(`Connected to ${dbName} Database`)//log to console template literal connected to toDo database
        db = client.db(dbName)//assigning a value to previously declared db variable that contains a db client factory method
    })//closing our .then
    //middleware
app.set('view engine', 'ejs')//sets ejs as default render method
app.use(express.static('public'))//sets the location for static assets
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode URL where the header matches the content. supports arrays and objects
app.use(express.json())//parses JSON content from incoming requests


app.get('/',async (request, response)=>{//starts a GET when root route is passed in, sets up req and res parameters  
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of uncompleted items to later display in EJS 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering the EJS files and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))//console.log error handling
})

app.post('/addTodo', (request, response) => {//starts a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new item into todos collection,   gives it a completed value of false by default
    .then(result => {//if insertt is successful, do something
        console.log('Todo Added')//console log action
        response.redirect('/')//gets rid of the /addToDo route, and redirects back to the homepage
    })//closing the .then
    .catch(error => console.error(error))//catching errors
})//ending the POST

app.put('/markComplete', (request, response) => {//starts a PUT method when the markCOmplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the database for one item matching the name of the item passed in from the main.js file that was clicked on 
        $set: {
            completed: true//set completed status to true
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a them if update was successful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//error handling with a .catch

})//ending point

app.put('/markUnComplete', (request, response) => {//starts a PUT method when the markUncomplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the database for one item matching the name of the item passed in from the main.js file that was clicked on 
        $set: {
            completed: false//prevents insertion if item does not already exist
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if update was successful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//error handling with a .catch

})

app.delete('/deleteItem', (request, response) => {//starts a delete method when delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => {//starts a then if delete was succesful
        console.log('Todo Deleted')//logging successful completion
        response.json('Todo Deleted')//sending a response back to the sender
    })
    .catch(error => console.error(error))//error handling with a .catch

})

app.listen(process.env.PORT || PORT, ()=>{//setting up which port we will be listening on - either the port from .env file or the port
    console.log(`Server running on port ${PORT}`)//console.log the running port
})//end the listen method