//create variable for express framework
const express = require('express')
//create variable for express method
const app = express()
//create variable for mongodb
const MongoClient = require('mongodb').MongoClient
//variable that contains the port the server will be hosted on
const PORT = 2121
//allows use of .env files to store private info
require('dotenv').config()

//variables for database, connectiong string, and specific db
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to to the db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //confirms connection in console
        console.log(`Connected to ${dbName} Database`)
        //set db variable to the mongodb response
        db = client.db(dbName)
    })

//middleware
//express will use ejs as html
app.set('view engine', 'ejs')
//tells express where to find static files such as css
app.use(express.static('public'))
//tells express to parse url links
app.use(express.urlencoded({ extended: true }))
//allows express to use incoming json files
app.use(express.json())

//read function, will render the current mongodb data with ejs
app.get('/',async (request, response)=>{
    //have function wait until the proper collection is found, then converts documents into an array
    const todoItems = await db.collection('todos').find().toArray()
    //fxn waits for response that contians the count of documents in collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //render the response from mongodb in ejs on the page
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

//update fxn, will add new data to the collection as a document
app.post('/addTodo', (request, response) => {
    //mongodb method to create a new document with the info from the front end input
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //confirm that info was added in console
    .then(result => {
        console.log('Todo Added')
        //change root from /addTodo back to main page
        response.redirect('/')
    })
    //log any errors to console
    .catch(error => console.error(error))
})

//update fxn, allows user to make changes to existing documents
app.put('/markComplete', (request, response) => {
    //mongodb method to make changes to a specific document
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //change value of key=completed to true
        $set: {
            completed: true
          }
    },{
        //prevents a new document from being created if one is not found
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        //confirm that info was added in console
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //log any errors to console
    .catch(error => console.error(error))

})
//update fxn, allows users to make changes to existing documents
app.put('/markUnComplete', (request, response) => {
    //mongo db method to make changes to a specific doc
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //change value of key=completed to false
        $set: {
            completed: false
          }
    },{
        //prevent a new doc from being created if one is not found
        sort: {_id: -1},
        upsert: false
    })
    //confirm that info was added in console
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //log any erros
    .catch(error => console.error(error))

})

//delete fxn, allows users to remove a document from the db
app.delete('/deleteItem', (request, response) => {
    //db method to remove a specific document
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //confirm document was deleted in console
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //log any errors
    .catch(error => console.error(error))

})

//tells express which server to listen for reqs on
//if PORT isnt specified by the host(.env file), use hardcoded PORT constant 
app.listen(process.env.PORT || PORT, ()=>{
    //confirm server is running in console
    console.log(`Server running on port ${PORT}`)
})