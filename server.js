// Joined 100devs-voice-1 on 2022-07-26 which focused on the server.js file

/*-------  MODULES -------*/
const express = require('express')                          // Requires that Express be imported into Node
const app = express()                                       // Creates an Express application
const MongoClient = require('mongodb').MongoClient          // Requires MongoClient library import 
const PORT = 2121                                           // Establishes a local port (port 2121)
require('dotenv').config()                                  // Allows you to bring in hidden environment variables (hidden in .gitignore file so that it's not pushed up the stream)

/* 
    Lines 14-16 Creates database "db". Creates and sets the dbConnectionStr equal to the address provided 
    by MongoDB (DB_STRING is in the .env config file). Then, creates and sets the database name (dbName) to "todo"
*/
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

/*
    Lines 22-26 Defines how we connect to our MongoDB
    useUnifiedTopology ensures that things are returned cleanly
*/
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)      // Connection successful! Console.log success message: 'Connected to "todo"'
        db = client.db(dbName)                              // Defines the database as the database name ('todo') 
    })

/*-------  MIDDLEWARE -------*/

app.set('view engine', 'ejs')                               // Use a view (template) engine to render embedded JavaScript (ejs) commands for our app
app.use(express.static('public'))                           // Tells our app to use a "public" folder for all static files (CSS and JS in this case)
app.use(express.urlencoded({ extended: true }))             // Calls middleware (like useUnifiedTopology previously) to clean up how the server communicates with our client
app.use(express.json())                                     // Tells the app to use Express JSON method to take the object and turn it into a JSON string

/*-------  ROUTES -------*/
/*
    Line 43: Go get something to display to users. In this case, 'index.ejs'
    Line 44: Creates a constant variable ("todoItems") that goes into our database, named 'todos,' and creates a collection called 'todos'. 
             Then it finds anything in the database and turns it into an array of objects  
    Line 45: Determines if the item has a status of "completed:false" and counts the number of documents that fits that criteria
    Line 46: Render all of the info you just got from the server to index.ejs. There should be two lists rendered: todoItems and itemsLeft
*/ 
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
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

/*  Let's add some stuff to the todo list
    Line 62.a: Server will go into the collection called 'todos' (from line 45)
    Line 62.b: (from '.insertOne()...' - Insert one "thing" named todoItem with the status of completed: false
*/
app.post('/addTodo', (request, response) => {               
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {                                       // Assuming things went well..
        console.log('Todo Added')                           // Print "Todo Added" to the console 
        response.redirect('/')                              // Refresh index.ejs to show the new thing that was added
    })
    .catch(error => console.error(error))                   // If things didn't go well, catch the error and print to the console.
})

/*  What happens when we mark an item complete?
    Line 78: When an item is clicked on the frontend, 
        Line 79-80: update the status of completed from false to true
        Line 83: subtracts the item from "itemsLeft" total
    Line 88-89: Then, log the items that were completed to the console. Also, return json response of "Marked Completed"
    Line 91: catch any errors and log them to the console
    
*/
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false                                       
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

/*  What if you maked something complete on accident?
    Line 99: if the user clicks a completed item again on the frontend,
        Line 102: sets the completed status back from true to false   
*/
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
        console.log('Marked Complete')                  // Console logs "Marked Complete"
        response.json('Marked Complete')                // Sends json response "Marked complete"
    })
    .catch(error => console.error(error))               // Throws an error and logs it to console if something goes wrong

})

/*  Now we want to remove items from the todo list via the trashcan icon
    Line 122.a: Go to your collection 'todos'
    Line 122.b: After ".deleteOne()..." - Uses the deleteOne method to find the item that matches what the user clicked on the frontend

*/
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {                                   // Assuming this went ok...
        console.log('Todo Deleted')                     // Console log "Todo Deleted"
        response.json('Todo Deleted')                   // Send json response "Todo Deleted" to the fetch in main.js
    })
    .catch(error => console.error(error))               // Catch and console log any errors

})

/*
    Let's tell our server to listen for connections on the PORT we specified as a cont earlier 
    (OR process.env.PORT will tell the server to listen on the port of the app)
*/
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)       // Console log the port number the server is running on
})