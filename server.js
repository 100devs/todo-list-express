const express = require('express') // mkaing it possible to use express in this file
const app = express() // assigning instance of express to app
const MongoClient = require('mongodb').MongoClient //makes it possible to use mehods associated with MongoClient and talk to our DB
const PORT = 2121 // set constant location where server is listening
require('dotenv').config() // allows us to look for variables inside of the .env file


let db, //declare var globally 
    dbConnectionStr = process.env.DB_STRING, // declare var and assign to database connection string
    dbName = 'todo' //declaring var and assigning name of database we will be using

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // creating connection to mongodb and passing out connection string, also passing an additional property
    .then(client => { // waiting for connection and proceeding if successful, passing in all client info
        console.log(`Connected to ${dbName} Database`) //log conneciton message
        db = client.db(dbName) // assigning value to previosuly declared db var that contains db client factory method
    }) // closing our then
    
//middleware
app.set('view engine', 'ejs') //sets ejs as the default render
app.use(express.static('public')) //sets loc for static assets
app.use(express.urlencoded({ extended: true })) //tells express to de/encode URLS where the header matches the conent. Supports arrays and objects
app.use(express.json()) //Parses JSON conent from incoming requests


app.get('/',async (request, response)=>{ //starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits all iotems from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering the EJS file and passing through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) // close

app.post('/addTodo', (request, response) => { // starts a POST method when the add route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts a new item into todos collection, gives it a completed value of false by default
    .then(result => { // if insert is successful, do something
        console.log('Todo Added') //console log action
        response.redirect('/') // gets rid of/addTodo route and redirects back to the homepage
    }) //closing the .then
    .catch(error => console.error(error)) //catching errors
}) //ending the POST

app.put('/markComplete', (request, response) => { //starts a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js that was clicked on
        $set: { 
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion if the item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //log sucessful completion
        response.json('Marked Complete') //send response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catch errors

})//ending put

app.put('/markUnComplete', (request, response) => { //start put method when the markUncomplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // look in the db for one item matching the name of the item passed in from the main.js that was clicked on
        $set: {
            completed: false//set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false//prevents insertion if the item does not already exist
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //log sucessful completion
        response.json('Marked Complete')//send response back to the sender
    }) //closing .then
    .catch(error => console.error(error)) //catch errors

})// ending put

app.delete('/deleteItem', (request, response) => { //starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //llok inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => { //start then iof delete was successful
        console.log('Todo Deleted') //logging successful completion
        response.json('Todo Deleted') //send response back to sender
    }) //close then
    .catch(error => console.error(error)) // catch erros

}) //ending delete

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we will be listening on -either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`) // log running port
}) // ending listen