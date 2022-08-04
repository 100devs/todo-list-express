//Require express for use in application
const express = require('express');

//Create app variable to store express functions
const app = express();

//Require mongodb client so we can use it in the application
const MongoClient = require('mongodb').MongoClient;

//Set applications port to 2121
const PORT = 2121;

//Hide connection key for Mongodb. Require the use of it for application
require('dotenv').config();

//Create undeclared db with let for modification later
let db,
	//Assign dbConnectionStr to password in process.env.DB_STRING
	dbConnectionStr = process.env.DB_STRING,
	//Setting database name to 'todo' and declaring it as a variable
	dbName = 'todo';

//MonngoClient makes a connnection to dbConnectionStr. useUnifiedTopology set to true to opt into it
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
	//Create promise when connection happens
	.then(client => {
		//Console log if connection successful with dbName
		console.log(`Connected to ${dbName} Database`);
		// set db variable that was declared above on line 20 to database name
		db = client.db(dbName);
	});

//using express to set view engine to use ejs
app.set('view engine', 'ejs');

//using express to set a middleware to serve static files from public folder
app.use(express.static('public'));

//Parses incoming request with urlencoding. Based on body-parser. The “extended” syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded
app.use(express.urlencoded({ extended: true }));

//Parses incoming requests with JSON payloads
app.use(express.json());

//On root page load, create promise to return responses
app.get('/', async (request, response) => {
	//Create todoItems variable based on awaited promise response from db collection named 'todos'. Grabs all values and converts result into an array
	const todoItems = await db.collection('todos').find().toArray();
	//Create itemsLeft variable based on awaited promise response from db collection named 'todos'. Grabs a count of all values that are set to false
	const itemsLeft = await db
		.collection('todos')
		.countDocuments({ completed: false });
	//Takes the awaited response and renders the results into the DOM of todoItems and itemsLeft which are injected index.ejs. Setting items and left equal to todoItems and itemsLeft respectively
	response.render('index.ejs', { items: todoItems, left: itemsLeft });

	//Synchronous completing the above task. Using express to take advantage of async and await
	// db.collection('todos').find().toArray()
	// .then(data => {
	//     db.collection('todos').countDocuments({completed: false})
	//     .then(itemsLeft => {
	//         response.render('index.ejs', { items: data, left: itemsLeft })
	//     })
	// })
	// .catch(error => console.error(error))
});
//Routing HTTP POST request to the specified path '/addTodo' with a callback function (CREATE)
app.post('/addTodo', (request, response) => {
	//When '/addTodo' is called, we go to 'todos' db collection table and insert one key with a name of 'thing' and a value of the request body item. We set the key of 'completed' to the default of false
	db.collection('todos')
		.insertOne({ thing: request.body.todoItem, completed: false })
		//Setup call-back function
		.then(result => {
			//console log 'Todo Added' on server side
			console.log('Todo Added');
			//redirect user to root page
			response.redirect('/');
		})
		//Setup error handler to console log our errors ( if any, but hopefully not )
		.catch(error => console.error(error));
});

//Routing HTTP PUT request to the specified path '/markComplete' with a callback function (UPDATE)
app.put('/markComplete', (request, response) => {
	//When '/markComplete' is called, we go to the 'todos' db collection table and update one key with a name of 'thing' and a value of the request body from the form located in the main.js file
	db.collection('todos')
		.updateOne(
			{ thing: request.body.itemFromJS },
			{
				//set key of completed to true
				$set: {
					completed: true,
				},
			},
			{
				//sort list of items descending based on ID
				sort: { _id: -1 },
				//Sets upsert to false. On update it will not insert a new item if no match is found
				upsert: false,
			}
		)
		//Set up call back function
		.then(result => {
			//console log 'Marked Complete' on server side
			console.log('Marked Complete');
			//Send json response back with the value 'Marked Complete' to main.js (which is console logged on client side within main.js)
			response.json('Marked Complete');
		})
		//Setup error handler to console log our errors ( if any, but hopefully not )
		.catch(error => console.error(error));
});

//Routing HTTP PUT request to the specified path '/markUnComplete' with a callback function (UPDATE)
app.put('/markUnComplete', (request, response) => {
	//When '/markUnComplete' is called, we go to the 'todos' db collection table and update one key with a name of 'thing' and a value of the request body from the form located in the main.js file
	db.collection('todos')
		.updateOne(
			{ thing: request.body.itemFromJS },
			{
				$set: {
					//set key of completed to false
					completed: false,
				},
			},
			{
				//sort list of items descending based on ID
				sort: { _id: -1 },
				//Sets upsert to false. On update it will not insert a new item if no match is found
				upsert: false,
			}
		)
		//Set up call back function
		.then(result => {
			//console log 'Marked Complete' on server side
			console.log('Marked Complete');
			//Send json response back with the value 'Marked Complete' to main.js (which is console logged on client side within main.js)
			response.json('Marked Complete');
		})
		//Setup error handler to console log our errors ( if any, but hopefully not )
		.catch(error => console.error(error));
});

//Routing HTTP DELETE request to the specified path '/deleteItem' with a callback function (DELETE)
app.delete('/deleteItem', (request, response) => {
	//When '/deleteItem' is called, we go to the 'todos' db collection table and delete one key with a name of 'thing' and a value of the request body from the form located in the main.js file
	db.collection('todos')
		.deleteOne({ thing: request.body.itemFromJS })
		//Set up call back function
		.then(result => {
			//console log 'Todo Deleted' on server side
			console.log('Todo Deleted');
			//Send json response back with the value 'Todo Deleted' to main.js (which is console logged on client side within main.js)
			response.json('Todo Deleted');
		})
		//Setup error handler to console log our errors ( if any, but hopefully not )
		.catch(error => console.error(error));
});

//The app is set up to lisen on the environment port of the hosting website or use 2121 as the port
app.listen(process.env.PORT || PORT, () => {
	//console log server running on the port... better go catch it
	console.log(`Server running on port ${PORT}`);
});
