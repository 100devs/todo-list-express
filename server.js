//imports express module
const express = require('express');
// stores the top-level function of express into app
const app = express();
// imports mongo db and mongoClient class for connecting to mongodb db and interactions
const MongoClient = require('mongodb').MongoClient;
// port number
const PORT = 2121;
// imports .dotenv file and config setups up the process.env and .env file
require('dotenv').config();

// sets up variables for db, db connection str, and the name of the db
let db,
	dbConnectionStr = process.env.DB_STRING,
	dbName = 'todo';

// connects to mongodb using the connection string, console.log connection to the db name and assigns the db to db variable
MongoClient.connect(dbConnectionStr).then((client) => {
	console.log(`Connected to ${dbName} Database`);
	db = client.db(dbName);
});

// sets the view engine to ejs to render dynamic content
app.set('view engine', 'ejs');
// makes all the static files in the public folder accessible throughout the program
app.use(express.static('public'));
// parses incoming requests from the form submissions into the req body
app.use(express.urlencoded({ extended: true }));
// requests with JSON payloads and makes the parsed JSON data available in the req.body object
app.use(express.json());

// get request to the root home page, async function
app.get('/', async (request, response) => {
	// waits till the db finds the todo collection, converts it to an array and stores it into todoItems variable
	const todoItems = await db.collection('todos').find().toArray();
	// waits till the db finds the todos collection and counts the number documents in the "todos" collection that have "completed" field as false and stores the result into the itemsLeft variable
	const itemsLeft = await db
		.collection('todos')
		.countDocuments({ completed: false });

	// renders a response of the index.ejs page and passes the todoItems variable into the items: object and and the itemsLeft variable into the object
	response.render('index.ejs', { items: todoItems, left: itemsLeft });
	// db.collection('todos').find().toArray()
	// .then(data => {
	//     db.collection('todos').countDocuments({completed: false})
	//     .then(itemsLeft => {
	//         response.render('index.ejs', { items: data, left: itemsLeft })
	//     })
	// })
	// .catch(error => console.error(error))
});

// post request to the addTodo route
app.post('/addTodo', (request, response) => {
	//accesses the todos collection
	db.collection('todos')
		// inserts the request body from the form submission and adds a completed of false property to the object
		.insertOne({ thing: request.body.todoItem, completed: false })
		.then((result) => {
			console.log('Todo Added');
			response.redirect('/');
		})
		.catch((error) => console.error(error));
});

// sends a put request to markcomplete route and runs callback
app.put('/markComplete', (request, response) => {
	// goes to db collection of todos and updates the thing property by setting the completed property to true
	db.collection('todos')
		.updateOne(
			{ thing: request.body.itemFromJS },
			{
				$set: {
					completed: true,
				},
			},
			{
				// sorting criteria in this case by descending
				sort: { _id: -1 },
				// does not create new todo if one doesnt exist
				upsert: false,
			}
		)
		// sends a console and server response to the client
		.then((result) => {
			console.log('Marked Complete');
			response.json('Marked Complete');
		})
		.catch((error) => console.error(error));
});

// sends a put req to markUnComplete to update the thing propety under todos collection in the mongodb db
app.put('/markUnComplete', (request, response) => {
	db.collection('todos')
		.updateOne(
			{ thing: request.body.itemFromJS },
			{
				// sets the completed property to false
				$set: {
					completed: false,
				},
			},
			{
				// sorts the criteria by descending via id and will not add new todos if there is already one
				sort: { _id: -1 },
				upsert: false,
			}
		)
		// sends response to console and client that it is complete
		.then((result) => {
			console.log('Marked Complete');
			response.json('Marked Complete');
		})
		.catch((error) => console.error(error));
});

// delete method sent to deleteItem route in the todos collection which then deletes the item and send a console and client response saying the todo was deleted.
app.delete('/deleteItem', (request, response) => {
	db.collection('todos')
		.deleteOne({ thing: request.body.itemFromJS })
		.then((result) => {
			console.log('Todo Deleted');
			response.json('Todo Deleted');
		})
		.catch((error) => console.error(error));
});

// listening for port to create server

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
