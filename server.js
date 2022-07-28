//required variables listed below. express, mogodb, port#, dotenv.
//if required variables not declared, it wont' work.

const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//Declare mongDB connections variables that will be needed later
let db,
    dbConnectionStr = process.env.DB_STRING, //process.env.db_string allows the use of the connection string hidden in the .env file
    dbName = 'todo' //name of db in mongo

//connect to the mongoDB collection
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) 
    .then(client => {
        console.log(`Connected to ${dbName} Database`) //shows our connection to MongoDB in the terminal
        db = client.db(dbName) //this is how mongodb stores the defined collection in a varable.
    })
    
//Middleware
app.set('view engine', 'ejs') //defines what is being used to render client side page
app.use(express.static('public')) //tells our app to use public folder for all static files
app.use(express.urlencoded({ extended: true })) //parses incoming request w/ urlencoded payloads
app.use(express.json()) //turns objects into json.


app.get('/',async (request, response)=>{ //async function to read/show info on the page.
    const todoItems = await db.collection('todos').find().toArray() //const var to define docs as an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //cont var to show docs created
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //renders docs in ejs
    //Does the same without async/await
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

 //creation of new ToDo item for db 
app.post('/addTodo', (request, response) => {// page route and request for new info
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//.insertOne gets ToDoItem from ejs input name
    .then(result => { //after item is inserted
        console.log('Todo Added')  //log item to console
        response.redirect('/') //after response, refresh the page.
    })
    .catch(error => console.error(error)) //catches the error and logs it to the console.
})
//The HTTP PUT handler for the '/markComplete' route.
app.put('/markComplete', (request, response) => { //updates task as complete
   
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //goes into collection named 'todos" & find item clicked as completed
        $set: {
            completed: true  //sets as true if completed
          }
    },{
        sort: {_id: -1}, //sort items in descending order
        upsert: false //if item not found completed, a new doc is not created
    })
    .then(result => { //after successful completion of update
        console.log('Marked Complete')  //shows in console as complete.
        response.json('Marked Complete') //sends response to main.js
    })
    .catch(error => console.error(error))  //if an error, log error

})

app.put('/markInComplete', (request, response) => { //Updates task as incomplete. I changed from markUnComplete to markIncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false //sets as false if incomplete
          }
    },{
        sort: {_id: -1}, //sort in descending order
        upsert: false 
    })
    .then(result => { //if update successful
        console.log('Marked Complete') //logs to console, but should this read 'Marked InComplete'?
        response.json('Marked Complete') //sends response to main.js, but should this read 'Marked InComplete'?
    })
    .catch(error => console.error(error))  //if error, log the error to console.

}) //ending put

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //go to db collection to find item to delete
    .then(result => { //starts a then if delete was successful
        console.log('Todo Deleted') //log successful deletion to console
        response.json('Todo Deleted') //response back to sender.
    })
    .catch(error => console.error(error)) //if error, catch and log it to console.

})

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will listen on. .env file or the port.
    console.log(`Server is running on port ${PORT}`) //confirm server is running and log port # to console. 
}) //end the listen