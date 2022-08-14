// Express is imported here...
const express = require('express')
// Then instantiated here.
const app = express()
// MongoDB is imported here.
const MongoClient = require('mongodb').MongoClient
// This will be the port to use for the server.
const PORT = 2121
// This allows us to retrieve any environment variables we need.
require('dotenv').config()

// The database connection string is accessed from the environment variables (encapsulation for security).
let db = null
const dbConnectionString = process.env.DB_STRING
const dbName = 'todo'

// The database connection is created here.
MongoClient.connect(dbConnectionString, { useUnifiedTopology: true })
    .then(client => {
        // Once the client is connected, the database name is console logged.
        console.log(`Connected to ${dbName} Database`)
        // The database connection is stored in the db variable.
        db = client.db(dbName)
    })

// Here we are establishing our middleware to use with Express.
// First we'll use ejs as the view engine, for server-side rendering of pages.
app.set('view engine', 'ejs')
// Next, to be able to serve static files without needing to setup routes for every file,
// we'll designate the public directory as the static folder.
app.use(express.static('public'))
// This will allow us to parse the body of the request as JSON.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Handles home/root page get requests.
app.get('/',async (request, response)=>{
    // The database is queried for all items and converted to an array.
    const todoItems = db.collection('todos').find().toArray()
    // Only return the items that the user hasn't deleted.
    const notDeleted = await todoItems.then(items => {
        return items.filter(item =>  item.softDeleted === false)
    })
    // Rather than making a second database query, we can figure out the
    // amount of remaining to do items (not marked completed) from our first query above.
    const itemsLeft = notDeleted.filter(item => item.completed === false).length
    // We will serve an ejs render of index.ejs as the response, passing in our todo items and uncompleted count.
    response.render('index.ejs', { items: notDeleted, left: itemsLeft })
})

// Handles post requests to /addTodo endpoint.
app.post('/addTodo', (request, response) => {
    // Database query to insert one document into the todos collection.
    // The inserted "thing" will be the todoItem located in the request body.
    db.collection('todos').insertOne({
        thing: request.body.todoItem,
        completed: false,
        softDeleted: false
    })
    .then(result => {
        // After the insert, we are notified in the console and redirected back to the home page to display updated data.
        console.log('Todo Added')
        response.redirect('/')
    })
    // Any errors during the database query request are console logged.
    .catch(error => console.error(error))
})

// Handles put/edit requests to /markComplete endpoint. This style looks more like RPC.
app.put('/markComplete', async (request, response) => {
    const requestedItem = request.body.itemFromJS
    try {
        // Database query to update one document in the todos collection.
        // The query will be the itemFromJS within the request body,
        // where we will set "completed" to true for this document,
        // sort the documents by their _id in descending order,
        // and no new document will be inserted if the queried document does not exist.
        const updateResult = await db.collection('todos').updateOne(
            { thing: requestedItem },
            { $set: { completed: true } },
            { sort: { _id: -1 }, upsert: false }
        )
        const resultMessage = updateResult.modifiedCount >= 1 ? 'Todo Marked Complete' : 'Todo Not Found'
        console.log(resultMessage)
        response.json(resultMessage)
    }
    catch (error) {
        // If the database query fails, an error is console logged server-side.
        // Probably need to let the client know as well.
        console.error(error)
        response.json(`An error occurred when trying to update ${requestedItem}..`)
    }
})

// This functionality is identical to the /markComplete endpoint above, but it is for marking items as incomplete.
// Because the difference is one line, this should probably be refactored into a single endpoint.
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
    .catch(error => console.error(error))

})

// An endpoint for handling delete requests, set to a unique "/deleteTodo" endpoint.
// This should probably be refactored into a single endpoint.
app.delete('/deleteItem', async (request, response) => {
    const requestedItem = request.body.itemFromJS
    try {
        const updateResult = await db.collection('todos').updateOne(
            { thing: requestedItem },
            { $set: { softDeleted: true } },
            { sort: { _id: -1 }, upsert: false }
        )
        const resultMessage = updateResult.modifiedCount >= 1 ? 'Todo Deleted' : 'Todo Not Found'
        console.log(resultMessage)
        response.json(resultMessage)
    }
    catch (error) {
        console.error(error)
        response.json(`An error occurred when trying to delete ${requestedItem}..`)
    }
})

// Start the express server listening on the given port. Console log a message to let us know the server is up.
// If the environment variables include a PORT property, use that. Otherwise use the default PORT variable
// established within this script.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})