const express = require('express')
// instantiate express by requiring it

const app = express()
// run express function by creating app variable

const MongoClient = require('mongodb').MongoClient
// create MongoClient variable by requiring mongodb and .MongoClient to connect to the server

const PORT = 2121 // create port variable to use throughout file
require('dotenv').config() // dotenv instanciates your hidden keys

let db,
	dbConnectionStr = process.env.DB_STRING,
	dbName = 'todo'
// Create 3 variables for the database, env string, and name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
	(client) => {
		console.log(`Connected to ${dbName} Database`)
		db = client.db(dbName)
	}
)
//Connect to the MongoClient using the string, pass an object to utilize a promise. create the Todo database in MongoDB

app.set('view engine', 'ejs')
// tells Express that we're using the EJS template

app.use(express.static('public'))
// Serves static files

app.use(express.urlencoded({ extended: true }))
// urlencoded method extracts data with body-parser from the todo list and adds them to the body property of the request object

app.use(express.json())
// Middleware function parses JSON requests and puts it in the request body.

app.get('/', async (request, response) => {
	// GET request. first argument is the endpoint & second argument is the callback
	const todoItems = await db.collection('todos').find().toArray() // await -> waiting from response from server and returns an array of key value pairs
	const itemsLeft = await db
		.collection('todos')
		.countDocuments({ completed: false }) // countDocuments returns a count of documents (individual todos)
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

app.post('/addTodo', (request, response) => {
	// CREATE request ->addTodo is the endpoint
	// the callback inserts one document into the todos collection with 2 attributes, thing and completed and then redirects you to the main page.
	db.collection('todos')
		.insertOne({ thing: request.body.todoItem, completed: false })
		.then((result) => {
			console.log('Todo Added')
			response.redirect('/')
		})
		.catch((error) => console.error(error))
})

app.put('/markComplete', (request, response) => {
	// Update todo item ->
	// updateOne finds first document that matches the filter
	// $set replaces the completed value
	// upsert -> if field doesnt exist it will insert false
	// sort -1 descending order
	// first obj -> selection criteria for the update
	// second obj -> modifications to apply
	// third obj -> if item is not found DO NOT insert a new document
	db.collection('todos')
		.updateOne(
			{ thing: request.body.itemFromJS },
			{
				$set: {
					completed: true,
				},
			},
			{
				sort: { _id: -1 },
				upsert: false,
			}
		)
		.then((result) => {
			console.log('Marked Complete')
			response.json('Marked Complete')
		})
		.catch((error) => console.error(error))
})

app.put('/markUnComplete', (request, response) => {
	// same thing as the above PUT, just marked false.
	db.collection('todos')
		.updateOne(
			{ thing: request.body.itemFromJS },
			{
				$set: {
					completed: false,
				},
			},
			{
				sort: { _id: -1 },
				upsert: false,
			}
		)
		.then((result) => {
			console.log('Marked Complete')
			response.json('Marked Complete')
		})
		.catch((error) => console.error(error))
})

app.delete('/deleteItem', (request, response) => {
	// DELETE HTTP method -> deleteOne method finds the item and then deletes it.
	db.collection('todos')
		.deleteOne({ thing: request.body.itemFromJS })
		.then((result) => {
			console.log('Todo Deleted')
			response.json('Todo Deleted')
		})
		.catch((error) => console.error(error))
})

app.listen(process.env.PORT || PORT, () => {
	// connects to the port and shows that the app is live.
	console.log(`Server running on port ${PORT}`)
})
