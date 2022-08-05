// Group Project
const express = require('express') // Making it possible to use express in this file.
const app = express() // Setting a constant and assigning it to the instance of express.
const MongoClient = require('mongodb').MongoClient // Assign the database (MongoDB) to a variable.  Make is possible to use methods associated with MongoClient and talk to our DB.
const PORT = 2121 // Providing a route (homepage) for our code to run.  Setting a constant to determine where the server will be listening.
require('dotenv').config() // Implement dotenv - used for private key for database and/or port#.  Allows us to look for variables inside the .env file.


let db,  //Declare (Globally) a variable to our database (db) but not assigning.
    dbConnectionStr = process.env.DB_STRING, // Declaring a variable and assigning db connection string.
    dbName = 'todo' // Declaring a variable and assigning the name of the database we will be using.  todo is db name


MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  // Creating a connection the Mongo database and passing the connection string.  Also, passing in an additional property.
    .then(client => { // promise.  Waiting for connection and proceeding if successfull.  Also, passing in client information.
        console.log(`Connected to ${dbName} Database`) // Log to the console a template literal `Connected to ${dbName} Database`.
        db = client.db(dbName) // assigment a value to previously declared  db variable that contains a db client factory method.
    }) // Closing our .then


//SET MIDDLEWARE
app.set('view engine', 'ejs') // Sets EJS as the default render method.
app.use(express.static('public')) // Sets the location for static assets(main.js and style.css).
app.use(express.urlencoded({ extended: true })) // Tells express to decode and encode URL's where the header matches the content.  Supports arrays and objects.
app.use(express.json()) // Parses JSON content


// CRUD Methods:
app.get('/',async (request, response)=>{ // Starts the Get method when the root route is passed in, setup req and res parameters.
    const todoItems = await db.collection('todos').find().toArray() // Sets a variable and awaits ALL items from the todos collection.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Sets a variable and awaits a count of uncompleted items to later display in EJS.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Rendering the EJS file and passing through the db items and the count remaining inside of an object.

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // Starts a POST method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Inserts a new item into todos collection, gives it a completed value of false by default.
    .then(result => { // if insert is successful, do something.
        console.log('Todo Added')//print to the console "Todo Added"
        response.redirect('/')// Gets rid of the /addTodo route and redirects back to the homepage.
    }) //Closing the .then
    .catch(error => console.error(error))// If there is an error, print "error" to the console
})  //Closing the POST

app.put('/markComplete', (request, response) => { // Starts a PUT method when the markComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// Look in the db for one item matching the name of the item passed in from the main.js file that was clicked on.
        $set: { 
            completed: true
          } // sets the completed action from false to true
    },{
        sort: {_id: -1}, // sorts(pushes) task to the bottom of the list, leaving unfinished tasks at the top (descending)
        upsert: false // prevents insertion if item does not already exist.
    })
    .then(result => { //starts a then is update was successful
        console.log('Marked Complete') // Logging successfull completion
        response.json('Marked Complete') // Sending a response back to the sender.
    }) //Closing the .then
    .catch(error => console.error(error)) // In case of error

}) //Closing the PUT

app.put('/markUnComplete', (request, response) => { // Starts a PUT method when the markUnComplete route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Look in the db for one item matching the name of the item passed in from the main.js file that was clicked on.
        $set: {
            completed: false
          } // sets the completed action to false
    },{
        sort: {_id: -1},  // sorts(pushes) task to the bottom of the list, leaving unfinished tasks at the top (descending)
        upsert: false  // prevents insertion if item does not already exist.
    })
    .then(result => { //starts a then is update was successful
        console.log('Marked Complete')  // Logging successfull completion
        response.json('Marked Complete')  // Sending a response back to the sender.
    })     //Closing the .then
    .catch(error => console.error(error))   // In case of error

})  //Closing the PUT

app.delete('/deleteItem', (request, response) => {   // Starts a Delete method when the delete route is passed in 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})  // Look in the todos collection for one item matching name from the JS file.
    .then(result => {  //starts a then is update was successful
        console.log('Todo Deleted')  // Logging successfull completion
        response.json('Todo Deleted')  // Sending a response back to the sender.
    })      //Closing the .then
    .catch(error => console.error(error))     // In case of error
 
}) //Closing the PUT

app.listen(process.env.PORT || PORT, ()=>{   // Setting which PORT we will be Listening on either locally or in the .env file.
    console.log(`Server running on port ${PORT}`)  // Confirms that we are connect to the database via the PORT number.
})   //Closing the listen PORT
