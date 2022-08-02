//importing express into server.js
const express = require('express')
//new instance of express, lets you use "app" instead of writing express over and over
const app = express()
//importing mongoDB so you can connect to Mongo database
const MongoClient = require('mongodb').MongoClient
//defines where you can look at this on your computer
const PORT = 2121
//allows use of .env file
require('dotenv').config()

//declares database variable
let db,
//connects to mongo atlas
    dbConnectionStr = process.env.DB_STRING,
//dbName variable to the database   
    dbName = 'todo'
//connect app to mongoclient
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
       //createse a new db with a name you pass to it
        db = client.db(dbName)
    })
 //sets our view engine to ejs, allows us to use ejs   
app.set('view engine', 'ejs')
//sets up public folder that will serve files to client
app.use(express.static('public'))
//parses incoming request with urlencoded payloads, based on body parser
app.use(express.urlencoded({ extended: true }))
//parses incoming JSON requests and puts the parsed data in request
app.use(express.json())

//defines a GET request at default endpoit
app.get('/',async (request, response)=>{
    //accessing db collection "todos" and finding documents and storing in array
    const todoItems = await db.collection('todos').find().toArray()
    //count documents in database that have false as value for key "completed"
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
   //pass items that are "todoItems" and "itemsLeft"
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

//defined a POST request at /addTodo endpoint, used to create a new doc
app.post('/addTodo', (request, response) => {
    //adds new document to todos collection, todoItem property is pulled from our request body (passed)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //what to do with the above stuff
    .then(result => {
        //console log that todo was added
        console.log('Todo Added')
        //redirects to base endpoint after the document is added
        response.redirect('/')
    })
    //shows the error if there is one
    .catch(error => console.error(error))
})

//defines a PUT request at /markComplete endpoint, used to update item
app.put('/markComplete', (request, response) => {
   //updates a document from the todos collection
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
       //important for ejs because it'll add the completed class to the span
        $set: {
            completed: true
          }
    },{
        //specifies order to display the matching documents
        sort: {_id: -1},
        //if true creates new document if the query does not retrieve any docs
        upsert: false
    })
    //if everything goes well, this is the plan
    .then(result => {
        //console log shows "marked complete"
        console.log('Marked Complete')
        //parses the promise and displays on server console
        response.json('Marked Complete')
    })
    //shows the error in the console 
    .catch(error => console.error(error))

})
//defines a PUT request at /markUnComplete endpoint, used to update item
app.put('/markUnComplete', (request, response) => {
    //updates a document from the todos collection
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
       //takes away completed class from ejs span
        $set: {
            completed: false
          }
    },{
        //specifies order to display the matching docs
        sort: {_id: -1},
        //if true creates document if the query doesn't retrieve any docs
        upsert: false
    })
    //if everything goes well, this is what happens next
    .then(result => {
        //console log shows "marked uncomplete"
        console.log('Marked Uncomplete')
        //parses the promise and displays on server console
        response.json('Marked Uncomplete')
    })
    //shows the error in the console
    .catch(error => console.error(error))

})
//defines a DELETE request at /deleteItem endpoint and used to delete item
app.delete('/deleteItem', (request, response) => {
  //deletes from todos collection
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
   //what the console and server will be alerted when it works
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //what the console will be alerted if there's an error
    .catch(error => console.error(error))

})
//connects app to PORT
app.listen(process.env.PORT || PORT, ()=>{
   //console log will show message if server is running
    console.log(`Server running on port ${PORT}`)
})
