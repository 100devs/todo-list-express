//allows the use of express
const express = require('express')
// assigns the instance of express to app variable
const app = express()
// allows us to use the mongodb package
const MongoClient = require('mongodb').MongoClient
// sets PORT to 2121, allows us to go to localhost:2121
const PORT = 2121
// allows us to use environment variables in our app
require('dotenv').config()

// declares variable db
let db,
// assigns the environment variable to dbConnection Str
    dbConnectionStr = process.env.DB_STRING,
    // sets the name of our db to 'todo
    dbName = 'todo'

// connects the db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // if connection is successful, we pass the client information
    .then(client => {
        // console.log connected to todo database using teplate literal
        console.log(`Connected to ${dbName} Database`)
        // assigns the unassigned variable to a client method
        db = client.db(dbName)
        // closing of then block
    })
    
// sets ejs to default render method
app.set('view engine', 'ejs')
// sets the location of static files
app.use(express.static('public'))
//tells express to decode and encode urls
app.use(express.urlencoded({ extended: true }))
// allows the parsing of json from requests
app.use(express.json())

//a get method when root route gets a GET request
app.get('/',async (request, response)=>{
    //  finds all documents, turns them into an array and assigns todoItems variable
    const todoItems = await db.collection('todos').find().toArray()
    // counts all documents that have the key value of completed: false, assigns to itemsLeft 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // renders the index.ejs file and sends todoItems and itemsLeft variables
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //non async way to do above code
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//sets post method for /addTodo route
app.post('/addTodo', (request, response) => {
    // inserts a document into the db with thing and completed keys
    // value of thing key comes from the request body sent from client side
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // if insert is successful then will run
    .then(result => {
        //console.log todo added
        console.log('Todo Added')
        // will redirect user back to root route
        response.redirect('/')
    })
    // if unsuccessful, console.log error
    .catch(error => console.error(error))
    // end of post method
})

// sets put / update method for /markComplete route
app.put('/markComplete', (request, response) => {
    // updates a document based on if the thing key has the value of the req body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // sets the completed key to true on the document found
        $set: {
            completed: true
          }
    },{
        // move document to the end of the array
        sort: {_id: -1},
        // stops insert of document if not found
        upsert: false
    })
    // if successful then runs
    .then(result => {
        // console.log marked complete
        console.log('Marked Complete')
        // respond with json marked complete
        response.json('Marked Complete')
        // end of then
    }) 
    // if unsuccessful, catch runs and console.logs error
    .catch(error => console.error(error))
// end of put method to /markComplete
})

// sets put / update method for /markUnComplete route
app.put('/markComplete', (request, response) => {
    // updates a document based on if the thing key has the value of the req body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // sets the completed key to false on the document found
        $set: {
            completed: false
          }
    },{
        // move document to the end of the array
        sort: {_id: -1},
        // stops insert of document if not found
        upsert: false
    })
    // if successful then runs
    .then(result => {
        // console.log marked complete
        console.log('Marked Complete')
        // respond with json marked complete
        response.json('Marked Complete')
        // end of then
    }) 
    // if unsuccessful, catch runs and console.logs error
    .catch(error => console.error(error))
// end of put method to /markComplete
})


// set delete method for the /deleteItem route
app.delete('/deleteItem', (request, response) => {
    //deletes a document based on if the thing key has the value of the req body 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // if document is found
    .then(result => {
        // console.log todo deleted
        console.log('Todo Deleted')
        // respond with json todo deleted
        response.json('Todo Deleted')
        // end of then block
    })
    // if document is not found console.log error
    .catch(error => console.error(error))
// end of catch block
})
// if there is a port in .env it will use that, else it will use the port defined above
app.listen(process.env.PORT || PORT, ()=>{
    //console.log server running on port...
    console.log(`Server running on port ${PORT}`)
    // end of listen method
})