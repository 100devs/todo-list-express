//Modules
const express = require('express') //Makes it possible to use express in this file
const app = express(); //Sets a constant and assigning it to the instance of express
const MongoClient = require('mongodb').MongoClient; //Makes it possible to use methods associated with MongoClient and talk to our DB
const PORT = 2121 //Sets a constant to determine the location where our server will listen
require('dotenv').config() //Allows you to look for variables inside the .env file


let db, //Declares a variable called db
    dbConnectionStr = process.env.DB_STRING, //Declares a variable called dbConnectionsStr and assigning our database connection string to it
    dbName = 'todo' ////Declares a variable and assigning the name of the database to "todo"

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Creates a connection to MongoDB and passing in a connection string. Also passing in an additional property
    .then(client => { //Waits for connection and proceeds if successful, and passing in all client information
        console.log(`Connected to ${dbName} Database`) //Logs to the console and template literal "connected to the todo database"
        db = client.db(dbName) //Assigns a value to previouesly declared variable that contains a db client factory method
    }) //Closes our .then

//MIDDLEWARE    
app.set('view engine', 'ejs') //Sets ejs as the default render method
app.use(express.static('public')) //Sets the location for static assets
app.use(express.urlencoded({ extended: true })) //Tells express to decode and encode URLs where the header matches the content. Supports arrays and objects.
app.use(express.json()) //Parses JSON content

//ROUTES
app.get('/',async (request, response)=>{ //Starts a GET method when the root route is passed in, sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray() //Sets a variable and awaits ALL items from the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Sets a variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Renders the EJS file and passes through the db items and the count remaining inside of an object
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true //Add status of "completed" equal to "true" to item in our collection
          }
    },{
        sort: {_id: -1}, //Once a thing has been marked as completed, this removes it from the to-do list
        upsert: false //Doesn't create a document for the todo if the item isn't found
    })
    .then(result => {
        //Assuming that everything went okay and we got a result...
        console.log('Marked Complete') //console logged "Marked Complete"
        response.json('Marked Complete') //Returns response of "Marked Complete"
    })
    .catch(error => console.error(error)) //If something broke, an error is logged to the console

})

app.put('/markUnComplete', (request, response) => { //This route unclicks a thing that you've marked as complete - will take away complete status
    db.collection('todos')//Go into todos collection
    .updateOne({thing: request.body.itemFromJS}, //Look for item from itemFromJS
        {
        $set: {
            completed: false //Undoes what we did with markComplete - changes "completed" status to "false"
          }
    },{
        sort: {_id: -1}, //Once a thing has been marked as completed, this removes it from the to-do list
        upsert: false
    })
    .then(result => {
        //Assuming that everything went okay and we got a result...
        console.log('Marked Complete') //Console logged "Marked Complete"
        response.json('Marked Complete') //Returns response of "Marked Complete" to the fetch im main.js
    })
    .catch(error => console.error(error)) //If something broke, an error is logged to the console

})

app.delete('/deleteItem', (request, response) => {
    //DELETE
    db.collection('todos') //Goes into your collection
    .deleteOne({thing: request.body.itemFromJS}) //Uses deleteOne method and find a thing that matches the name of the thing you click on
    .then(result => { //Assuming everything went okay...
        console.log('Todo Deleted') //Console logged "Todo Deleted"
        response.json('Todo Deleted') //Returns response of "Todo Deleted" to the fetch in main.js
    })
    .catch(error => console.error(error)) //If something broke, an error is logged to the console

})

app.listen(process.env.PORT || PORT, ()=>{
    //Tells our server to listen for connections on the PORT we defined as a constant earlier OR process.env.PORT will tell the server to listen on the port of the app
    console.log(`Server running on port ${PORT}`) //Console log the port number or server is running on
})