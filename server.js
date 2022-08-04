////////// Imports and requires //////////////////////////////////////////
const express = require('express') //Import express
const app = express() // Define express function
const MongoClient = require('mongodb').MongoClient //Import Mongoclient
const PORT = 2121 // Set default Port
require('dotenv').config() // Import dotenv

////////// Global Variables //////////////////////////////////////////
let db; // declare db variable
    dbConnectionStr = process.env.DB_STRING; //Declare and assign the connection string to use either the value in local .env or in the environment variables(eg on heroku)
    dbName = 'todo'; //assigns database collection name to variable 


////////// Connect to MongoDB //////////////////////////////////////////
    // Assign the database to connect to in Mongo, second parameter is to allow async/await but is deprecated
    // useUnifiedTopology: False by default. Set to true to opt in to using the MongoDB driver's new connection management engine.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) 
    .then(client => { //Promise chain of all the collections in the cluster
        console.log(`Connected to ${dbName} Database`) //Console logs a string of the database name when connected. Big brain!!!!!!
        db = client.db(dbName) // assign db variable => adds/connects a collection called dbname(that is, 'todo') to the cluster
    })
    
////////// Middleware Functions //////////////////////////////////////////
app.set('view engine', 'ejs') // Sets the view engine to use EJS for templating and spitting out HTML files for user
app.use(express.static('public')) // Sets the server to automatically serve any files requested from within the 'public' folder
app.use(express.urlencoded({ extended: true })) // Parses the incoming requests with urlencoded payloads. Extended True allows for rich objects and arrays to be encoded into the URL-encoded format
//(cont. of urlencoded) Transforms a URL into a javascript object consisting of its query parameters and other information
app.use(express.json()) // It parses incoming requests with JSON payloads and is based on body-parser. 

////////// GET aka the R (Read) in CRAB ///////////////////////////////////////////
app.get('/',async (request, response)=>{ // user connects to main route
    const todoItems = await db.collection('todos').find().toArray() // Grabs 'todos' collection in its entirety, converts it into an array, stores it in todoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Counts all documents which have not been completed and stores them in itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Renders index.ejs, passing in the variables items(equal to todoItems) and left(equal to itemsLeft) to the EJS file. The EJS file will use these variables in some way to determine the number, type, and content of HTML elements to create.
    

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// OCTO PEOPLE  <--- lol ♥♥
//     __       __
//    / <`     '> \
//   (  / @   @ \  )
//    \(_ _\_/_ _)/
//  (\ `-/     \-' /)
//   "===\  ♥  /==="
//    .==')___(`==.    
//   ' .='     `=.
//        ___     ___
//      .i .-'   `-. i.  clack clack
//    .'   `/     \'  _`.
//    |,-../ o   o \.' `|
// (| |   /  _\ /_  \   | |)
//  \\\  (_.'.'"`.`._)  ///
//   \\`._(..: ♥ :..)_.'//
//    \`.__\ .:-:. /__.'/
//     `-i-->.___.<--i-'
//     .'.-'/.=^=.\`-.`.
//    /.'  //     \\  `.\
//   ||   ||       ||   ||
//   \)   ||       ||  (/
//        \)       (/        


////////// POST aka the C (Create) in CRAB ///////////////////////////////////////////
app.post('/addTodo', async(request, response) => { // When user makes a post request to the /addTodo route...

    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Insert a new todo document into the todos collection in the database, with the content of the todo determined by JSON data within the post request object.
    .then(result => {
        console.log('Todo Added') // when it finishes, console log some amazing words
        response.redirect('/')  // shady javascript redirect to home page for get request to '/', which shows user the updated database as it is re-rendered
    })
    .catch(error => console.error(error)) // backup to catch any errors that may occur, and log them
})

//  (\/) (°,,,,°) (\/) ♥♥
////////// PUT aka the A (Alter) in CRAB ///////////////////////////////////////////
app.put('/markComplete', (request, response) => { // Put request! We are UPDATING/ALTERING a document which is already there
    db.collection('todos').updateOne(       //connect to todos collection, and update
        {thing: request.body.itemFromJS},   //the selected item
        {                                   //set it to have completed as true
        $set: {
            completed: true
          }
        },{
        sort: {_id: -1},  // Sort that doesn't work. ?!?!?!
        upsert: false // defaults as false, so not necessary. But if set true, would update and insert if item didn't already exist
        //crabsert: true (\/) (°,,,,°) (\/)
        // and Zoidberg said, show me a crab! But there was no crab. so a crab came into existence.
    })
    .then(result => {                       // once item updated
        console.log(request.body.itemFromJS, 'Marked Complete')      // log "marked complete"
        response.json('Marked Complete')    // send a response 'Marked complete' as json so we can log it on the client side
    })
    .catch(error => console.error(error)) // backup to catch any errors that may occur, and log them

})

/////// ANOTHER PUT/ALTER /////////////////////
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        // sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked UnComplete')
        response.json('Marked UnComplete')
    })
    .catch(error => console.error(error)) // backup to catch any errors that may occur, and log them

})

// (\/) (°,,,,°) (\/)  ♥♥
/////// Del-le-tay aka the B (Banish) in CRAB /////////////////////
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // connect to todos collection and delete the document passed in from delete request
    .then(result => {                 // once item deleted
        console.log('Todo Deleted')   // log on server side
        response.json('Todo Deleted') // Send WORDS THAT HAPPEN  :O to the client side as data
    })
    .catch(error => console.error(error)) // backup to catch any errors that may occur, and log them

})

/////// Setup app to run/listen(twirl your hand and put it to your ear) at designated port  /////////////////////
// #line 6 --> const PORT = 2121 // Set default Port
app.listen(process.env.PORT || PORT, ()=>{  // If runtime environment has a port specified, use it! Otherwise, use our own PORT variable's value
    console.log(`Server running on port ${PORT}`) //console log the port being ran
})

// A node http.Server is returned, with this application (which is a Function) as its callback. 
// If you wish to create both an HTTP and HTTPS server you may do so with the "http" and "https" modules as shown here:
// var http = require('http') , https = require('https') , express = require('express') , app = express();
