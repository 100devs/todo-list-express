const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

// declaring variables for the mongo database
// This need the DB_STRIGN with the password and user from our mongo db in the .env file
// dbName is the name of the database in our mongo project
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connection to the mongo database
// { useUnifiedTopology: true } With useUnifiedTopology , the MongoDB driver will try to find a server to send any given operation to, 
// and keep retrying for serverSelectionTimeoutMS milliseconds. If not set, the MongoDB driver defaults to using 30000 (30 seconds).

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// To setup view engine, you need the write this middleware
app.set('view engine', 'ejs')
// In Express, app.use(express.static()) adds a middleware for serving static files to your Express app.
// The public folder is a express convention
app.use(express.static('public'))
// express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. 
// This method is called as a middleware in your application using the code: app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }))
// express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. 
// This method is called as a middleware in your application using the code: app.use(express.json());
app.use(express.json())


app.get('/',async (request, response)=>{
    //const todoItems = await db.collection('todos').find().toArray()
    //const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //response.render('index.ejs', { items: todoItems, left: itemsLeft })

    // put all documents in an array
     db.collection('todos').find().toArray()
     // Here data is the array result of the promise above
     .then(data => {
        // asking only for documents with completed property equal to false
         db.collection('todos').countDocuments({completed: false})
         .then(itemsLeft => {
            //passing resulting data from the promise into ejs, data is going to be named items
            // rendering ejs with the data passed
             response.render('index.ejs', { items: data, left: itemsLeft })
         })
     })
     // console log the error if it happens
     .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    // inserting into the database the new todo using info from the body request.body, adding property completed false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // if the promise is ok console login result and refreshing the page
        console.log('Todo Added')
        response.redirect('/')
    })
    // console log the error if it happens
    .catch(error => console.error(error))
})


app.put('/markComplete', (request, response) => {
    //searching for the clicked item in the todo list for updating, from function markCompleted
    //this update the first element that match itemFromJS
    //what happens when there are more than one? just update the first
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //changing property completed to true
            completed: true
          }
    },{
        //sorting list by internal id from mongo db
        sort: {_id: -1},
        //setting the option to DO NOT create documents if there are not documents matching the itemFromJS
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    //searching for the clicked item in the todo list for updating, from function markUncompleted
    //this update the first element that match itemFromJS
    //what happens when there are more than one? just update the first
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //changing property completed to false
            completed: false
          }
    },{
        //sorting list by internal id from mongo db
        sort: {_id: -1},
        //setting the option to DO NOT create documents if there are not documents matching the itemFromJS
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    //searching for the clicked item in the todo list for updating, from function deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})