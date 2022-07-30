const express = require('express') //! importing express
const app = express() //! creating a variable app that holds the value of the express import
const MongoClient = require('mongodb').MongoClient //! importing mongoClient
const PORT = 2121 //! create a variable that holds the value of the port the server will run on
require('dotenv').config() //! imports dotenv to use env variables

//* database variables
let db, //! variable declaration
	dbConnectionStr = process.env.DB_STRING, //! creates a variable wiht the value of our mongo connection url seceret
	dbName = 'todo' //! creates a variable with the value of the database name from mongo

//* connecting to the db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
	//! use the MongoClient.connect method, passing the arg of our mongodb url, to connect to our db
	(client) => {
		//! once connected to db, pass data through the client
		console.log(`Connected to ${dbName} Database`) //! log the string and variable via template literal to the console
		db = client.db(dbName) //! sets a value to the variable declared previoulsl in line 8
	} //! closes the action ran by connecting to the db
) //! closes the db connection method

//* passing methods to express
app.set('view engine', 'ejs') //*! setting ejs as the view to be rendered
app.use(express.static('public')) //*! passing to public to express.static and telling express to use it
app.use(express.urlencoded({ extended: true })) //*! passing true to express.urlencoded and telling express to use it
app.use(express.json()) //*! passing the json method to express

//* @desc Fetch all todos
//* @route GET /api
//* @access Public
app.get('/', async (request, response) => {
	const todoItems = await db.collection('todos').find().toArray() //*! creates an array todo itmes from the db called todoItems

	const itemsLeft = await db
		.collection('todos')
		.countDocuments({ completed: false }) //*! variable to hold the value of todos that are not completed

	response.render('index.ejs', { items: todoItems, left: itemsLeft }) //*! the response of the api call is to render ejs

	//*! grabs the todo data from the db and feeds it to be rendered based on completed or not
	db.collection('todos') //! connects to the todos collection in the db
		.find() //! grabs all of the todo items
		.toArray() //! make an array out of todo items
		.then((data) => {
			//! send it to server
			db.collection('todos')
				.countDocuments({ completed: false })
				.then((itemsLeft) => {
					response.render('index.ejs', { items: data, left: itemsLeft })
				})
		})
		.catch((error) => console.error(error))
})

//* @desc add todo to db
//* @route POST /api/addTodo
//* @access Public
//! post request to the addTodo route
app.post('/addTodo', (request, response) => {
	db.collection('todos')
		.insertOne({ thing: request.body.todoItem, completed: false })
		.then((result) => {
			console.log('Todo Added')
			response.redirect('/')
		})
		.catch((error) => console.error(error))
})

//* @desc update the db that a todo is completed
//* @route /api/markComplete
//* @access Public
//! put request the markComplete route
app.put('/markComplete', (request, response) => {
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

//* @desc update the db that a todo is no longer complete
//* @route /api/markUnComplete
//* @access Public
//! put request to the markUnComplete route
app.put('/markUnComplete', (request, response) => {
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

//* @desc remove todo from the db
//* @route /api/deleteItem
//* @access Public
//! delete request to the deleteItem route
app.delete('/deleteItem', (request, response) => {
	db.collection('todos')
		.deleteOne({ thing: request.body.itemFromJS })
		.then((result) => {
			console.log('Todo Deleted')
			response.json('Todo Deleted')
		})
		.catch((error) => console.error(error))
})

//*!using an env variable, this tells express what port to listen for the server on and then console logs the string + the variable
app.listen(process.env.PORT || PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
