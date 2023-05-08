const express = require('express') //Require express on server.js after installing it under node_modules
const app = express() //Set app variable to express, enables use of "app.get/put/delete/listen"
const MongoClient = require('mongodb').MongoClient //Require MongoClient (access to mongodb database) and set it to variable MongoClient
const PORT = 2121 //Set port to variable PORT
require('dotenv').config() //Require dotenv to allow loading of environment variables (in this case, DB_STRING) from the .env file

//CONNECTION TO DATABASE//
let db, //set db variable for later assignment
    dbConnectionStr = process.env.DB_STRING, //set dbConnectionStr variable to this connection string
    dbName = 'todo' //name of databse in linked cluster to read/write from/to

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Using MongoClient, connect using the dbConnectionStr (which is our process.env.DB_STRING)
    .then(client => { //Once the connect call has been completed, do the following
        console.log(`Connected to ${dbName} Database`) //Log that we are connected to the database
        db = client.db(dbName) //Create new DB instance sharing current socket connections, assign to db variable
    })

// SET MIDDLEWARES
app.set('view engine', 'ejs') //
app.use(express.static('public')) //Enables the serving of 'static' files from the public folder. This is what allows us to just referencce "main.css" or "main.js" as it will assume public as root directory
app.use(express.urlencoded({ extended: true })) //parses data with qs library (whatthefuccc?), allows for a more json-like experience.
app.use(express.json()) //sets app to parse incoming requests with JSON parser and is based on body-parser

//GET METHOD - Is called when page is loaded or refreshed
app.get('/',async (request, response)=>{
    // const todoItems = await db.collection('todos').find().toArray() //Finds all 'todos' documents from the database
    // const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Counts all 'todos' documents from the database
    // response.render('index.ejs', { items: todoItems, left: itemsLeft }) //responds with render of index.ejs as html and items: todoItems, left: itemsLeft

    db.collection('todos').find().toArray() //database > look into 'todos' collection > find all documents IN the todos collection > put into array
    .then(data => { //array from above is passed into this .then under the variable 'data'. data is now the array from above.
        db.collection('todos').countDocuments({completed: false}) // counts documents within the 'todos' collection that have a 'completed: false' value
        .then(itemsLeft => { //After counting, then take the counted items that satisfy completed: false and perform the following
            response.render('index.ejs', { items: data, left: itemsLeft }) //pass the array (as 'data') into the ejs template. 'items' is the name that the variable data has been given, so every time items is mentioned in ejs is is referring to data > array of tasks. left is the name of itemsLeft and will be used for a remaining count in EJS.
        })
    })
    .catch(error => console.error(error)) // if any of the promises from above fail, catch and console.error the error message
})

//POST METHOD - Is called when '/addTodo' form is submitted on webpage
app.post('/addTodo', (request, response) => { //Receive request from client that calls app.post through '/addToDo' action on ejs form.
    // console.log(request) -> Shows you the RAW request
    // console.log(request.body) -> Shows you the raw request BODY where you can extract object values below
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //Searches the post from the form to find the todoItem from request.body, then inserts as a document within 'todos' collection with completed: false by default
    .then(result => {
        console.log('Todo Added') //Log to console that the above code completed ('Todo Added')
        response.redirect('/') //Refresh the page to render new content 
    })
    .catch(error => console.error(error))// if any of the promises from above fail, catch and console.error the error message
})

//PUT METHOD - Is called when a <span> event listener is triggered and an item must be updated from completed: false to completed: true || completed: true to completed: false
app.put('/markComplete', (request, response) => { //Receive request from clientside JS that calls "/markComplete" on event listener click
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Match the specific item that was clicked on in the dom to the 'todos' collection from db and update with the following instructions
        $set: { //indicate to replace value of field
            completed: true //set completed field to true
          } // close
    },{ 
        sort: {_id: -1}, //sort the item
        upsert: false //upsert - if true, will create an item with the info from above if a match is not found in the db; if false will not do this and return an error
    })
    .then(result => { //once code above has run, do the following
        console.log('Marked Complete') //Log to console 'Marked Complete'
        response.json('Marked Complete') //respond with JSON 'Marked Complete' (client side is awaiting this)
    })
    .catch(error => console.error(error)) // if any of the promises from above fail, catch and console.error the error message

})

//PUT METHOD - Is called when a <span> event listener is triggered and an item must be updated from completed: false to completed: true || completed: true to completed: false
app.put('/markUnComplete', (request, response) => { //Receive request from clientside JS that calls 'markUnComplete' on event listener click
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Match the specific item that was clicked on in the dom to the 'todos' collection from db and update with the following instructions
        $set: { //indicate to replace value of field
            completed: false //set completed field to false
          } //close
    },{
        sort: {_id: -1}, //sort the item
        upsert: false //upsert true or false
    })
    .then(result => { //once code above has run, do the following
        console.log('Marked UnComplete') //Log to console 'Marked UnComplete'
        response.json('Marked UnComplete') //repond with JSON 'Marked UnComplete' (client-side is awaiting this)
    })
    .catch(error => console.error(error)) // if any of the promises from above fail, catch and console.error the error message
})

//DELETE METHOD - Is called when event listener on fa-trash icon is triggered and removes a document from 'todos' collection
app.delete('/deleteItem', (request, response) => { //Receive request from clientside JS that calls '/deleteItem' on event listener click
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //Match specific item that was clicked on in the dom to the 'todos' collection from db and delete that document
    .then(result => { //Once code above has compelted, do the following
        console.log('Todo Deleted') //Log to console 'Todo Deleted'
        response.json('Todo Deleted') //Respond with JSON 'Todo Deleted' (client-side is awaiting this)
    })
    .catch(error => console.error(error)) // if any of the promises from above fail, catch and console.error the error message
})

//LISTEN METHOD - listens for connections on specified host and port
app.listen(process.env.PORT || PORT, ()=>{ //Listen on process.env.PORT or PORT
    console.log(`Server running on port ${PORT}`) //Log to console that server is listening on port${PORT}
})

// END //