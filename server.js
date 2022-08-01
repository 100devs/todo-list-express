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

//* middleware
//* passing methods to express
app.set('view engine', 'ejs') //*! setting ejs as the view to be rendered
app.use(express.static('public')) //*! passing to public to express.static and telling express to use it
app.use(express.urlencoded({ extended: true })) //*! passing true to express.urlencoded and telling express to use it
app.use(express.json()) //*! passing the json method to express

//* @desc Fetch all todos
//* @route GET /api
//* @access Public
app.get('/', async (request, response) => {
	//! get request to the root, passes req and res to the async function
	const todoItems = await db.collection('todos').find().toArray() //*! creates a variable that awaits the response from the db of all todos as an array

	const itemsLeft = await db //! assigns a variable
		.collection('todos') //! sets the value of the variable to the db collection todos
		.countDocuments({ completed: false }) //*! counts the todos and assigns the variable to hold the Number value of todos that are not completed

	response.render('index.ejs', { items: todoItems, left: itemsLeft }) //*! the response of the api call is to render ejs todoItmes and itemsLeft

	//*! grabs the todo data from the db and feeds it to be rendered based on completed or not - this does the same as the individual await variables and response.render above
	db.collection('todos') //! connects to the todos collection in the db
		.find() //! grabs all of the todo items
		.toArray() //! make an array out of todo items
		.then((data) => {
			//! passes the todo collection as data
			db.collection('todos') //! hits the db for all items in the todo collection
				.countDocuments({ completed: false }) //! counts the collection items that meet the criteria of completed: false
				.then((itemsLeft) => {
					//! once the server has done the above, do this, and it passes itemsLeft as todos that are not completed
					response.render('index.ejs', { items: data, left: itemsLeft }) //! renders the full list of items and the itemsLeft via EJS
				}) //! close the then method
		}) //! close the then method
		.catch((error) => console.error(error)) //! catch any errors and show them in the console
}) //! closes the get request to the root

//* @desc add todo to db
//* @route POST /api/addTodo
//* @access Public
//! post request to the addTodo route
app.post('/addTodo', (request, response) => {
	//! post request the /addToDo route, passes req and res to the request
	db.collection('todos') //! calls the database collection named todos
		.insertOne({ thing: request.body.todoItem, completed: false }) //! adds an individual incomplete todo to the db
		.then((result) => {
			//! what to do after insertingOne
			console.log('Todo Added') //! log the string to the console
			response.redirect('/') //! redirect to the root as a response
		})
		.catch((error) => console.error(error)) //! catch any errors and show them in the console
}) //! close the post request

//* @desc update the db that a todo is completed
//* @route /api/markComplete
//* @access Public
//! put request the markComplete route
app.put('/markComplete', (request, response) => {
	//! put request on the markComplete route, passing req and res to the server response
	db.collection('todos') //! calls the database collection todos
		.updateOne(
			//! calls the updateOne function which updates an individual item in the todos collection
			{ thing: request.body.itemFromJS }, //! looks for a db match to the item passed into the function
			{
				$set: {
					completed: true, //! sets the status of the item to completed true
				},
			},
			{
				sort: { _id: -1 }, //! sorts the item to be the last item on the list
				upsert: false, //! tells the server to not insert the item if it is not already present in the db
			}
		)
		.then((result) => {
			//! if the put request was successfull, do these things
			console.log('Marked Complete') //! logs the string marked complete to the console
			response.json('Marked Complete') //! sends a json response of marked complete to the function
		}) //! closes the then
		.catch((error) => console.error(error)) //! catches any errors and displays them in the conosle
}) //! closes put request

//* @desc update the db that a todo is no longer complete
//* @route /api/markUnComplete
//* @access Public
//! put request to the markUnComplete route - does the opposite of the markComplete
app.put('/markUnComplete', (request, response) => {
	//! put request on the markComplete route, passing req and res to the server response
	db.collection('todos') //! hits the db for the todos collection
		.updateOne(
			//! calls the update one function
			{ thing: request.body.itemFromJS }, //! sets thing to the response of the itemFromJS - tells the db which thing to update
			{
				$set: {
					completed: false, //! tells the server that the thing is not completed
				},
			},
			{
				sort: { _id: -1 }, //! sorts the item to be last in the list of things
				upsert: false, //! tells the server not to insert if the thing does not already exist
			}
		)
		.then((result) => {
			//! if the put request was success, do send this back and di these things next
			console.log('Marked Complete') //! logs the string marked complete to the console
			response.json('Marked Complete') //! sends a json response containing the string marked complete back to the caller
		})
		.catch((error) => console.error(error)) //! catch errors and show them in the console
}) //! close the put request to this route

//* @desc remove todo from the db
//* @route /api/deleteItem
//* @access Public
//! delete request to the deleteItem route
app.delete('/deleteItem', (request, response) => {
	//! calls a delete request on the deleteItem route, passing req and res
	db.collection('todos') //! hits the db for the todos collection
		.deleteOne({ thing: request.body.itemFromJS }) //! tells the db which thing to delete
		.then((result) => {
			//! once the item is deleted send this back and do this stuff
			console.log('Todo Deleted') //! logs the string todo deleted to the console
			response.json('Todo Deleted') //! sends a json response of the string todo deleted back to the caller
		}) //! close the response
		.catch((error) => console.error(error)) //! any errors get caught and bought
}) //! close the delete request

//*!using an enviromental variable and an env file, this tells express what port to listen for the server on and then console logs the string + the variable
app.listen(process.env.PORT || PORT, () => {
	//! tells the server where to look/listen for an open port - either the env process or the PORT variable
	console.log(`Server running on port ${PORT}`) //! once the listen method
})
