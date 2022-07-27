// ***********************************
// Node Modules & Required Variables
// ***********************************
const express = require('express')  // requiring express module
const app = express()  // creating app variable that instantiates express function
const MongoClient = require('mongodb').MongoClient  // requiring mongoDB and MongoClient object
const PORT = 2121  // setting port number
require('dotenv').config()  // requiring dotenv module to use .env file

// ***********************************
// MongoDB Client Setup 
// ***********************************
// ***** Declaring MongoDB variable names *****
let db, // declaring db var
    dbConnectionStr = process.env.DB_STRING,  // declaring MongoDB connection string and assigning it the .env variable DB_STRING
    dbName = 'todo'  // setting MongoDB database name to 'todo' 

// ***** Connecting to MongoDB *****    
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // .connect method using .env var DB_STRING 
    .then(client => {  // promise chaining when connection returns fullfilled
        console.log(`Connected to ${dbName} Database`) // console logs the connection database name when connected
        db = client.db(dbName)  // Once connected, sets the MongoDB database name to the dbName variable
    })
    
// ***********************************
// Node & Express Middleware
// ***********************************    
app.set('view engine', 'ejs')  // tells JS to use the /views folder and render the front end with EJS.
app.use(express.static('public'))  // tells JS that the front-end content (JS, CSS, Images, etc.) can be found in /public folder
app.use(express.urlencoded({ extended: true }))  // Parses any incoming requests with urlencoded payloads 
app.use(express.json())  // Recognize the incoming Request Object as a JSON Object and puts it into the Response (.body)

// ***********************************
// Node CRUD Operations
// ***********************************

// ***** Defines a GET (read) request from the '/' path *****    
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()  // gets all the items from the DB and saves it as todoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})  // gets the COUNT of incompete items
    response.render('index.ejs', { items: todoItems, left: itemsLeft })  // renders index.ejs file and passes the vars todoItems & itemsLeft
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// ***** Defines a POST (create) request from the '/addTodo' path *****    
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})  // creates a document from the /addTodo form in the index.ejs
    .then(result => {  // promise chaining when document created successfully 
        console.log('Todo Added')  // once submitted (created) - console log 
        response.redirect('/')  // and redirect '/' (refresh page)
    })
    .catch(error => console.error(error)) // promise chaining an Error when document was not created successfully 
})

// ***** Defines a PUT (update) request from the '/markComplete' path *****    
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  // From main.js fetch, find itemFromJS (itemText) in db 
        $set: {
            completed: true //  $set (update) the completed key value to true
          }
    },{
        sort: {_id: -1},  // sort items in order by id
        upsert: false  // if there is no document by itemFromJS (itemText), then add it with the new values
    })
    .then(result => {  // promise chaining when document was updated successfully
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))  // promise chaining when document was NOT updated successfully

})

// ***** Defines a PUT (update) request from the '/markUnComplete' path *****    
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  // From main.js fetch, find itemFromJS (itemText) in db 
        $set: {
            completed: false  //  $set (update) the completed key value to false
          }
    },{
        sort: {_id: -1},  // sort items in order by id
        upsert: false  // if there is no document by itemFromJS (itemText), then add it with the new values
    })
    .then(result => {  // promise chaining when document was updated successfully
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))  // promise chaining when document was NOT updated successfully

})

// ***** Defines a DELETE (delete) request from the '/deleteItem' path *****    
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})  // From main.js fetch, find itemFromJS (itemText) in db and delete the document 
    .then(result => {  // promise chaining when document was deleted successfully
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))  // promise chaining when document was not deleted successfully

})

// ***** Runs the App on a Port *****    
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})