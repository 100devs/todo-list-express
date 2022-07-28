const express = require('express') // anywhere in main.js or server.js it includes express.js - basically it is importing express
const app = express() // Create an Express application
const MongoClient = require('mongodb').MongoClient // requires MongoClient library
const PORT = 2121 // establishes a port number (currently local port)

// require('dotenv').config() // https://www.youtube.com/watch?v=hZUNMYU4Kzo  brings in your hidden keys
//    - HIDE THEM - better: const dotenv = require('dotenv').config();
// The work it does is letting you write process.env.MONGO_DB_STRING to refer to the MONGO_DB_STRING
// variable that you stored in that file. If you tried to make a .env file without importing that dotenv package,
// you'd have a file called .env, but you couldn't do that process.env trick with it.
const dotenv = require('dotenv').config({
    path: './secrets/.env'
})

let db, // creates the database
    dbConnectionStr = process.env.DB_STRING, // sets dbConnectionStr equal to address provided by MongoDB (DB_STRING is in the .env config gile on line 11)
    dbName = 'todo' // collection name is "todo"

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => { // Defines how we connect to our Mongo DB.useUnifiedTopology helps ensure that things are returned in a clean manner.
        console.log(`Connected to ${dbName} Database`) // the clinet is responsing on the client side and saying..
        // hey we made it! We connected to the databes named 'todo'
        db = client.db(dbName)  // defines the database as 'todo'. Wokrs with the line 14
    })

app.set('view engine', 'ejs') // how are we going to use a view (template) engine to  render ejs (embedded JavaScript) commands for our app
app.use(express.static('public')) // tells our app to use a folder named "public" for all our static files (e.g., images and CSS files)
app.use(express.urlencoded({ extended: true })) // call to middleware that cleans up how things are displayed and
                                                //how our server communicates with our client (Similar to useUnifiedTopology above.)
app.use(express.json()) // Tells the app to use Express's json method to take the object and turn it into a JSON string
// The express.urlencoded() function is a built-in middleware function in Express.
// It parses incoming requests with urlencoded payloads and is based on body-parser.

// GET stuff to display to users on the client side (in this case, index.ejs) using an asynchrounous function
app.get('/',async (request, response)=>{
    // Create a constant called "todoItems" that goes into our databes, creating a collection called "todos",
    // and finding anything in that database and turning it into an array of objects
    const todoItems = await db.collection('todos').find().toArray()
    // creating another variable in our todos collection and looks all the documents in our collection and
    // counts all the documens that have a completed status equal to "false"
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // you are going and counting how many to-do list items haven't been completed yet. "What is still left on te agenda?"
    // sends a response that renders the number of documents in our collection and
    // the number of items left (items that don't have "true" for "completed") in index.js
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // - Sending back a response of the to-do items we still have to do to index.js
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
    // adds item to our database via route /addTodo
    db.collection('todos')// Server will go into our collection called "todos"
       // Inser one "thing" named todoItem with a status of completed set to "false" (i.e, it puts some stuff in there. Bye)
      .insertOne({thing: request.body.todoItem, completed: false})
      .then(result => {// Assuming that everything went okay...
        console.log('Todo Added') // Print "Todo Added " to the console in the repls for VS Code
        response.redirect('/') // Refreshes the ejs page to show that new thing we added to the database on the page
    })
    .catch(error => console.error(error)) // if we weren't able to add anything to the database we'll see an error message in the console
})

app.put('/markComplete', (request, response) => {
    // UPDATE. When we click someting on the frontend..
    db.collection('todos') // going to go into our "todos" collection
      .updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true // Add status of "completed" equal to "true" to item in our collection
          }
    },{
        // "When you use the MongoDB sort() method, you can specify the sort order—ascending (1) or descending (-1)—for the result set. I"
        // "Sorting by _id is faster because of the way _id field value is generated."
        // once a thing has been marked as completed, this removes it from the to-do list and add it to the completed list, 
        // this sorts the array by descendng order by id
        sort: {_id: -1},
        upsert: false // Reduces left-to-do total by 1
    })
    .then(result => {
        console.log('Marked Complete') // When a task is finished we mark the task with line and console log Mark complete
        response.json('Marked Completedddd') // return a response to the client side saying Mark Completeddd
    })
    // if we were not able to mark the flag of completed to true in the database we will see an error message in the console.
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    // UPDATE: This marks the thing as uncomplete. After we clicked again on the element from the TODO list, we unmark it
    db.collection('todos') // Go into our "todos" collection
      .updateOne({thing: request.body.itemFromJS},{ // find the thing name in the collection
        $set: {
            completed: false // Change the status of "completed" to "false" to item in our collection
          }
    },{
        sort: {_id: -1}, // Once a thing has been marked as completed, this sorts the array by descending order by id
        upsert: false    // Doesn't create a document for the todo if the item isn't found
    })
    .then(result => {
        console.log('Marked Uncompleted') // If it updated it successfuly, we console log the output
        response.json('Marked Uncompleteddd') // Returns response of "Marked Complete" to the fetch in main.js
    })
    .catch(error => console.error(error)) // If it was not able to return a response, it console logs the error

})

app.delete('/deleteItem', (request, response) => {
    // DELETE: de-le-te - deletes an item from out database and returns it to the main.js
    db.collection('todos') // go into our collection called "todos"
      .deleteOne({thing: request.body.itemFromJS}) // Uses deleteOne method and find a thing that matches the name of the thing you clicked on
    .then(result => { // if everything went okay
        console.log('Todo Deleted') // We console log that the "thing" was deleted
        response.json('Todo Deleted') // returns a reposne of "Todo Deleted" to the fetch in main.js
    })
    .catch(error => console.error(error)) // if it was not able to return a response or delete a thing, console log the error
})

app.listen(process.env.PORT || PORT, ()=>{
    // Tells our server to listen for connections on the PORT we defined as a constant earlier OR
    // process.env.PORT will tell the server to listen on the port of the app (e.g., the PORT used by Heroku)
    console.log(`Server running on port ${PORT}`); // Console log the port number or server is running on
})