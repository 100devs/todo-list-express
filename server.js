const express = require('express') //requiring express module to utilize it in this file
const app = express() // Declaring and assigning a variable to run the Express module when needed
const MongoClient = require('mongodb').MongoClient // Declaring a var for MongoDB client module
const PORT = 2121 // Declaring a var for a connection port.
require('dotenv').config() // requiring dotenv and checking for variables set insite the .env file.


let db, // Declaring a global variable, no value assignment at the moment
    dbConnectionStr = process.env.DB_STRING, // Declaring a var, assigning it the value of the DotEnv process with the value of DB_STRING inside the .env file.
    dbName = 'todo' // Declaring a var and assining it the value of the name of the DB from MongoDB Atlas in this instance.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // Creating a connection to MongoDB, and passing in our connection string via our variable.
    .then(client => {  // After establishing the connection we excute the .then code block. and passing in Client information.
        console.log(`Connected to ${dbName} Database`) // Logging to the the console the name of the DB we have connected to.
        db = client.db(dbName) // Assining a value to the DB Global Variable.
    })
    

// Middleware
app.set('view engine', 'ejs') // Telling Express what type of document should be used to generate content. In this case EJS.
app.use(express.static('public')) // Setting a route for all of our documens we want to serve to the client side.
app.use(express.urlencoded({ extended: true })) // Telling express to decode and encode URLs where the headers matches the contnet in our Public folder. Supports Araays and objects.
app.use(express.json()) // Pareses JSON contnet.


// Get or READ requests
app.get('/',async (request, response)=>{ // Indicating the root directory / to serve the requested pages if available. setting up Req and Res parameters.
    const todoItems = await db.collection('todos').find().toArray() // Dec and assing Var and awaits items to be read from MongoDB which are from collection 'todos' inside the "todo" DB we assigned before. Puts all of the returend items inside the todos collection.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Declare and Assign var for the number of items whith the Completed as False. this will be shown on the page later.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Generating response to render the index.ejs document and passing through the todoItems and itemsLeft count into the index.ejs file.

// The blow code block is the same as the above code block however this is done in the promise syntax notation.

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // Starts a POST method when the add route is passed in throug our indes.ejs form.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // Insert a new item into our todos collection. setting the completed attribute of the item to false by default to make sure this does not get any formatting which happens when it is set to true.
    .then(result => { // to execute when the before code block gets excuted.
        console.log('Todo Added') // console logging 'Todo Added' jus to show this in the terminal, this does not have any function beond that.
        response.redirect('/') // reloading the page when this post has been completed, removes the //addtodo route we are in for the form. this makes sure to show the newly added todo item without having to reload the page manually.
    })
    .catch(error => console.error(error)) // if any errors occur, logs the error to the console.
})

app.put('/markComplete', (request, response) => { // Starts a PUT method when the markComplete route is passed in.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Look in the DB for one item matching the name of the item passed in from the main.js file that was clicked on. in this case there is no protection for multiple items with the same name.
        $set: { // Setting the Completed value of the item found to True.
            completed: true
          }
    },{
        sort: {_id: -1}, // Moves the item updated to the bottom of the list.
        upsert: false // Prevents creation of the items if it did not excist in the DB to start with.
    })
    .then(result => { // Starting event if the setting completed event was successful.
        console.log('Marked Complete') // Console log that the Marked Completed action has been completed.
        response.json('Marked Complete') // Sending a response back to the sender, Main.js file in this instance as it is waiting for a server response.
    })
    .catch(error => console.error(error)) // Catching and logging errors to the console.

})

app.put('/markUnComplete', (request, response) => { // Starts a PUT method when the markComplete route is passed in.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // Look in the DB for one item matching the name of the item passed in from the main.js file that was clicked on. in this case there is no protection for multiple items with the same name.
        $set: { // Setting the Completed value of the item found to False.
            completed: false
          }
    },{
        sort: {_id: -1}, // Moves the item updated to the bottom of the list.
        upsert: false // Prevents creation of the items if it did not excist in the DB to start with.
    })
    .then(result => { // Starting event if the setting completed event was successful.
        console.log('Marked Complete') // Console log that the Marked Completed action has been completed.
        response.json('Marked Complete') // Sending a response back to the sender, Main.js file in this instance as it is waiting for a server response.
    })
    .catch(error => console.error(error)) // Catching and logging errors to the console.

})

app.delete('/deleteItem', (request, response) => { // Starts a DELETE method when the Delete route is passed in.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // Look inside the todos collection for the ONE iem that has a matching name from our JS file.
    .then(result => { // Startsa a then if delete was successful.
        console.log('Todo Deleted') // logging success message to console.
        response.json('Todo Deleted') // sending a response back to the front-end
    })
    .catch(error => console.error(error)) //catching and logging errors to the console.

})

app.listen(process.env.PORT || PORT, ()=>{ // setting which port to use, either from environment process or if not available use PORT var assing at the start of the document.
    console.log(`Server running on port ${PORT}`) // logging to the console which port is being used.
})