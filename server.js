//Adds required apps for functionality - express, MongoDB, and dotenv to allow for .env file use.
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
//Defines default port for listening in the app.
const PORT = 2121
require('dotenv').config()

//Defines the connection string for connecting to MongoDB in the next step, and pulls the hidden value from the .env file.  dbName defines the database used within the Mongo Atlas database.
let db,
    dbConnectionStr = `mongodb+srv://NothingRemains:KQyu4zPOcoYf3Q1ZIIxW@cluster0.p4igc.mongodb.net/?retryWrites=true&w=majority`
    dbName = 'todo'

//Connects to MongoDB using the connection string defined in the last step. Console logs to confirm connection.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//Sets the view engine to ejs
app.set('view engine', 'ejs')
//Sets the route for serving static files.
app.use(express.static('public'))
//Needed for POST and PUT methods, converts into a readable format (req.body will be unreadable without it and will return undefined).  Extended: true required for extended objects (like objects within objects).
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Gets the root page
app.get('/',async (request, response)=>{
    //Puts the entries in the database into an array called todoItems
    const todoItems = await db.collection('todos').find().toArray()
    //Returns the number of documents in the collection that are not marked as completed.  countDocuments returns number of items that match the query, otherwise if left empty returns total count in the collection.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Tells the page to render using index.ejs, passes in todoItems and itemsLeft as defined above.
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

//Adds an item to the todo list.
app.post('/addTodo', (request, response) => {
    //Inserts a single entry into the todo list, adds it with completed: false tag.  
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //Console logs when a todo is successfully added to the list, then redirects user back to the root page so the page doesn't hang.
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //Error catching if something goes wrong.
    .catch(error => console.error(error))
})

//Updates tasks when they're complete.
app.put('/markComplete', (request, response) => {
    //Update one entry to mark it as finished.  Triggers on click.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        //Sorts the list in descending order.  upsert: false prevents MongoDB from inserting a new document if nothing matches the specified document search.
        sort: {_id: -1},
        upsert: false
    })
    //Console.logs when a task is successfully updated
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//Similar functionality to /markComplete, but removes strikethrough and marks the task as not completed. See /markComplete route for uncommented pieces of code in this section.
app.put('/markUnComplete', (request, response) => {
    //Updates one completed task to incomplete on click.
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

//Deletes a todo list item when the trash can next to them is clicked.
app.delete('/deleteItem', (request, response) => {
    //Specifies the single item to be deleted.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //Console logs on deletion to confirm.
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//Opens a port to listen on - either a port specified in the .env file (or by heroku), or a default port (in this case, 2121) if that does not exist.  Console logs to show that the port has been opened.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})