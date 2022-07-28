const express = require('express') //making it possible to use express in this file
const app = express() //setting a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient //makes it posible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //setting a constant to define the location where our server will be listening
require('dotenv').config() //allows us to look for variales insides of the .env file


let db, //declaring a variable (globally)  called db but not assign a value 
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it
    dbName = 'todo' //declaring a variable and assigning the name of the database will be using 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to MongoDB and passing in our connection string. Also passing in an additional property
    .then(client => { //waiting for the connection adn proceeding if successful and passing in all the client information.
        console.log(`Connected to ${dbName} Database`) //log to the console a template literal "connected to todo Database"
        db = client.db(dbName) //assigning a value to previously declared db variable that contains a db client factory method (contains lots of stuff)
    }) //closing out then

//middleware-helps open the communication
app.set('view engine', 'ejs') //sets ejs as the default render method
app.use(express.static('public')) //sets the location for static files
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLs where the header mataches teh content. Supports arrays and objects
app.use(express.json()) //Parses JSON content fromincoming requests


app.get('/',async (request, response)=>{ // starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //sets a variable and awaits a count of uncompleted items to later display in EJS.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //rendering EJS files and passing through the db items and the count remaining insode of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})//end of the function

app.post('/addTodo', (request, response) => { //starts a POST method when the addTodo route is passed in
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //Inserts a new item into todos collection, gives it a completed vaule of false by default
    .then(result => { //if inserts is successful, do something
        console.log('Todo Added') //console log actions
        response.redirect('/') //gets rid of the addTodo route and redirects back to the homepage
    }) //closing the .then
    .catch(error => console.error(error)) //if an error occurs, pass the error into the catch block and log the error to the console
})//ending the POST

app.put('/markComplete', (request, response) => { //starts a PUT (read) method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on 
        $set: {
            completed: true //set completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //preverts insertion if items does not alreaedy exists
    })
    .then(result => { //starts a then if update was successful
        console.log('Marked Complete') //logging successful completion
        response.json('Marked Complete') //sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//catching errors

})//ending the PUT

app.put('/markUnComplete', (request, response) => {//starts a PUT (read) method when the markUnComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look in the db for one item matching the name of the item passed in from the main.js file that was clicked on 
        $set: {
            completed: false //set completed status to false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false//preverts insertion if items does not alreaedy exists
    })
    .then(result => {//starts a then if update was successful
        console.log('Marked Complete')//logging successful completion
        response.json('Marked Complete')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//catching errors

})//ending the PUT

app.delete('/deleteItem', (request, response) => { //starts a DELETE method when the deleteItem route is passed in
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the ONE item that has a matching name from our JS file
    .then(result => {//starts a then if update was successful
        console.log('Todo Deleted')//logging successful completion
        response.json('Todo Deleted')//sending a response back to the sender
    })//closing .then
    .catch(error => console.error(error))//if an error occurs, pass the error into the catch block and log the error to the console

})//ending the DELETE

app.listen(process.env.PORT || PORT, ()=>{ //setting whcih port we will be listening on- either the port from the .env file or the port variable we set
    console.log(`Server running on port ${PORT}`)  //console logging the running port 
})//end of the listen