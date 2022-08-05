const express = require('express') // enables express use, requries that express be imported into node for use.    
const app = express() // defines "app" calls as express methods, creates an express application
const MongoClient = require('mongodb').MongoClient // enables MongoDB use, requoires a mongodb be createed and linked.
const PORT = 2121 //establishes a local port to use as default, in the case you're not using a hosted service
require('dotenv').config() //stores vulnerable info in a safe hidden file 


let db, // defines the db as a changeable variable, creates a database 
    dbConnectionStr = process.env.DB_STRING, // sets your connection string variable as an env variable to keep it hidden. Allows you to point to a place in mongodb.
    dbName = 'todo' //defines the database that you're going to connect to. 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {  // notifies that the client is connected is connected on the client side, in the console here .
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') // Sets our templating engine, in this case "EJS", which will render our ejs
app.use(express.static('public')) // tells our app to use public folder to store CSS, etc.
app.use(express.urlencoded({ extended: true })) // calls clean up middleware. 
app.use(express.json()) // returns objcct as a string using Express' json method. 


app.get('/',async (request, response)=>{ // makes a request to the server to go get the main page.
    const todoItems = await db.collection('todos').find().toArray() // sets 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // adds an item to the todos database.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // changes the completed status of the added item to false.
    .then(result => {
        console.log('Todo Added') //displays todo added in the console.
        response.redirect('/') // refreshes the main page
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    // goes to the DB of todos and updates with request.body.itemFromJS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }// updates the collection with the thing, checks if it's been completed, confirms the completion
    },{
        sort: {_id: -1}, // sorts items in descending order
        upsert: false  //does not update after the last step
    })
    .then(result => {
        console.log('Marked Complete') // writes "marked complete to the console."
        response.json('Marked Complete')  //'displays marked complete in the app.'
    })
    .catch(error => console.error(error)) // catches any errors, and displays the error info.

})

app.put('/markUnComplete', (request, response) => { // looks for  an item in the DB that mathces the id (requet.body.itemFromJS) and updates it to show that it's not  complete.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //sets the 'competed' property to false
        $set: {
            completed: false
          }
    },{ //determines that an item is not complete.
        sort: {_id: -1},
        upsert: false
    }) //same
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// CReates a DELETE handler on the /deleteItem 
app.delete('/deleteItem', (request, response) => { // pretty straightforward, gets a request from the client on the delete route. Will go into the db, find the name of the list item that matches the list item that was clicked on, and delete that entry. 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted') // will print todo deleted in the console.
        response.json('Todo Deleted') // will show response deleted in like, postman

    })
    .catch(error => console.error(error)) //responds with error info if the command was unsuccessful.

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
}) // tells the server to listen for requests from port 2121 or the assigned port from the host service.






// ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????//


// // MODULES
// const express = require('express'); // Requires that Express be imported into Node
// const app = express(); // Create an Express application
// const MongoClient = require('mongodb').MongoClient; // Requires that MongoClient library be imported
// const PORT = 2121; // Establishes a (local) port on port 2121
// require('dotenv').config(); // Allows you to bring in hidden environment variables  (Should be included in your gitignore file.)

// let db, // Creates database
//   dbConnectionStr = process.env.DB_STRING, // Sets dbConnectionStr equal to address provided by MongoDB (DB_STRING is in the .env config file in line 5)
//   dbName = 'todo'; // Sets database name equal to 'todo'

// MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
//   // Defines how we connect to our Mongo DB. useUnifiedTopology helps ensure that things are returned in a clean manner.
//   (client) => {
//     // Responding on the client side and saying...
//     console.log(`Connected to ${dbName} Database`); // Will produce a message in the console if the client connected properly (i.e., "Hey, we made it! We connected to the database named 'todo'!")
//     db = client.db(dbName); // Defines the database as 'todo'. Works with line 15.
//   }
// );

// // MIDDLEWARE
// app.set('view engine', 'ejs'); // Determines how we're going to use a view (template) engine to render ejs (embedded JavaScript) commands for our app
// app.use(express.static('public')); // Tells our app to use a folder named "public" for all of our static files (e.g., images and CSS files)
// app.use(express.urlencoded({ extended: true })); // Call to middleware that cleans up how things are displayed and how our server communicates with our client (Similar to useUnifiedTopology above.)
// app.use(express.json()); // Tells the app to use Express's json method to take the object and turn it into a JSON string

