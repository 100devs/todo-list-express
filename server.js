const express = require('express') //Making it possible to use express in this file.
const app = express() // setting a variable and assigning it to the instance of express.
const MongoClient = require('mongodb').MongoClient //Makes it possible to use methods associated with MongoClient and talk to our DB.
const PORT = 5000 // setting a constant to the port number where server will be listening.
require('dotenv').config(); // Allows us to look for variables inside of the .env file.



let db,//Declare a varible called db but do not assign a value.
    dbConnectionStr = process.env.DB_STRING, //declaring a variable and assigning our database connection string to it.
    dbName = 'todo' //declaring a variable and assigning the name of the database we will be using.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//Creating a connection to Mongo DB, and passing our connection string.
//Also passing in an additional property.
    .then(client => { //Waiting on connection and proceeding if sucuessful, and passing in all the client information.
        console.log(`Connected to ${dbName} Database`) //Log to the console template literal "connected to todo Database".
        db = client.db(dbName) //Assigning a value to previusly declared db variable that contains a db client factory method.
    })//Closing our .then
   
    


//MiddleWare
app.set('view engine', 'ejs') //Sets ejs as the default render method.
app.use(express.static('public')) //Sets the location for static assets.
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLS where the header matches the content. Supports arrays and objects
app.use(express.json()) //Parses JSON content from incoming requests.


app.get('/',async (request, response)=>{ // Starts a GET Method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //sets a variable awaits ALL items from the todos collection.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Sets a variable and awaits a count of uncompleted items to later display in EJS.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Rendering EJS file and passing through the db items and the count remaining inside of an object.

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
   // .catch(error => console.error(error)) //Catch error.
})

app.post('/addTodo', (request, response) => { //Starts a POST mehtod when the addTodo route is passed.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //Inserts a new item ino todos collection,gives it a completed value of false by default.
    .then(result => { //if insert is successful, do something.
        console.log('Todo Added') //Log action.
        response.redirect('/') //Gets rid of the /addTodo route, and redirects back to the homepage.
    })//Closing the then
    .catch(error => console.error(error)) //Catching errors.
}) //Ending the POST

app.put('/markComplete', (request, response) => { //Start a PUT method when the markComplete route is passed in.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//Look in the db for one item matching the name of the item passed in from main.js that was clicked on.
        $set: {
            completed: true// set completed status to true.
          }
    },{
        sort: {_id: -1}, // moves item to the bottom of the list.
        upsert: false //Prevents insertion if item does not already exist.
    })
    .then(result => { // Starts a then if update was successful.
        console.log('Marked Complete') //Logging successful completion.
        response.json('Marked Complete') //Sending a response back to the sender.
    }) //Closing .then
    .catch(error => console.error(error)) //Catching errors.

})

app.put('/markUnComplete', (request, response) => { //Start a PUT method when the markUnComplete route is passed in.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Look in the db for one item matching the name of the item passed in from main.js that was clicked on.
        $set: {
            completed: false //Sets completed status to false.
          }
    },{
        sort: {_id: -1}, //Moves item to the bottom of the list.
        upsert: false //Prevents insertion if item does not already exist.
    })
    .then(result => { //Starts a then if update was successful.
        console.log('Marked Complete') //Logging successful completion.
        response.json('Marked Complete') //Sending a response back to sender
    })
    .catch(error => console.error(error)) //Catching errors.

}) //End put

app.delete('/deleteItem', (request, response) => { //Start a DELETE method when the markUnComplete route is passed in.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //Look inside todods collection for the ONE item that has a matching name from our JS file.
    .then(result => { //Start a then if delete was successful.
        console.log('Todo Deleted') //Logging successful completion.
        response.json('Todo Deleted') //Sending a response back to the sender.
    })
    .catch(error => console.error(error)) //Catching errors.

}) //Ending delete

app.listen(process.env.PORT || PORT, ()=>{ //Setting up which port we will be listening on. ENV file or PORT set.
    console.log(`Server running on port ${PORT}`) //Logging the port number.
})//End the listen method.