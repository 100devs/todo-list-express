const express = require('express')  // Making it possible to use EXPRESS in this file.  REQUIRE EXPRESS.
const app = express()   // Express was one of the PACKAGES (DEPENDENCIES) that's listed in JSON file.  So this call, we are saving it to VARIABLE 'APP'.   Setting a CONSTANT VARIABLE and ASSIGNING it to the instance of EXPRESS;
const MongoClient = require('mongodb').MongoClient  // Makes it possible to use METHODS associated with MONGOCLIENT and talk to our DB
const PORT = 2121   //Setting a CONSTANT VARIABLE to DEFINE the location where our server will be listening.  It's in ALL-CAPS because it's a GLOBAL constant (just a convention; not necessary).  There are several ways to connect to MONGODB; CLASS, MONGOOSE.
require('dotenv').config()  //Allows us to look for VARIABLES inside of the .ENV file.


let db, // Declaring a VARIABLE; not assigning any values; declaring it GLOBALLY so it's available everywhere.
    dbConnectionStr = process.env.DB_STRING,    // Declaring a variable; assigning to it the DB CONNECTION STRING.
    dbName = 'todo' // Declaring a VARIABLE; assigning the name of the DATABASE we will be using.  Information: hiearchy of a MongoDB - CLUSTER; inside of this DATABASES; inside of this COLLECTIONS; individual items are DOCUMENTS.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  // Creating a connection to MongoDB, and passing in our connection string; also passing in an additional property.
    .then(client => {   // Waiting for the connection and proceeding if successful; passing in all the client information.
        console.log(`Connected to ${dbName} Database`)  // log to console a template literal "connected to todo Database".
        db = client.db(dbName)  // Assigning a VALUE to previously declared DB variable that contains a DB CLIENT FACTORY METHOD
    })  // Closing our .THEN

// MIDDLEWARE - it helps faciliate our communication for requests.
app.set('view engine', 'ejs')   // Sets EJS as the DEFAULT RENDERer
app.use(express.static('public'))   // Sets the location for STATIC assets
app.use(express.urlencoded({ extended: true })) // Tells express to DECODE and ENCODE URLSs where the header matches the content; supports ARRAYS and OBJECTS.
app.use(express.json()) // Parses JSON content; 


app.get('/',async (request, response)=>{    // GET iS associated with 'READ'. Starts a GET METHOD when the root route is passed in; sets up REQ and RES parameters.
    const todoItems = await db.collection('todos').find().toArray() // Sets a VARIABLE and AWAITS ALL items from TODOs COLLECTION.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})   // Sets a VARIABLE and AWAITS a COUNT of UNCOMPLETED items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // We are doing two things here; RENDERING EJS file and passing through teh DB items and the COUNT remaining inside of an object.
    // db.collection('todos').find().toArray()      // <--- this is the start of the CLASS PROMISE VERSION - JUST DIFFERENT WAY OF WRITING.
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {   // Starts a POST METHOD when the ADD ROUTE is PASSED in.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  // Inserts a new item into TODOs COLLECTION; Setting it to FALSE, by DEFAULT, because we want it DISPLAYED on list WITHOUT any format.  
    .then(result => {   // If INSERT is successful, do something
        console.log('Todo Added')   // Console log  action
        response.redirect('/')  // We are re-directing because - it gets rid of the /addTodo ROUTE, and redirects back to the homepage.
    })  // Closing the THEN
    .catch(error => console.error(error))   // Catching ERRORS
})  // Ending the POST

app.put('/markComplete', (request, response) => {   // Starts a PUT METHOD when the MARKCOMPLETE ROUTE  is passed in.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Look in the DB for one item matching the name of the item passed in from the MAIN.JS file that was clicked on
        $set: {  
            completed: true // set completed STATUS to TRUE
          } 
    },{
        sort: {_id: -1},    // Moves item to the bottom of the list.
        upsert: false   // Prevents insertion if ITEM does not already exist
    })
    .then(result => {   // Starts a THEN if UPDATE was successful
        console.log('Marked Complete')  // Logging successful completion
        response.json('Marked Complete')    // Sending a RESPONSE back to the SENDER
    })  // Closing .THEN
    .catch(error => console.error(error))   // Catching ERRORS

})  // Ending PUT

app.put('/markUnComplete', (request, response) => {   // Starts a PUT METHOD when the MARKunCOMPLETE ROUTE  is passed in.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Look in the DB for one item matching the name of the item passed in from the MAIN.JS file that was clicked on
        $set: { 
            completed: false // set completed STATUS to FALSE
          }
    },{
        sort: {_id: -1},    // Moves item to the bottom of the list.
        upsert: false   // Prevents insertion if ITEM does not already exist
    })
    .then(result => {   // Starts a THEN if UPDATE was successful
        console.log('Marked Complete')  // Logging successful completion
        response.json('Marked Complete')    // Sending a RESPONSE back to the SENDER
    })  // Closing .THEN
    .catch(error => console.error(error))   // Catching ERRORS

})  // Ending PUT

app.delete('/deleteItem', (request, response) => {   // Starts a POST METHOD when the DELETE ROUTE is PASSED in.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Look in the TODOS COLLECTION for one item matching the name of the item passed in from the MAIN.JS file that was clicked on
    .then(result => {   // Starts a THEN if DELETE was successful
        console.log('Todo Deleted')  // Logging successful completion
        response.json('Todo Deleted')    // Sending a RESPONSE back to the SENDER
    })  // Closing .THEN
    .catch(error => console.error(error))   // Catching ERRORS

})  // Ending DELETE

app.listen(process.env.PORT || PORT, ()=>{  // Setting up which port we will be listening on - either the port from the .env file or the VARIABLE we set.
    console.log(`Server running on port ${PORT}`)   // console.log the running port.
})  // END the LISTEN Method