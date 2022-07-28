/// Imports and Requires ////
const express = require('express') // Import express
const app = express() // Define express function
const MongoClient = require('mongodb').MongoClient // Import Mongoclient
const PORT = 2121 // Set Default PORT
require('dotenv').config() // Import dotenv

/// Global Variables ///
let db, // Declare db variable
    dbConnectionStr = process.env.DB_STRING, //Declare and assign the connection string to use either the value in local .env or in th eeviroment variable (eg on heroku)
    dbName = 'todo' // assigns database collection name to variable 

/// Connect to MongoDB ///
    // assign the database to connect to in the Mongo, second parameter is to allocate async/await but is depricated
    // useUnifiedTopology: False by default. Set to true to opt in to using the MongoDB drivers new connection management engine.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => { // promise chain of the collections in the cluster
        console.log(`Connected to ${dbName} Database`) // console logs a string of the database name when conected.
        db = client.db(dbName) // assign db variable => adds/connects a collection called dbname(that is, 'todo') to the cluster
    })

/// Middleware Functions ///    
app.set('view engine', 'ejs') // Sets the view engine to use EJS for templating and spitting out HTML files for user
app.use(express.static('public')) // Sets the server to automatically serve any files requested from within the 'public' folder
app.use(express.urlencoded({ extended: true })) // Parses the incoming request with urlencoded payloads. Extended true allows for rich objects and arrays to be encoded into the URL-encoded format.
// (cont. of urlenconded) Transforms a url into a javascript object consisting of its query parameters and other information.
app.use(express.json()) // It parses incoming request with JSON payloads and is based on body-parser.

/// Get aka the R (read) ///
app.get('/',async (request, response)=>{ // User connects to main route
    const todoItems = await db.collection('todos').find().toArray() // Grabs 'todos' collection in its entirety, converts it into an array, stores it in todoItems.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Counts all the documents which have not been comlpeted and the stores them in the itemsLeft.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Renders index.ejs, passing in the variables items(equal to todoItems) and left(equal to itemsLeft) to the ejs file. The ejs file will use these variables in some way to determine the number, type, and content of HTML elements to create.


    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
/// Post aka the C (Create) ///
app.post('/addTodo', (request, response) => { // When user makes a post reqiest to the /addTodo route...
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Insert a new todo document into the todos collections in the database, with the content of the todo determined JSON data within the post request object.
    .then(result => {
        console.log('Todo Added') // when it finishes, console log some amazing words.
        response.redirect('/') // shady javascript redirects to home page for the get request to '/', which shows user the updated database as it is re-rendered.
    })
    .catch(error => console.error(error)) // backup to catch any errors that may occur, and log them
})

/// Put aka the A (alter) or U (update)
app.put('/markComplete', (request, response) => { // Put request! we are UPDATING/ALTERING a document which is already there.
    // connect the todos collection , update the selected item, set it to have completed as true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ 
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, // Sort that doesn't work????
        upsert: false // defaults as false, so not necessarry. but if set true, would update and insert if item didn't already exist.
    })
    .then(result => { // once item updated
        console.log('Marked Complete') // log 'marked complete' 
        response.json('Marked Complete') // send a response ' Marked Complete' as JSON so it can be logged client side
    })
    .catch(error => console.error(error)) // backup to catch any errors that may occur, and log them.

})

///  Another PUT ///
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error)) // backup to catch any errors that may occur, and log them.

})

/// Delete aka B(banish) or D (delete) ///
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // connect to todos collection and delete the document passed in from delete request
    .then(result => { // once item deleted.
        console.log('Todo Deleted') // log on server side.
        response.json('Todo Deleted') // send words that happen to the client side as data.
    })
    .catch(error => console.error(error)) // back to catch any errors that may occur, log them.

})
/// Setup app to run/listen at designated port ///
// #line 6 ---> const port = 2121 // set Default port 
app.listen(process.env.PORT || PORT, ()=>{ // If runtime environment port specified, use it! Otherwise, use our own PORT variable's value. 
    console.log(`Server running on port ${PORT}`) //COnsole log the Port being ran
})

// A node http.Server is returned, with this application (which is function) as its callback.
// If you wish to create both an HTTP and HTTPS server you mayb do so with the 'http' and 'https' modules as shown here:
// var http = require('http') , https = require ('htpps') , express = require ('express') , app = express();