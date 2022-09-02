const express = require('express'); //assigns express package to variable 'express'
const app = express(); //assigns 'app' the name to call express module
const MongoClient = require('mongodb').MongoClient; //assigns MongoDb connection module to variable name
const PORT = 2121; //assigns a port value for the server to run on
require('dotenv').config(); //calls the dotenv module to allow secrets in .env

let db, //declares variable named db
	dbConnectionStr = process.env.DB_STRING, //assigns Mongo url from .env to variable
	dbName = 'todo'; //directs mongo to use/create a db called 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //calls MongoClient using connection
	.then((client) => {
		console.log(`Connected to ${dbName} Database`); //logs when connection promise resolves
		db = client.db(dbName); //tells MongoDb the database name
	});

app.set('view engine', 'ejs'); //tells express to use ejs rendering in views
app.use(express.static('public')); //tells express to keep all files in public static
app.use(express.urlencoded({ extended: true })); //this line and the next allow express to access
app.use(express.json()); //the req.body sent to server. replaced body-parser

app.get('/', async (request, response) => {
	//tells express to what to do when a get request is    recieved on the '/' route.
	const todoItems = await db.collection('todos').find().toArray(); //tells Mongo to go to the db 'todos', find all items, add them to an array, which is assign to var todoItems
	const itemsLeft = await db
		.collection('todos')
		.countDocuments({ completed: false }); //tells Mongo to go to db 'todos', and count how many items have the value 'false' for the property 'completed'
	response.render('index.ejs', { items: todoItems, left: itemsLeft }); //plugs the values of todoitems and itemsLeft into the ejs document, which is then sent as html to the client

	// db.collection('todos').find().toArray()
	// .then(data => {
	//     db.collection('todos').countDocuments({completed: false})
	//     .then(itemsLeft => {
	//         response.render('index.ejs', { items: data, left: itemsLeft })
	//     })
	// })
	// .catch(error => console.error(error))
});

app.post('/addTodo', (request, response) => {
	//tells express what to do when a post request is recieved on the '/addTodo' route
	db.collection('todos')
		.insertOne({ thing: request.body.todoItem, completed: false }) // tells Mongo to go to db 'todos' and create a new item with the input from the req.body and the completed property set to false
		.then((result) => {
			console.log('Todo Added'); //server-side log that a new todo was created in db
			response.redirect('/'); //refreshs the page client-side to see the newly add todo
		})
		.catch((error) => console.error(error)); //if there is an error it will log server-side
});

app.put('/markComplete', (request, response) => {
	//tells express what to do when a PUt request is recived on the /markComplete route
	db.collection('todos') //tells Mongo to go to database 'todos'
		.updateOne(
			{ thing: request.body.itemFromJS }, //tells Mongo to find the item that was clicked on and sent in the req.body
			{
				$set: {
					//tells Mongo to set that item's completed property to true
					completed: true,
				},
			},
			{
				sort: { _id: -1 }, //tells Mongo to look through documents in descending order
				upsert: false, //tells Mongo to NOT create a new doc if a match is not found
			}
		)
		.then((result) => {
			//after promise resolves, what Mongo returned is held in 'result'
			console.log('Marked Complete'); //server side log to show the db successfully updated
			response.json('Marked Complete'); //responds with client-side log that db was successfully updated
		})
		.catch((error) => console.error(error)); //if there is an error it will log server-side
});

app.put('/markUnComplete', (request, response) => {
	//tells express what to do when a PUT request is recived on the /markUnComplete route
	db.collection('todos') //tells Mongo to go to database 'todos'
		.updateOne(
			{ thing: request.body.itemFromJS }, //tells Mongo to find the item that was clicked on and sent in the req.body
			{
				$set: {
					completed: false, //tells Mongo to set that item's completed property to false
				},
			},
			{
				sort: { _id: -1 }, //tells Mongo to look through documents in descending order
				upsert: false, //tells Mongo to NOT create a new doc if a match is not found
			}
		)
		.then((result) => {
			//after promise resolves, what Mongo returned is held in 'result'
			console.log('UnMarked Complete'); //server side log to show the db successfully updated
			response.json('UnMarked Complete'); //responds with client-side log that db was successfully updated
		})
		.catch((error) => console.error(error)); //if there is an error it will log server-side
});

app.delete('/deleteItem', (request, response) => {
	//tells express what to do when a DEL request is recived on the /deleteItem route
	db.collection('todos') //tells Mongo to go to database 'todos'
		.deleteOne({ thing: request.body.itemFromJS }) //tells Mongo to find/delete the item that was clicked on and sent in the req.body
		.then((result) => {
			//after promise resolves, what Mongo returned is held in 'result'
			console.log('Todo Deleted'); //server side log to show the db successfully updated
			response.json('Todo Deleted'); //responds with client-side log that db was successfully updated
		})
		.catch((error) => console.error(error)); //if there is an error it will log server-side
});

app.listen(process.env.PORT || PORT, () => {
	//tells express to 'listen' for requests on the specified port in process.env
	console.log(`Server running on port ${PORT}`); // server-side log that the port is running properly
});
