//Enable express framework
const express = require('express')
//Assign express method to an app variable
const app = express()
//Enable mongo database
const MongoClient = require('mongodb').MongoClient
//Assign a constant port variable
const PORT = 2121
//Enable creation of .env file where mongo DB string will be stored 
require('dotenv').config()

//Create variables for a database (db), connection string to a specific database (dbConnectionStr) and the name of the database (dbName)
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//Connect to the database using the database string (returns a promise)
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //Handle the response by logging in connection confirmation to a console
        console.log(`Connected to ${dbName} Database`)
        //Assign the response from the mongoDB to the db 
        db = client.db(dbName)
    })
    
//Set up middleware functions:
//Use express to default html behavior to an ejs file
app.set('view engine', 'ejs')
//Use express to load contents of the public folder to the page
app.use(express.static('public'))
//Use express to parse incoming url links (was previously done by body-parser)
app.use(express.urlencoded({ extended: true }))
//Use express to be able to handle incoming json files
app.use(express.json())

//Get operation (Read in CRUD), this is where we get out front page
app.get('/',async (request, response)=>{
    //Since function was made asynchronous, we wait until the database goes through specified database and finds todos collection, converting all documents into an array. Array gets assigned to a new variable
    const todoItems = await db.collection('todos').find().toArray()
    //We also await database response from the same database-collection that counts how many documents are currently in the specified collection (todos in this case)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Once both operations are completed, we take the response from the database and send both variables as objects to the ejs file so we can render them on the page
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

//Post operation (Create in CRUD), this is how we add new todos to our database collection
app.post('/addTodo', (request, response) => {
    //Using the mongo's method to insert a document, we inset an object with two items in it (thing and completed)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //To make sure it was successful, after we get a response we do a console log
        console.log('Todo Added')
        //We change our route from add to the default "/" which shows us the front page
        response.redirect('/')
    })
    //If there are any errors, they will be console logged
    .catch(error => console.error(error))
})

//Put operation (Update in CRUD), lets us to modify our document in the database collection of todos, in this case we will be marking a todo as complete
app.put('/markComplete', (request, response) => {
    //Using the mongo's method to update a document, we select which item we want to update by accessing the "thing" key using client side JS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //After selecting which item we want to modify, we set the "completed" key to true
        $set: {
            completed: true
          }
    },{
        //In case no document was found, upsert will make sure no new document will be added using this
        sort: {_id: -1},
        upsert: false
    })
    //After we get the response from the database, we console log it and send the response to the client side JS with json
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //If there are any errors, they will be console logged
    .catch(error => console.error(error))

})

//Put operation (Update in CRUD), lets us to modify our document in the database collection of todos, in this case we will be marking a todo as incomplete
app.put('/markUnComplete', (request, response) => {
    //Using mongo's method to update a document, we select which item we want to update by accessing the "thing" key using client side JS
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //After selecting which item we want to modify, we set the "compelted" key to false
        $set: {
            completed: false
          }
    },{
        //In case no document was found, upsert will mmake sure no new document wil be added using this method
        sort: {_id: -1},
        upsert: false
    })
    //After we get a response from the databse, we console log it and send the response to the client side JS with json
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //If there are any errors, they will be console logged
    .catch(error => console.error(error))

})

//Delete operation (Delete in CRUD), lets us to delete a document from the collection in a database
app.delete('/deleteItem', (request, response) => {
    //Using mongo's method to delete a document, we select which item we want to delete by accessing the "thing" key using client side JS
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //After we get a response from the database, we console log it and send the response to the client side JS with json
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //If there are any errors, they will be console logged
    .catch(error => console.error(error))

})

//This express method lets us to bind and listen the connections on the specified host/port
//In case PORT will get specified by another platform (mongodb or heroku), we use process.env.PORT 
app.listen(process.env.PORT || PORT, ()=>{
    //Console log tells us whether we have a server running on a particular port
    console.log(`Server running on port ${PORT}`)
})