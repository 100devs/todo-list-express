// MODULES
const express = require('express')  // Requires that express is imported into Node 
const app = express()   // Create an express application
const MongoClient = require('mongodb').MongoClient  // This is MongoClient's connect method
const PORT = 2121   // Establishes port on 2121 so when you load it up you can find it there
require('dotenv').config()  // Allows you to bring in your hidden environment variables in your .env file (see line 9)
        // Should be included in your gitignore file, to keep the environment hidden

let db, // Establishes the database
    dbConnectionStr = process.env.DB_STRING,    // Think of it like an IP address, points to an address on MongoDB 
    dbName = 'todo' // Declare name of created db as 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })  // Defines how we connect to our db. 'Topology true' code enables a MongoDB driver, which in addition to other things allows us to use promises instead of callbacks
    .then(client => {   // Responding on the client side...
        console.log(`Connected to ${dbName} Database`)  // Log that you're connected successfully to the db
        db = client.db(dbName)  // Establishes that the database in question is our db, 'dbName'
    })
// MIDDLEWARE (any 'app.use' is middleware) 
app.set('view engine', 'ejs')   // Determines how we're going to use a view engine, ejs (Embedded JS), to render the HTML more dynamically. This line tells Express that we're using EJS as the template engine
app.use(express.static('public'))   // Tells our app to use a folder called 'public' for all our static files (see main folder to see all static/public files)
app.use(express.urlencoded({ extended: true })) // A call to middleware, cleans up how things are displayed and formats our information coming back from the server for client-side use
app.use(express.json()) // Tells the app to use Express' json method - converts an object into a json string

// ROUTES
app.get('/',async (request, response)=>{    // GET stuff to display to users on the client side using an async function (in this case, index.ejs), which takes two arguments: a request object and a response object
    const todoItems = await db.collection('todos').find().toArray() // Goes into our db, into a collection called todos, finding anything in that db, and adding it to an object called todoItems. To interpret this object, we use toArray() to convert the data into an array (otherwise it would be unreadable)
    const itemsLeft = await db
        .collection('todos')    // Looks at all the documents in the collection todos
        .countDocuments({completed: false})   // Counts the number of items that have not been marked as completed, and puts that number in a variable called itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // Server sends response (which includes the todoItems left, as well as the number of itemsLeft) to the client side that renders all this info in index.ejs
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {   // Adding an element to our db
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  // Server will go into our collection 'todos'. Insert thing named todoItem with status of not completed
    .then(result => {   // Take the result and...
        console.log('Todo Added')   // Console log that the todo was added
        response.redirect('/')  // Refreshes the ejs page to show the new thing we added to the db on the page
    })
    .catch(error => console.error(error))   // If we weren't able to add, will see an error message so we can try to figure out why
})

app.put('/markComplete', (request, response) => {   // Put = update. When we click something on the front end to mark it as complete...
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{     // Goes into our todos db.
        $set: {
            completed: true // Adds a status of 'completed' equal to 'true' to item in our collection
          }
    },{
        sort: {_id: -1},    // Sort the array in descending order by ID? Once something has been marked as completed, this removes it from the todo list, adds it to a completed list maybe?
        upsert: false   // Doesn't create a document for the todo if the item isn't found
    })
    .then(result => {   // Takes the result and...
        console.log('Marked Complete')  // Console logs "Marked Complete"
        response.json('Marked Complete')    // Returns response of "Marked Complete" to the fetch in main.js
    })
    .catch(error => console.error(error))   // If something broke, an error is logged to the console

})

app.put('/markUnComplete', (request, response) => {     // Updates something that you mark uncomplete, AKA was once 'complete' and then is added back to the todo collection as 'not complete'
    db.collection('todos')      // Goes into the todos collection
    .updateOne({thing: request.body.itemFromJS},{       // Look for the todo item in question from itemFromJS
        $set: {
            completed: false    // Undoes what we did with 'markcomplete' - changes completed status to false
          }
    },{
        sort: {_id: -1},    // TRY TO FIGURE OUT. 
        upsert: false       // 
    })
    .then(result => {   // Take the result and...
        console.log('Marked Complete')      // log it as complete
        response.json('Marked Complete')    // Return response of complete to the fetch in main.js
    })
    .catch(error => console.error(error))   // If something broke, log an error to the console

})

app.delete('/deleteItem', (request, response) => {  // DELETE TIME
    db.collection('todos')      // Goes into your collection
    .deleteOne({thing: request.body.itemFromJS})  // Uses MongoDB Collection's deleteOne method (which removes a document from the database). Specifically it find the thing that matches the name of the thing you clicked on. 'request.body.itemFromJS' represents the name of the item clicked.
    .then(result => {   // Take the result/matched item, and...
        console.log('Todo Deleted')     // Console log that todo list item was deleted
        response.json('Todo Deleted')   // Returns response of 'todo deleted' to the fetch in main.js
    })
    .catch(error => console.error(error))   // If something broke, an error is logged

})
// The following will allow browsers to connect to our server
app.listen(process.env.PORT || PORT, ()=>{      // Tells our server to listen for connections on the port we defined earlier OR process.env.PORT will tell the server to listen on the port of the app (e.g., the PORT used by Heroku)
    console.log(`Server running on port ${PORT}`)      // Notifies the successful port connection
})