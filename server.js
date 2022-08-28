const express = require('express') //Making it possible to use express methods in this file
const app = express() //Make it possible to call express using the variable app
const MongoClient = require('mongodb').MongoClient // Makin it possible to use methods associated with MongoClient and talk to our Database
const PORT = 2121 //Setting a const to define the location where our server will be listening
require('dotenv').config() // Allows us to look for variables inside the .env file


let db, //declare a variable called db but not assign a value
    dbConnectionStr = process.env.DB_STRING, //declare a variable and assigning out DN connection string (stored in .env) to it
    dbName = 'todo' // declaring a variable and assigning the name of the database we will be using.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Connect to our DB by passing in our connection string, also passing in an additional (somewhat unknown) property
    .then(client => { //waiting fo the connect and proceeding if successful, and passing in the client information
        console.log(`Connected to ${dbName} Database`) // console log that we have connected to 'todo' when successful
        db = client.db(dbName) //assigning a value to db that we declared before. Assign it the name of the DB we have gained access to
    }) //Close the .then

//Middleware
app.set('view engine', 'ejs') //Sets ejs as the default render method
app.use(express.static('public')) // Sets the location for static assets
app.use(express.urlencoded({ extended: true })) // Tells express to decode the encode URLs where the header matches the content. SUppoers arrays and objects (Not sure about this)
app.use(express.json()) // Parses JSON content


app.get('/',async (request, response)=>{ // starts a get method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //Sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Sets a variable and awaits count of items uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Give the response in the form of rendering the index.ejs page, passing in the two variables we just found (inside of an object)
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //Inserts a new item into todos collection, taking the data from the form we filled out and setting completed to false
    .then(result => { //After the insertOne is successful, do the following
        console.log('Todo Added') //console log the action
        response.redirect('/') //Reload to page to show the newly added item
    }) // Close the then
    .catch(error => console.error(error)) //catch errors and console log them
}) //close post

app.put('/markComplete', (request, response) => { //Start PUT method when markComplete is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Look into todos collection for a 'thing' with the name that matches the thing's name that was clicked on
        $set: {
            completed: true //set the completed status of the thing to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { // after the changes have been made
        console.log('Marked Complete') //console log marked complete
        response.json('Marked Complete')//send a response back to the sender (server)
    })
    .catch(error => console.error(error)) //If errors, console log them

}) //Ending PUT

app.put('/markUnComplete', (request, response) => { //Start PUT method when markComplete is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Look into todos collection for a 'thing' with the name that matches the thing's name that was clicked on
        $set: {
            completed: false //set the completed status of the thing to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if item does not already exist
    })
    .then(result => { // after the changes have been made
        console.log('Marked Complete') //console log marked complete
        response.json('Marked Complete')//send a response back to the sender (server)
    })
    .catch(error => console.error(error)) //If errors, console log them

}) //Ending PUT

app.delete('/deleteItem', (request, response) => { //Starts a delete method whe the deleteItem route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //Find a thing with the same name from our JS file in the todos collection and delete it
    .then(result => { //If delete was successful
        console.log('Todo Deleted') //console log success
        response.json('Todo Deleted') //send a response back to sender
    })//close then
    .catch(error => console.error(error)) //if errors, console log them

}) //close delete

app.listen(process.env.PORT || PORT, ()=>{ //Setting up which port we will be listening on - either the port from the.env file or the port we set
    console.log(`Server running on port ${PORT}`) //console log the runnning port
}) //end the listen method