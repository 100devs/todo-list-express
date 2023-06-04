// load the express module
const express = require('express')
// lets us call express methods in an easy to read/write varible
const app = express() 
// let's us use database methods
const MongoClient = require('mongodb').MongoClient 
// Tells your server what port to listen on. Useful when working locally. Heroku will give us an environment variable
const PORT = 2121 
// loads environment variables such as DB_STRING or other info we want to keep secure into process.env
require('dotenv').config() 

/* lines 8-16 hook us up to MongoDB and the correct collection */
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo' //collection name

//connects us to MongoDB through our dbConnectionString stored in our dotenv file
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) 
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //database name
    })
    
// allows us to render the page using EJS template
app.set('view engine', 'ejs')
//middleware for serving static files via HTTP
app.use(express.static('public'))
//middleware used to recognize the incoming request object as strings or arrays
app.use(express.urlencoded({ extended: true })) 
// middleware puts the parsed data from the incoming JSON request into req.body
app.use(express.json()) 

/* our GET method, that grabs all of our TODO items and the number of items left */
app.get('/',async (request, response)=>{
    //storing the TODO items in an array
    const todoItems = await db.collection('todos').find().toArray() 
    //counting the number of uncompleted items
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) 
    //rendering this data with our EJS template
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) 

    // comment below demonstrates async await flexing on promise chaining

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

/* Our POST method, which adds a TODO item to the database collection */
app.post('/addTodo', (request, response) => {
    //literally grabs the data from our form and puts it into request.body.todoItem, and sets completed to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) 
    //if successful
    .then(result => { 
        //log Todo added
        console.log('Todo Added')
        //and redirect to the home page 
        response.redirect('/') 
    })
    .catch(error => console.error(error)) //throws error if unsuccessful
})

/* This updates the TODO items in our databse collection by marking them complete */
app.put('/markComplete', (request, response) => {
    //finds the matching TODO item to update
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ 
        // mongosh set method for updating a doc
        $set: {
            // sets completed to true
            completed: true 
          }
    },{
        //sort descending or from first to last
        sort: {_id: -1},
        //does not insert a new document into the collection 
        upsert: false 
    })
    // if successful
    .then(result => { 
        //log marked complete
        console.log('Marked Complete') 
        // server responds with Marked Complete
        response.json('Marked Complete') 
    })
    .catch(error => console.error(error))

})

/* basically the opposite of markComplete */
app.put('/markUnComplete', (request, response) => {
    //find the matching TODO item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //set completed to false
        $set: {
            completed: false
          }
    },{// sort the docs from first to last
        sort: {_id: -1},
        // do not insert a new document to the collection
        upsert: false
    })
    // if successful
    .then(result => { 
        //log Marked uncomplete
        console.log('Marked Uncomplete')
        //server responds to client-side with Marked Uncomplete
        response.json('Marked Uncomplete')
    })
    .catch(error => console.error(error))

})

/* this is our DELETE method, it removes a TODO item from the database */
app.delete('/deleteItem', (request, response) => {
    //find the correct TODO item in the database and delete it
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // if successful
    .then(result => { 
        //log Todo Deleted
        console.log('Todo Deleted') 
        //server responds to client with Todo Deleted
        response.json('Todo Deleted') 
    })
    .catch(error => console.error(error))

})

//tells our server what port to listen on, either Heroku's or the PORT variable we declared earlier
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) //logs a confirmation message
})