// require from package
const express = require('express')

// create an express instance
const app = express()

// require Mongo
const MongoClient = require('mongodb').MongoClient

// set port
const PORT = 2121

// require configuration from env
require('dotenv').config()


// define database varibales 
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// connect to databse
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    }).catch((e) => console.log("Oops, can't connect to database. Check your config or connection");
    
// set up middleware for interface
app.set('view engine', 'ejs')

// use public folder to take assets from
app.use(express.static('public'))
// use middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


// on main page, get all todos for display
app.get('/',async (request, response)=>{
	// get all todos  from collectection and set them in the variable todoItems 
    const todoItems = await db.collection('todos').find().toArray()
	
	// counts all documents that have the key value of completed: false, assigns to itemsLeft 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
	
	// display the result in the view, assign values to variables "items" and "left"
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


// Post a new todo
app.post('/addTodo', (request, response) => {
	// insert one document in the collection, 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
	// if operation is done, show a message in the console
    .then(result => {
        console.log('Todo Added')
		// made a redirect to home page.
        response.redirect('/')
    })
	// on error, display an error message in the console too
    .catch(error => console.error(error))
})

// sets put  method for /markComplete route ( update )
app.put('/markComplete', (request, response) => {
	// update the collection 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
	// options to be modified
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
		// if successful, add a message in the console
        console.log('Marked Complete')
		// return a message from the server 
        response.json('Marked Complete')
    })
	// on error, show a message in the console
    .catch(error => console.error(error))

})
// set put message for /markUncomplete route ( update )
app.put('/markUnComplete', (request, response) => {
	// update one item with data taken from js
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
		// options to be modified
		// sets the completed key to true on the document found
		$set: {
            completed: false
          }
    },{
		// move document to the end of the array
        sort: {_id: -1},
		// stops insert of document if not found
        upsert: false
    })
	// if successful, show a message in the console and send one to the application
    .then(result => {
        console.log('Marked Complete')
		// respond with json
        response.json('Marked Complete')
    })
	// if error, display a message in the console with the error.
    .catch(error => console.error(error))

})

// delete a todo item
app.delete('/deleteItem', (request, response) => {
	// delete an item from js source
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
	// if successful, show a message in the console and send a message back
    .then(result => {
        console.log('Todo Deleted')
		// respond with json
        response.json('Todo Deleted')
    })
	// if error, show a message with the error in the console.
    .catch(error => console.error(error))

})

// Tell the express server to start on PORT number and to listen to request/response on this port
app.listen(process.env.PORT || PORT, ()=>{
	// tell us if the server is running
    console.log(`Server running on port ${PORT}`)
})