// // ROUTES
// app.get('/', async (request, response) => {
//   // GET stuff to display to users on the client side (in this case, index.ejs) using an asynchronous function
//   const todoItems = await db.collection('todos').find().toArray(); // Create a constant called "todoItems" that goes into our database, create a collection called "todos", find anything in that database, and turn it into an array of objects
//   const itemsLeft = await db // Creates a constant in our todos collection
//     .collection('todos') // Looks at documents in the collection
//     .countDocuments({ completed: false }); // The .countDocuments method counts the number of documents that have a completed status equal to "false" (You're going and counting how many to-do list items haven't been completed yet. ""What is still left on the agenda?")
//   response.render('index.ejs', { items: todoItems, left: itemsLeft }); // Sends response that renders the number of documents in our collect and the number of items left (items that don't have "true" for "completed") in index.js (Sending back a response of the to-do items we still have to do to index.js.)
//   // db.collection('todos').find().toArray()
//   // .then(data => {
//   //     db.collection('todos').countDocuments({completed: false})
//   //     .then(itemsLeft => {
//   //         response.render('index.ejs', { items: data, left: itemsLeft })
//   //     })
//   // })
//   // .catch(error => console.error(error))
// });

// app.post('/addTodo', (request, response) => {
//   // Adds item to our database via route /addTodo
//   db.collection('todos') // Server will go into our collection called "todos"
//     .insertOne({ thing: request.body.todoItem, completed: false }) // Insert one "thing" named todoItem with a status of "completed" set to "false" (i.e., it puts some stuff in there. Bye.)
//     .then((result) => {
//       // Assuming that everything went okay...
//       console.log('Todo Added'); // Print "Todo Added" to the console in the repl for VS Code
//       response.redirect('/'); // Refreshes index.ejs to show that new thing we added to the database on the page
//     })
//     .catch((error) => console.error(error)); // If we weren't able to add anything to the database, we'll see an error message in the console
// });

// app.put('/markComplete', (request, response) => {
//   // UPDATE. When we click something on the frontend...
//   db.collection('todos') // Going to go into our "todos" collection
//     .updateOne(
//       { thing: request.body.itemFromJS },
//       {
//         $set: {
//           completed: true, // Add status of "completed"" equal to "true" to item in our collection
//         },
//       },
//       {
//         sort: { _id: -1 }, // Once a thing has been marked as completed, this sorts the array by descending order by id
//         upsert: false, // Doesn't create a document for the todo if the item isn't found
//       }
//     )
//     .then((result) => {
//       // Assuming that everything went okay and we got a result...
//       console.log('Marked Complete'); // Console log "Marked Complete"
//       response.json('Marked Complete'); // Returns response of "Marked Complete" to the fetch in main.js
//     })
//     .catch((error) => console.error(error)); // If something broke, an error is logged to the console
// });

// app.put('/markUnComplete', (request, response) => {
//   // This route unclicks a thing that you've marked as complete — will take away complete status
//   db.collection('todos') // Go into todos collection
//     .updateOne(
//       { thing: request.body.itemFromJS }, // Look for item from itemFromJS
//       {
//         $set: {
//           completed: false, // Undoes what we did with markComplete. It changes "completed" status to "false".
//         },
//       },
//       {
//         sort: { _id: -1 }, // Once a thing has been marked as UNcompleted, this sorts the array by descending order by id
//         upsert: false, // Doesn't create a document for the todo if the item isn't found
//       }
//     )
//     .then((result) => {
//       // Assuming that everything went okay and we got a result...
//       console.log('Marked Complete'); // Console log "Marked Complete"
//       response.json('Marked Complete'); // Returns response of "Marked Complete" to the fetch in main.js
//     })
//     .catch((error) => console.error(error)); // If something broke, an error is logged to the console
// });

// app.delete('/deleteItem', (request, response) => {
//   // DELETE
//   db.collection('todos') // Goes into your collection
//     .deleteOne({ thing: request.body.itemFromJS }) // Uses deleteOne method and find a thing that matches the name of the thing you clicked on
//     .then((result) => {
//       // Assuming everything went okay...
//       console.log('Todo Deleted'); // Console logo "Todo Deleted"
//       response.json('Todo Deleted'); // Returns response of "Todo Deleted" to the fetch in main.js
//     })
//     .catch((error) => console.error(error)); // If something broke, an error is logged to the console
// });

// app.listen(process.env.PORT || PORT, () => {
//   // Tells our server to listen for connections on the PORT we defined as a constant earlier OR process.env.PORT will tell the server to listen on the port of the app (e.g., the PORT used by Heroku)
//   console.log(`Server running on port ${PORT}`); // Console log the port number or server is running on
// });
