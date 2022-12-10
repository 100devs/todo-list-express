// express is used for our server
const express = require('express') 
// initiate app using the express constructor
const app = express() 
// mongoDB is used
const MongoClient = require('mongodb').MongoClient 
// fallback port
const PORT = 2121 
// using dotenv for our config file. Keep private info off of GIT
require('dotenv').config() 

// create some variables to use for our database
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo' //name of the collection for our database

// connect to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
		// once connected log connection status
        console.log(`Connected to ${dbName} Database`)
		// assign the reference to the connected DB
        db = client.db(dbName)
    })

// set the view engine to ejs
app.set('view engine', 'ejs') 
// use express' built in public directory for default client side css/html/js
app.use(express.static('public'))
// urlencoded parses incoming requests
app.use(express.urlencoded({ extended: true }))
// parses incoming requests for json type requests
app.use(express.json())


// exactly like a click event // a git request to the database
app.get('/',async (request, response)=>{ 
	// go to the database // find all the documents in the collection // and turn it into an array
    const todoItems = await db.collection('todos').find().toArray() 
	// go to the database // find all the items that's not completed // turn it into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) 
	// renders the view index.ejs and send the ejs the following items todoItems and itemLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) 

	// alternative method using .then instead of async/await
		// db.collection('todos').find().toArray()
		// .then(data => {
		//     db.collection('todos').countDocuments({completed: false})
		//     .then(itemsLeft => {
		//         response.render('index.ejs', { items: data, left: itemsLeft })
		//     })
		// })
		// .catch(error => console.error(error))
})

// a git request to the database specifically a post request // '/addTodo' has to be the exact as the form on ejs
app.post('/addTodo', (request, response) => { 
	// insert a new document into the database // a new todoItem // set as not completed 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
	// after the request this is the result
    .then(result => { 
		// logs 'Todo Added' to the console
        console.log('Todo Added') 
		// redirects back to the main route and triggers a refresh 
        response.redirect('/') 
    })
	// an error if request doesn't go through
    .catch(error => console.error(error)) 
})

// a git request to the database to mark the item complete
app.put('/markComplete', (request, response) => { 
	// updates the document in the database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ 
        $set: {
			// set the document completed property to true
            completed: true 
          }
    },{
		// sorts the collection in ascending order by their id that was created on mongodb
        sort: {_id: -1}, 
		// creates the item if it doesn't exist when set to true
        upsert: false
    })
	// after the request this is the result
    .then(result => { 
		// console logs 'Marked Complete'
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
	// an error if request doesn't go through
    .catch(error => console.error(error)) 

})

// a git request to the database to mark the item UnComplete
app.put('/markUnComplete', (request, response) => {
	// updates the document in the database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
			// changed completed state to false
            completed: false 
          }
    },{
		// sorts the collection in ascending order by their id that was created on mongodb
        sort: {_id: -1}, 
		// creates the item if it doesn't exist when set to true
        upsert: false
    })
	// after the request this is the result
    .then(result => { 
		// logs 'Marked Complete' in the console
        console.log('Marked Complete') 
		// marked complete on the json
        response.json('Marked Complete') 
    })
	// an error if request doesn't go through
    .catch(error => console.error(error)) 

})
// delete request to the db 
app.delete('/deleteItem', (request, response) => { 
	// removes a document from the body
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) 
	// after the request this is the result
    .then(result => { 
		// logs 'Todo Deleted' to the console
        console.log('Todo Deleted') 
		// deleted json
        response.json('Todo Deleted') 
    })
	// an error if request doesn't go through
    .catch(error => console.error(error)) 

})

// either use the local port or the port the server uses
app.listen(process.env.PORT || PORT, ()=>{ 
	// console logs which port is running on 
    console.log(`Server running on port ${PORT}`) 
})