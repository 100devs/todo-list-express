const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//* database variables
let db, //* mongodb
	dbConnectionStr = process.env.DB_STRING, //* mongo connection seceret
	dbName = 'todo' //* database name from mongo

//* connecting to db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
	(client) => {
		console.log(`Connected to ${dbName} Database`)
		db = client.db(dbName)
	}
)

app.set('view engine', 'ejs') //* setting ejs the view
app.use(express.static('public')) //* passing static to express
app.use(express.urlencoded({ extended: true })) //* passing urlencoded to express
app.use(express.json()) //* passing the json method to express

//* @desc Fetch all todos
//* @route GET /api
//* @access Public
app.get('/', async (request, response) => {
	const todoItems = await db.collection('todos').find().toArray() //* creates an array todo itmes from the db called todoItems

	const itemsLeft = await db
		.collection('todos')
		.countDocuments({ completed: false }) //* variable to hold the value of todos that are not completed

	response.render('index.ejs', { items: todoItems, left: itemsLeft }) //* the response of the api call is to render ejs

	//* grabs the todo data from the db and feeds it to be rendered
	db.collection('todos')
		.find()
		.toArray()
		.then((data) => {
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
app.delete('/deleteItem', (request, response) => {
	db.collection('todos')
		.deleteOne({ thing: request.body.itemFromJS })
		.then((result) => {
			console.log('Todo Deleted')
			response.json('Todo Deleted')
		})
		.catch((error) => console.error(error))
})

//* using an env variable, this tells express what port to listen for the server on and then console logs the string + the variable
app.listen(process.env.PORT || PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
