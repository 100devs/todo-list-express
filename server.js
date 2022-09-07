// enables the express npm
const express = require('express')

// just a shortcut for express
const app = express()

// enables mongo connection
const MongoClient = require('mongodb').MongoClient

// variable for the port
const PORT = 2121

// enables .env use and process.env shortcuts
require('dotenv').config()


// Declare variables relevant for mongodb
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// This is the connection to mongo db.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
// This allows use of ejs for the templates.
app.set('view engine', 'ejs')

// This enables access to the public folder for assets
app.use(express.static('public'))

// This middleware parses the req.body and can return any type as extended is true.
app.use(express.urlencoded({ extended: true }))

// This middleware parses the req.body from JSON
app.use(express.json())


// This express handler receives "/" requests when you first visit the site. 

app.get('/',async (request, response)=>{

	// This mongodb search returns all "todos" entries
    const todoItems = await db.collection('todos').find().toArray()
    
  // This mongodb search counts the number of incomplete todos
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    
  // This render response sends the now modified ejs to the user
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    
    
  // This legacy code is replaced by the code above
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})


// This express handler deals with CREATE requests sent to the "/addTodo" route
app.post('/addTodo', (request, response) => {

	// insertOne - Creates a new document
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        
    // refreshes the page with the new info updated
        response.redirect('/')
    })
    
    // handles any errors returned
    .catch(error => console.error(error))
})



	
	// This express handler updates the "todos" record with "complete" changing the record in the db
app.put('/markComplete', (request, response) => {

	// updateOne - changes the target document.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        
      // $set with a json query will update the document as required.
        $set: {
            completed: true
          }
    },{
    
    //  upsert is set to false because we don't want to create a new one
    // sort with a -1 sorts in a descending order.
        sort: {_id: -1},
        upsert: false
    })
    
    // report progress to console
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    
    // return error if needed.
    .catch(error => console.error(error))

})



		// This express handler deals with "/markUncomplete" router requests
app.put('/markUnComplete', (request, response) => {

	// changes the target document
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        
        // change completed to false
        $set: {
            completed: false
          }
    },{
    
    // Sort descending and don't create a new one
        sort: {_id: -1},
        upsert: false
    })
    
    // return complete to the console
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    
    // handle errors if needed
    .catch(error => console.error(error))

})


	// This express handler deals with "/deleteItem" router requests
app.delete('/deleteItem', (request, response) => {

	// Target the document for deletion
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    
    // return status to console
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    
    // catch error if needed
    .catch(error => console.error(error))

})


	// This express method starts the server listening.
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})