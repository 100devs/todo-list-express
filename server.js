const express = require('express')//declaring a constant variable named express making it possible to use express in this file
const app = express()//constant variable that lets us call express 
const MongoClient = require('mongodb').MongoClient//makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121//setting up port constant variable with 2121 as value so our server can listen to this port
require('dotenv').config()//allows us to look for variables inside of the .env file


let db,//decalring variable called db with no assignment on this line
    dbConnectionStr = process.env.DB_STRING,//also declaring dbConnectionStr to hold the DB_STRING connection string from our .env file
    dbName = 'todo'//declaring a variable and assigning the name of the database we will be using. This is the name of our cluster that holds the collections of documents

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//connectiong MongoClient to our data base using our connection string. Also passing in an additional property called useUnifiedTopology set to true
    .then(client => {//MongoClient.connect is a promise so anything after .then helps us know the connection has been made. Waiting for the connection and proceeding if successful and passing in all the client information
        console.log(`Connected to ${dbName} Database`)//logging template literal to the console that tells us we're connected to the todo database
        db = client.db(dbName)// assigning db variable value of the client.db factory method and passing dbName into the function.
    })//closing our .then

//middleware that does the communication for us
app.set('view engine', 'ejs')//using express to set the view engine to ejs as default render
app.use(express.static('public'))//tells express to find our static assets like CSS and main.js in our public folder
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode URLs where the heade matches the content. Supports arrays and objects
app.use(express.json())//tells express to use json format. Tells express to parse json so we don't have to use body parser from incoming requests


app.get('/',async (request, response)=>{//async function inside a read request (GET method) with a route of our home page and with request and response parameters passed in
    const todoItems = await db.collection('todos').find().toArray()//sets a constant variable todoItems that awaits all arrays from our todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a constant variable itemsLeft that awaits a number of documents with a property of completed: false
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering index.ejs and passing todoItems and itemsLeft
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//POST method to create a todo item when the addTodo rout is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts new item into todos collection from the input box with class of todoItem and insert one (this item) into the db with a completed value of false
    .then(result => {//if insert is successful, do something
        console.log('Todo Added')//console log string
        response.redirect('/')//refresh the page to show the new item added to the DOM to the user. redirect takes you back home. It gets rid of the /addTodo route and redirects to the home page
    })//close the .then
    .catch(error => console.error(error))//catch errors
})//end POST

app.put('/markComplete', (request, response) => {//PUT method to update when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//go to the db collection todos and update one thing that matches the value of thing passed in from the main.js file that was clicked on
        $set: {//setting a value in the document
            completed: true//setting the completed property to true
          }//closing set
    },{
        sort: {_id: -1},//moves item to the bottom of the list
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//start .then if update was successful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//responding with json that was requested from main.js so we can see it in the console
    })//closing .then
    .catch(error => console.error(error))//catch error

})//ending put

app.put('/markUnComplete', (request, response) => {//PUT method to update when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//go to the db collection todos and update one thing that matches the value of thing passed in from the main.js file that was clicked on
        $set: {//setting a value in the document
            completed: false//setting the completed property to false
          }
    },{
        sort: {_id: -1},
        upsert: false//prevents insertion if item does not already exist
    })
    .then(result => {//start .then if update was successful
        console.log('Marked UnComplete')//logging successful completion
        response.json('Marked UnComplete')//responding with json that was requested from main.js so we can see it in the console
    })//closing .then
    .catch(error => console.error(error))//catch error

})//ending put

app.delete('/deleteItem', (request, response) => {//starts a DELETE method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//go to the db collection todos and delete one thing that matches the value of thing passed in from the main.js file that was clicked on
    .then(result => {//start .then if delete was successful
        console.log('Todo Deleted')//logging successful completion
        response.json('Todo Deleted')//responding with json that was requested from main.js so we can see it in the console
    })//closing .then
    .catch(error => console.error(error))//catch error

})//ending delete

app.listen(process.env.PORT || PORT, ()=>{//setting up which port we will be listening, either one in our .env file, or the PORT declared at the top of this server.js
    console.log(`Server running on port ${PORT}`)//console.log the running port.
})//close listen