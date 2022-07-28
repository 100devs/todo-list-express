//Enable express framework so we can use all of its functionality
const express = require('express')
//Creates an express application
const app = express()
//Enable mongo database
const MongoClient = require('mongodb').MongoClient
//This will be the port we use to connect our app
const PORT = 2121
//Enable creation of .env file where sensitive information can be stored and the we can use that in our code
require('dotenv').config()

//Create variables for a database (db), connection string to a specific database and the name of the database we are using
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//Connect to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //This prints a confirmation to a console if we connect to the database
        console.log(`Connected to ${dbName} Database`)
        //Assign the response from the mongoDB to the db 
        db = client.db(dbName)
    })
    
//-- MIDDLEWARES
//Use express to default html behavior to an ejs file
app.set('view engine', 'ejs')
//Tells express to use a folder called 'public' for all our static file
app.use(express.static('public'))
//Use express to parse incoming url links (before we used body-parser)
app.use(express.urlencoded({ extended: true }))
//Use express to be able to handle incoming json data
app.use(express.json())

//-- CRUD
//Get operation (Read), get the homepage
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

//Post operation (Create), this is how we add new todos to our database
app.post('/addTodo', (request, response) => {
    //Using the mongo's method to insert a document, we inset an object with two items in it (thing and completed)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //To make sure it was successful, after we get a response we do a console log
        console.log('Todo Added to the database')
        //We change our route from add to the default "/" (homepage)
        response.redirect('/')
    })
    //If there are any errors, they will printed in the console as an error
    .catch(error => console.error(error))
})

//Put operation (Update), to modify our document in the database collection of todos, in this case we will be marking a todo as complete
app.put('/markComplete', (request, response) => {
    //Using the mongo's method to update a document, we select which item we want to update by passed in the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //After selecting which item we want to modify, we mark it as completed
        $set: {
            completed: true
          }
    },{
        //In case no document was found, upsert will make sure no new document will be added using this
        sort: {_id: -1},
        upsert: false
    })
    //After we get the response from the database, we print it and send the response to the client as json
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //If there are any errors, they will be console logged
    .catch(error => console.error(error))

})

//Put operation (Update), lets us to modify our document in the database collection of todos
app.put('/markUnComplete', (request, response) => {
    //Using mongo's method to update a document
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //After selecting which item we want to modify, we set the completed to false
        $set: {
            completed: false
          }
    },{
        //In case no document was found, upsert will mmake sure no new document wil be added using this method
        sort: {_id: -1},
        upsert: false
    })
    //After we get a response from the databse, we console log it and send the response to the client as json
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //If there are any errors, they will be console logged
    .catch(error => console.error(error))

})

//Delete operation (Delete), lets us to delete a document from the collection in the database
app.delete('/deleteItem', (request, response) => {
    //Using mongo's method to delete a document
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //After we get a response from the database, we console log it and send the response to the client as json
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //If there are any errors, they will be console logged
    .catch(error => console.error(error))

})

//This express method lets us to bind and listen the connections on the specified port
//In case PORT will get specified by another platform (mongodb/heroku), we use process.env.PORT to get that variable from the .env file
app.listen(process.env.PORT || PORT, ()=>{
    //Console log tells us whether we have a server running on a particular port so we know its running and working
    console.log(`Server running on port ${PORT}`)
})