const express = require('express')//making it to use Express in this file
const app = express()//declaring the constant app to equal to express
const MongoClient = require('mongodb').MongoClient//makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //setting a const to determine the port of the location where our server will be listening
require('dotenv').config()//allows us to look for variables inside of the .env file

let db,//declare a variable called db but not assign it a value 
    dbConnectionStr = process.env.DB_STRING,//declaring a variable and assigning our database connection string to it
    dbName = 'todo'//declaring a variable and assigning the name of the DB we will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB, and passing in our connection string. Also passing in an additional property
    .then(client => {//waiting for the connection, proceeding if successful, and passing in all the client information
        console.log(`Connected to ${dbName} Database`)//log to the console a template literal "connected to the TODO DV"
        db = client.db(dbName)//assigning a value previously declared db variable that contaisn a db client factory method
    })//closing our then
//middleware
app.set('view engine', 'ejs')//sets as the default render method
app.use(express.static('public'))//sets the location for static assets
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode URLs where the header matches the content.  supports arrays and objects
app.use(express.json())//parses JSON content 


app.get('/',async (request, response)=>{//starts a GET method when the root route is passed, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits all items from the TODOS collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of uncompleted items to later display in ejs
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

app.post('/addTodo', (request, response) => {//starts a post method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//insert a new item into todos collection, gives it a completed value of false by default 
    .then(result => {//if insert is successful, do something
        console.log('Todo Added')//console log action
        response.redirect('/')//gets rid of the /addTodo route, and redirects back to the homepage 
    })//closing the .then
    .catch(error => console.error(error))//catching errors
})//ending the POST 

app.put('/markComplete', (request, response) => {//starts a PUT method when the markComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the database for one thing matching the name of the item passed in from the main.js file that was clicked on 
        $set: {//
            completed: true//set completed status to true 
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => { //starts a then if update was successful 
        console.log('Marked Complete')// console log the text 
        response.json('Marked Complete')// sending a response back to the sender
    })//closing then
    .catch(error => console.error(error)) //catching errors

})//ending put

app.put('/markUnComplete', (request, response) => {//starts a PUT method when the markComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the database for one thing matching the name of the item passed in from the main.js file that was clicked on 
        $set: {
            completed: false//set completed status to false
          }
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => {//starts a then if update was successful 
        console.log('Marked Complete')// console log the text 
        response.json('Marked Complete')// sending a response back to the sender
    })//closing then
    .catch(error => console.error(error))//catching errors

})//ending put

app.delete('/deleteItem', (request, response) => {//starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})// look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => {//starts a then if update was successful 
        console.log('Todo Deleted')// console log the text 
        response.json('Todo Deleted')// sending a response back to the sender
    })//closing then
    .catch(error => console.error(error))//catching errors

})//ending delete

app.listen(process.env.PORT || PORT, ()=>{// setting up which port we will be listening on - either the port from the .env 
    console.log(`Server running on port ${PORT}`)//console log the running port
})//closing listen

